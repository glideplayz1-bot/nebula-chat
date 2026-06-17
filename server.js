const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chats', require('./routes/chats'));
app.use('/api/admin', require('./routes/admin'));

// Serve index.html for all routes (SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO for real-time messaging
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins
  socket.on('user_join', (userId) => {
    activeUsers.set(userId, socket.id);
    io.emit('user_online', userId);
    console.log(`User ${userId} is online`);
  });

  // Send message
  socket.on('send_message', (data) => {
    io.to(data.chatId).emit('receive_message', data);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    io.to(data.chatId).emit('user_typing', data);
  });

  // Stop typing
  socket.on('stop_typing', (data) => {
    io.to(data.chatId).emit('user_stop_typing', data);
  });

  // Join chat room
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
  });

  // Leave chat room
  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
  });

  // User status change
  socket.on('status_change', (data) => {
    io.emit('user_status', data);
  });

  // Ping notification
  socket.on('send_ping', (data) => {
    const recipientSocket = activeUsers.get(data.recipientId);
    if (recipientSocket) {
      io.to(recipientSocket).emit('receive_ping', data);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    for (let [userId, socketId] of activeUsers) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        io.emit('user_offline', userId);
        console.log(`User ${userId} is offline`);
        break;
      }
    }
  });
});

module.exports = { app, io, server };
