const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');
const AdminLog = require('../models/AdminLog');
const Ban = require('../models/Ban');
const Chat = require('../models/Chat');
const { protect, requireOwner, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/admin/ban-user
// @desc    Ban a user (temporary or permanent)
// @access  Private - Owner Only
router.post('/ban-user', protect, requireOwner, async (req, res) => {
  try {
    const { userId, reason, days, isPermanent } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({ success: false, message: 'User ID and reason required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const banExpiry = isPermanent ? null : new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    user.isBanned = true;
    user.banReason = reason;
    user.banExpiry = banExpiry;
    user.isPermanentBan = isPermanent;
    await user.save();

    const ban = await Ban.create({
      user: userId,
      bannedBy: req.user._id,
      reason,
      duration: isPermanent ? null : days,
      isPermanent,
      expiresAt: banExpiry,
    });

    await AdminLog.create({
      action: 'user_banned',
      performedBy: req.user._id,
      targetUser: userId,
      reason,
      details: { isPermanent, days },
    });

    res.status(200).json({ success: true, message: 'User banned successfully', ban });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/admin/unban-user
// @desc    Unban a user
// @access  Private - Owner Only
router.post('/unban-user', protect, requireOwner, async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isBanned = false;
    user.banReason = null;
    user.banExpiry = null;
    user.isPermanentBan = false;
    await user.save();

    await Ban.updateOne({ user: userId }, { status: 'lifted', liftedAt: new Date() });

    await AdminLog.create({
      action: 'user_unbanned',
      performedBy: req.user._id,
      targetUser: userId,
    });

    res.status(200).json({ success: true, message: 'User unbanned successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/promote-admin
// @desc    Promote user to admin
// @access  Private - Owner Only
router.post('/promote-admin', protect, requireOwner, async (req, res) => {
  try {
    const { userId, canDeleteMessages, canTempBan } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = 'admin';
    user.adminPermissions = {
      canDeleteMessages: canDeleteMessages || false,
      canTempBan: canTempBan || false,
    };
    await user.save();

    await AdminLog.create({
      action: 'admin_promoted',
      performedBy: req.user._id,
      targetUser: userId,
      details: { canDeleteMessages, canTempBan },
    });

    res.status(200).json({ success: true, message: 'User promoted to admin', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/demote-admin
// @desc    Demote admin to user
// @access  Private - Owner Only
router.post('/demote-admin', protect, requireOwner, async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = 'user';
    user.adminPermissions = { canDeleteMessages: false, canTempBan: false };
    await user.save();

    await AdminLog.create({
      action: 'admin_demoted',
      performedBy: req.user._id,
      targetUser: userId,
    });

    res.status(200).json({ success: true, message: 'Admin demoted to user', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/logs
// @desc    Get all admin logs
// @access  Private - Owner Only
router.get('/logs', protect, requireOwner, async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate('performedBy', 'username')
      .populate('targetUser', 'username email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/private-messages
// @desc    Get private messages (Owner can view)
// @access  Private - Owner Only
router.get('/private-messages/:chatId', protect, requireOwner, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('sender', 'username profilePicture')
      .populate('replyTo')
      .sort({ createdAt: 1 });

    await AdminLog.create({
      action: 'private_message_viewed',
      performedBy: req.user._id,
      targetChat: req.params.chatId,
    });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/admin/message/:messageId
// @desc    Delete a message
// @access  Private - Owner/Admin
router.delete('/message/:messageId', protect, requireAdmin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.isDeleted = true;
    message.deletedBy = req.user._id;
    message.deletedAt = new Date();
    await message.save();

    await AdminLog.create({
      action: 'message_deleted',
      performedBy: req.user._id,
      targetMessage: req.params.messageId,
    });

    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/mute-user
// @desc    Chat mute a user
// @access  Private - Owner Only
router.post('/mute-user', protect, requireOwner, async (req, res) => {
  try {
    const { userId, days } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isChatMuted = true;
    user.chatMuteExpiry = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await user.save();

    await AdminLog.create({
      action: 'user_muted',
      performedBy: req.user._id,
      targetUser: userId,
      details: { days },
    });

    res.status(200).json({ success: true, message: 'User muted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/unmute-user
// @desc    Chat unmute a user
// @access  Private - Owner Only
router.post('/unmute-user', protect, requireOwner, async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isChatMuted = false;
    user.chatMuteExpiry = null;
    await user.save();

    await AdminLog.create({
      action: 'user_unmuted',
      performedBy: req.user._id,
      targetUser: userId,
    });

    res.status(200).json({ success: true, message: 'User unmuted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/reset-password
// @desc    Reset user password
// @access  Private - Owner Only
router.post('/reset-password', protect, requireOwner, async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    await AdminLog.create({
      action: 'user_password_reset',
      performedBy: req.user._id,
      targetUser: userId,
    });

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/delete-user
// @desc    Delete user account
// @access  Private - Owner Only
router.post('/delete-user', protect, requireOwner, async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await AdminLog.create({
      action: 'user_deleted',
      performedBy: req.user._id,
      details: { username: user.username, email: user.email },
    });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/channel-lock
// @desc    Lock/unlock private messaging
// @access  Private - Owner Only
router.post('/channel-lock', protect, requireOwner, async (req, res) => {
  try {
    const { chatId, isLocked } = req.body;

    const chat = await Chat.findByIdAndUpdate(chatId, { isLocked }, { new: true });

    await AdminLog.create({
      action: isLocked ? 'channel_locked' : 'channel_unlocked',
      performedBy: req.user._id,
      targetChat: chatId,
    });

    res.status(200).json({ success: true, message: `Channel ${isLocked ? 'locked' : 'unlocked'}`, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/slowmode
// @desc    Set slowmode for a channel
// @access  Private - Owner Only
router.post('/slowmode', protect, requireOwner, async (req, res) => {
  try {
    const { chatId, seconds } = req.body;

    const chat = await Chat.findByIdAndUpdate(chatId, { slowmodeSeconds: seconds }, { new: true });

    await AdminLog.create({
      action: seconds > 0 ? 'slowmode_enabled' : 'slowmode_disabled',
      performedBy: req.user._id,
      targetChat: chatId,
      details: { seconds },
    });

    res.status(200).json({ success: true, message: 'Slowmode updated', chat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/lockdown
// @desc    Lockdown all channels
// @access  Private - Owner Only
router.post('/lockdown', protect, requireOwner, async (req, res) => {
  try {
    const { isLockedDown } = req.body;

    await Chat.updateMany({}, { isLockedDown });

    await AdminLog.create({
      action: isLockedDown ? 'lockdown_enabled' : 'lockdown_disabled',
      performedBy: req.user._id,
    });

    res.status(200).json({ success: true, message: `Server ${isLockedDown ? 'locked down' : 'unlocked'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
