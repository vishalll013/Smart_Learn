const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all courses with optional filters (category, search, difficulty)
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query).populate('createdBy', 'name role');
    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy', 'name role');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Teacher or Admin only)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, category, description, difficulty, duration, thumbnail, lessons } = req.body;

    const course = await Course.create({
      title,
      category,
      description,
      difficulty,
      duration,
      thumbnail: thumbnail || `https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400&auto=format&fit=crop`,
      lessons: lessons || [],
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Teacher or Admin only)
router.put('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check course owner
    if (course.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher or Admin only)
router.delete('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check course owner
    if (course.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mark a lesson as completed & update progress percentage
// @route   POST /api/courses/:id/lessons/:lessonId/complete
// @access  Private (Student only)
router.post('/:id/lessons/:lessonId/complete', protect, authorize('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const totalLessons = course.lessons.length;
    if (totalLessons === 0) {
      return res.status(400).json({ success: false, message: 'Course has no lessons' });
    }

    // Find progress doc for student
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id, courseProgress: [] });
    }

    // Check if course is already in student's courseProgress array
    let courseIndex = progress.courseProgress.findIndex(
      (cp) => cp.courseId.toString() === req.params.id
    );

    const lessonObjectId = course.lessons.id(req.params.lessonId)._id;

    if (courseIndex === -1) {
      // Create new progress record for this course
      progress.courseProgress.push({
        courseId: req.params.id,
        completedLessons: [lessonObjectId],
        progressPercent: Math.round((1 / totalLessons) * 100),
        lastAccessed: Date.now(),
      });
    } else {
      // Course progress exists, add completed lesson if not already completed
      const lessonsArr = progress.courseProgress[courseIndex].completedLessons;
      if (!lessonsArr.includes(lessonObjectId)) {
        lessonsArr.push(lessonObjectId);
        const percent = Math.round((lessonsArr.length / totalLessons) * 100);
        progress.courseProgress[courseIndex].progressPercent = percent;
        progress.courseProgress[courseIndex].lastAccessed = Date.now();
      }
    }

    await progress.save();

    // Grant gamification points & streaks
    const pointsGained = 15; // 15 points per completed lesson
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { points: pointsGained, completedLessons: 1 },
      },
      { new: true }
    );

    // Check for milestone badge awards
    let badgeAwarded = null;
    if (updatedUser.completedLessons === 1) {
      badgeAwarded = {
        name: 'First Step',
        description: 'Completed your first lesson!',
        icon: '🎯'
      };
    } else if (updatedUser.completedLessons === 5) {
      badgeAwarded = {
        name: 'Curious Mind',
        description: 'Completed 5 lessons!',
        icon: '📚'
      };
    } else if (updatedUser.completedLessons === 10) {
      badgeAwarded = {
        name: 'Scholar Kid',
        description: 'Completed 10 lessons!',
        icon: '🧠'
      };
    }

    if (badgeAwarded) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { badges: badgeAwarded }
      });
    }

    // Check if progress is 100% and generate certificate
    courseIndex = progress.courseProgress.findIndex(
      (cp) => cp.courseId.toString() === req.params.id
    );
    const updatedProgress = progress.courseProgress[courseIndex];
    if (updatedProgress.progressPercent === 100) {
      const certExists = progress.certificates.find((c) => c.courseId.toString() === req.params.id);
      if (!certExists) {
        const certificateId = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        progress.certificates.push({
          courseId: req.params.id,
          courseTitle: course.title,
          issuedAt: Date.now(),
          certificateId
        });
        await progress.save();
      }
    }

    res.json({
      success: true,
      progressPercent: updatedProgress.progressPercent,
      completedLessons: updatedProgress.completedLessons,
      pointsGained,
      userPoints: updatedUser.points,
      badgeAwarded
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
