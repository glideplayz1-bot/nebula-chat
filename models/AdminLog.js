const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: [
      'user_created',
      'user_deleted',
      'user_banned',
      'user_unbanned',
      'user_muted',
      'user_unmuted',
      'message_deleted',
      'message_edited',
      'admin_promoted',
      'admin_demoted',
      'channel_locked',
      'channel_unlocked',
      'slowmode_enabled',
      'slowmode_disabled',
      'announcement_posted',
      'user_password_reset',
      'private_message_viewed',
    ],
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  targetChat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  },
  targetMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  details: mongoose.Schema.Types.Mixed,
  reason: String,
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
