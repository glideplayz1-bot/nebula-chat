const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  duration: Number, // in days, null for permanent
  isPermanent: {
    type: Boolean,
    default: false,
  },
  expiresAt: Date,
  status: {
    type: String,
    enum: ['active', 'lifted'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  liftedAt: Date,
});

module.exports = mongoose.model('Ban', banSchema);
