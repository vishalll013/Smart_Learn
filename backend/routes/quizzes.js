const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all quizzes with optional category/difficulty filters
// @route   GET /api/quizzes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const quizzes = await Quiz.find(query).populate('createdBy', 'name role');
    res.json({ success: true, count: quizzes.length, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get leaderboard rankings
// @route   GET /api/quizzes/leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    // Get top 10 students ordered by points desc
    const leaders = await User.find({ role: 'student' })
      .select('name points streak badges')
      .sort({ points: -1 })
      .limit(10);
      
    res.json({ success: true, leaders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get a specific quiz
// @route   GET /api/quizzes/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name role');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Teacher or Admin only)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, category, courseId, difficulty, timeLimitSeconds, questions } = req.body;

    const quiz = await Quiz.create({
      title,
      category,
      courseId: courseId || null,
      difficulty: difficulty || 'Beginner',
      timeLimitSeconds: timeLimitSeconds || 60,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Teacher or Admin only)
router.delete('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this quiz' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Submit quiz answers and evaluate score
// @route   POST /api/quizzes/:id/submit
// @access  Private (Student only)
router.post('/:id/submit', protect, authorize('student'), async (req, res) => {
  try {
    const { answers } = req.body; // Array of integers representing student options selected
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let correctCount = 0;
    const feedback = quiz.questions.map((q, idx) => {
      const studentAnswer = answers[idx];
      const isCorrect = studentAnswer === q.correctAnswerIndex;
      if (isCorrect) {
        correctCount++;
      }
      return {
        questionText: q.questionText,
        options: q.options,
        studentAnswer,
        correctAnswer: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const maxScore = quiz.questions.length;
    const scorePercent = Math.round((correctCount / maxScore) * 100);

    // Save to user progress history
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id, courseProgress: [], quizHistory: [] });
    }

    progress.quizHistory.push({
      quizId: quiz._id,
      quizTitle: quiz.title,
      score: correctCount,
      maxScore,
      completedAt: Date.now(),
    });

    await progress.save();

    // Reward points for quiz attempt and quiz scores
    // Base participation: 10 points
    // Correct answer bonus: 10 points each
    // Perfect score bonus: 30 points
    let pointsEarned = 10 + correctCount * 10;
    if (correctCount === maxScore) {
      pointsEarned += 30;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { points: pointsEarned },
      },
      { new: true }
    );

    // Check for Quiz Champion Badge if score is 100%
    let badgeAwarded = null;
    const totalQuizzesCompleted = progress.quizHistory.length;

    if (correctCount === maxScore) {
      const hasPerfectBadge = updatedUser.badges.some((b) => b.name === 'Quiz Champ');
      if (!hasPerfectBadge) {
        badgeAwarded = {
          name: 'Quiz Champ',
          description: 'Scored 100% on a quiz!',
          icon: '👑'
        };
      }
    } else if (totalQuizzesCompleted === 5) {
      const hasFiveBadge = updatedUser.badges.some((b) => b.name === 'Trivia Master');
      if (!hasFiveBadge) {
        badgeAwarded = {
          name: 'Trivia Master',
          description: 'Completed 5 quizzes!',
          icon: '🌟'
        };
      }
    }

    if (badgeAwarded) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { badges: badgeAwarded }
      });
    }

    res.json({
      success: true,
      score: correctCount,
      maxScore,
      scorePercent,
      feedback,
      pointsEarned,
      userPoints: updatedUser.points,
      badgeAwarded,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
