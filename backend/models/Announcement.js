const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an announcement title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add details content'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roleTarget: {
    type: String,
    enum: ['student', 'parent', 'all'],
    default: 'all',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
