// Socket.IO Setup
let socket = null;
const connectedUsers = new Map();

const socketService = {
  init: (userId) => {
    socket = io();

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('user_join', userId);
    });

    socket.on('user_online', (userId) => {
      connectedUsers.set(userId, 'online');
      updateUserStatus(userId, 'online');
    });

    socket.on('user_offline', (userId) => {
      connectedUsers.delete(userId);
      updateUserStatus(userId, 'offline');
    });

    socket.on('receive_message', (message) => {
      displayMessage(message);
    });

    socket.on('user_typing', (data) => {
      showTypingIndicator(data);
    });

    socket.on('receive_ping', (data) => {
      handlePingNotification(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  },

  sendMessage: (chatId, content, replyToId = null, mentions = []) => {
    socket.emit('send_message', {
      chatId,
      content,
      sender: currentUser.id,
      replyToId,
      mentions,
      timestamp: new Date(),
    });
  },

  joinChat: (chatId) => {
    socket.emit('join_chat', chatId);
  },

  leaveChat: (chatId) => {
    socket.emit('leave_chat', chatId);
  },

  typing: (chatId) => {
    socket.emit('typing', {
      chatId,
      userId: currentUser.id,
      username: currentUser.username,
    });
  },

  stopTyping: (chatId) => {
    socket.emit('stop_typing', {
      chatId,
      userId: currentUser.id,
    });
  },

  updateStatus: (status) => {
    socket.emit('status_change', {
      userId: currentUser.id,
      status,
    });
  },

  sendPing: (recipientId, message) => {
    socket.emit('send_ping', {
      recipientId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      message,
    });
  },
};
