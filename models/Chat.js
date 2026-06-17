const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: String,
  description: String,
  isGroup: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  isAnnouncement: {
    type: Boolean,
    default: false,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  slowmodeSeconds: {
    type: Number,
    default: 0,
  },
  isLockedDown: {
    type: Boolean,
    default: false,
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  avatar: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chat',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', chatSchema);
