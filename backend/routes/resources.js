const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, type } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (type) {
      query.type = type;
    }

    const resources = await Resource.find(query).populate('createdBy', 'name role');
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private (Teacher or Admin only)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, category, type, url, size } = req.body;

    const resource = await Resource.create({
      title,
      description,
      category: category || 'General',
      type: type || 'pdf',
      url,
      size: size || '1.0 MB',
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Increment download count
// @route   POST /api/resources/:id/download
// @access  Public
router.post('/:id/download', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    resource.downloadsCount += 1;
    await resource.save();

    res.json({ success: true, downloadsCount: resource.downloadsCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private (Teacher or Admin only)
router.delete('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
