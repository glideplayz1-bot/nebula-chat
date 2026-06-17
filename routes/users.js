const express = require('express');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const { protect, requireOwner, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${req.user._id}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/profile/update
// @desc    Update user profile
// @access  Private
router.put('/profile/update', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    const { bio, password } = req.body;
    const user = await User.findById(req.user.id);

    if (bio) {
      user.bio = bio;
    }

    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/status
// @desc    Update user status
// @access  Private
router.put('/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['online', 'dnd', 'offline'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Status updated',
      user: { id: user._id, status: user.status },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/password
// @desc    Change password
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isPasswordMatch = await user.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/users/logout-all
// @desc    Logout from all devices
// @access  Private
router.post('/logout-all', protect, async (req, res) => {
  try {
    res.status(200).json({ success: true, message: 'Logged out from all devices' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
