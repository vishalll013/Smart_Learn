const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get announcements based on current role target
// @route   GET /api/announcements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { target } = req.query; // student, parent, all
    let query = {};

    if (target) {
      query.roleTarget = { $in: [target, 'all'] };
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: announcements.length, announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private (Teacher or Admin only)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, content, roleTarget } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      roleTarget: roleTarget || 'all',
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Teacher or Admin only)
router.delete('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    if (announcement.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this' });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
