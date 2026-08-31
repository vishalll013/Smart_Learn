const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  quizTitle: String,
  score: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  }
});

const GameAttemptSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  }
});

const CourseProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  progressPercent: {
    type: Number,
    default: 0,
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  lastAccessed: {
    type: Date,
    default: Date.now,
  }
});

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  courseProgress: [CourseProgressSchema],
  quizHistory: [QuizAttemptSchema],
  gameHistory: [GameAttemptSchema],
  certificates: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    courseTitle: String,
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    certificateId: {
      type: String,
      required: true,
    }
  }],
  lastActiveAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Progress', ProgressSchema);
