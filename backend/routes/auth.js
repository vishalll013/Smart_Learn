const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { protect, authorize } = require('../middleware/auth');

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, parentEmail } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    let parentId = null;
    if (role === 'student' && parentEmail) {
      const parent = await User.findOne({ email: parentEmail, role: 'parent' });
      if (parent) {
        parentId = parent._id;
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      parentId,
    });

    // If student was created and parent was found, link child in parent document
    if (role === 'student' && parentId) {
      await User.findByIdAndUpdate(parentId, {
        $push: { childrenIds: user._id },
      });
    }

    // Initialize blank progress document for student
    if (role === 'student') {
      await Progress.create({
        userId: user._id,
        courseProgress: [],
        quizHistory: [],
        gameHistory: [],
      });
    }

    // Sign JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        streak: user.streak,
        badges: user.badges,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Sign JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        streak: user.streak,
        badges: user.badges,
        parentId: user.parentId,
        childrenIds: user.childrenIds,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current logged in user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('childrenIds', 'name email points streak completedLessons');
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all users (for Admin dashboard or Parent pairing)
// @route   GET /api/auth/users
// @access  Private
router.get('/users', protect, async (req, res) => {
  try {
    let users;
    // Admins see all, others only relative profiles
    if (req.user.role === 'admin') {
      users = await User.find({}).populate('parentId', 'name email');
    } else if (req.user.role === 'teacher') {
      users = await User.find({ role: 'student' });
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
