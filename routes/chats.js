const express = require('express');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const { protect, requireOwner } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/chats/create-dm
// @desc    Create or get DM with a user
// @access  Private
router.post('/create-dm', protect, async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (req.user._id.toString() === recipientId) {
      return res.status(400).json({ success: false, message: 'Cannot DM yourself' });
    }

    let chat = await Chat.findOne({
      isGroup: false,
      isPublic: false,
      members: { $all: [req.user._id, recipientId] },
    });

    if (!chat) {
      chat = await Chat.create({
        members: [req.user._id, recipientId],
        isGroup: false,
        isPublic: false,
      });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/chats/create-group
// @desc    Create a group chat
// @access  Private
router.post('/create-group', protect, async (req, res) => {
  try {
    const { name, memberIds } = req.body;

    if (!name || !memberIds || memberIds.length < 2) {
      return res.status(400).json({ success: false, message: 'Group must have a name and at least 2 members' });
    }

    const chat = await Chat.create({
      name,
      members: [req.user._id, ...memberIds],
      isGroup: true,
      isPublic: false,
      admin: req.user._id,
    });

    res.status(201).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/chats
// @desc    Get all chats for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ members: req.user._id }, { isPublic: true }],
    })
      .populate('members', 'username profilePicture status')
      .populate('admin', 'username')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/chats/:chatId/send-message
// @desc    Send a message
// @access  Private
router.post('/:chatId/send-message', protect, async (req, res) => {
  try {
    const { content, replyToId, mentions } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    if (req.user.isBanned) {
      return res.status(403).json({ success: false, message: 'You are banned' });
    }

    if (req.user.isChatMuted && req.user.chatMuteExpiry > new Date()) {
      return res.status(403).json({ success: false, message: 'You are chat muted' });
    }

    if (chat.isLocked && !chat.members.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'This chat is locked' });
    }

    const message = await Message.create({
      sender: req.user._id,
      content,
      chatId: req.params.chatId,
      replyTo: replyToId || null,
      mentions: mentions || [],
      isPublic: chat.isPublic,
      isPrivate: !chat.isPublic && !chat.isGroup,
      recipients: chat.members,
    });

    await message.populate('sender', 'username profilePicture');
    await message.populate('replyTo');

    await Chat.findByIdAndUpdate(req.params.chatId, { lastMessage: message._id });

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/chats/:chatId/messages
// @desc    Get messages from a chat
// @access  Private
router.get('/:chatId/messages', protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    if (!chat.members.includes(req.user._id) && !chat.isPublic) {
      return res.status(403).json({ success: false, message: 'Not a member of this chat' });
    }

    const messages = await Message.find({ chatId: req.params.chatId, isDeleted: false })
      .populate('sender', 'username profilePicture')
      .populate('replyTo')
      .populate('mentions', 'username')
      .sort({ createdAt: 1 })
      .limit(50);

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/chats/:chatId/add-member
// @desc    Add member to group chat
// @access  Private
router.post('/:chatId/add-member', protect, async (req, res) => {
  try {
    const { memberId } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    if (!chat.isGroup || chat.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only group admin can add members' });
    }

    if (!chat.members.includes(memberId)) {
      chat.members.push(memberId);
      await chat.save();
    }

    res.status(200).json({ success: true, message: 'Member added', chat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/chats/:chatId/remove-member
// @desc    Remove member from group chat
// @access  Private
router.post('/:chatId/remove-member', protect, async (req, res) => {
  try {
    const { memberId } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    if (!chat.isGroup || chat.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only group admin can remove members' });
    }

    chat.members = chat.members.filter((m) => m.toString() !== memberId);
    await chat.save();

    res.status(200).json({ success: true, message: 'Member removed', chat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
