const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  },
  bio: {
    type: String,
    default: 'No bio yet',
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['online', 'dnd', 'offline'],
    default: 'offline',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user',
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  banReason: String,
  banExpiry: Date,
  isPermanentBan: {
    type: Boolean,
    default: false,
  },
  isChatMuted: {
    type: Boolean,
    default: false,
  },
  chatMuteExpiry: Date,
  adminPermissions: {
    canDeleteMessages: {
      type: Boolean,
      default: false,
    },
    canTempBan: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastSeen: Date,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user is banned
userSchema.methods.checkBanStatus = function () {
  if (!this.isBanned) return false;
  if (this.isPermanentBan) return true;
  if (this.banExpiry && this.banExpiry > new Date()) return true;
  return false;
};

module.exports = mongoose.model('User', userSchema);
