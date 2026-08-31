const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  }
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a quiz title'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Mathematics',
      'Science',
      'English',
      'Computer Skills',
      'Coding for Kids',
      'General Knowledge',
      'Environmental Studies',
      'Creative Arts',
    ],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  timeLimitSeconds: {
    type: Number,
    default: 60, // 60 seconds by default
  },
  questions: [QuestionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quiz', QuizSchema);
