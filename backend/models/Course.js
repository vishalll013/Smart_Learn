const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['reading', 'video', 'interactive'],
    default: 'reading',
  },
  content: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    default: '',
  },
  durationMinutes: {
    type: Number,
    default: 15,
  }
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
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
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  difficulty: {
    type: String,
    required: [true, 'Please add a difficulty level'],
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  duration: {
    type: String,
    required: [true, 'Please add an estimated duration (e.g. "4 hours")'],
  },
  thumbnail: {
    type: String,
    default: '',
  },
  lessons: [LessonSchema],
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

module.exports = mongoose.model('Course', CourseSchema);
