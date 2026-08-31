const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a resource title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
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
      'General'
    ],
    default: 'General'
  },
  type: {
    type: String,
    enum: ['worksheet', 'pdf', 'video', 'link'],
    default: 'pdf',
  },
  url: {
    type: String,
    required: [true, 'Please add a file link or video URL'],
  },
  size: {
    type: String,
    default: 'N/A', // e.g. "2.4 MB"
  },
  downloadsCount: {
    type: Number,
    default: 0,
  },
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

module.exports = mongoose.model('Resource', ResourceSchema);
