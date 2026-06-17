# Nebula Chat

A full-featured real-time chat application with admin controls, user management, and advanced messaging features.

## Features

### User Features
- 🔐 Secure Authentication (Signup/Login)
- 💬 Real-time Direct Messaging
- 👥 Group Chats
- 🌐 Public Chat Channel
- 👤 User Profiles with Bio
- 🖼️ Profile Picture Upload
- 🔔 @Mentions and Pings
- 💤 Status Management (Online/Do Not Disturb/Offline)
- 🔄 Message Replies (Thread-like)
- ⚙️ Settings Panel (Password, Bio, Logout All)

### Admin & Owner Features
- 🛡️ Admin Panel
- 🚫 Ban/Unban Users (Temporary or Permanent)
- 📝 View Private Messages
- 🗑️ Delete Messages
- 📊 Site Logs (Account Creation, Deletions, Bans)
- 🔑 Reset User Passwords
- 👮 Make Users Admins
- 🔇 Chat Mute/Unmute
- 🔒 Channel Locking
- ⏱️ Slowmode Controls
- 📢 Announcements Channel
- 🔄 Message Replies

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/glideplayz1-bot/nebula-chat.git
cd nebula-chat
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5000`

## Owner Account

Sign up with username: **RequiredTest** to access the owner panel with full admin capabilities.

## Project Structure

```
nebula-chat/
├── server.js                 # Main server file
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── User.js              # User schema
│   ├── Message.js           # Message schema
│   ├── Chat.js              # Chat/Group schema
│   ├── Ban.js               # Ban records schema
│   ├── AdminLog.js          # Admin action logs
│   └── Announcement.js      # Announcements schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management
│   ├── messages.js          # Message endpoints
│   ├── admin.js             # Admin panel routes
│   └── chats.js             # Chat management
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── admin.js             # Admin verification
├── public/
│   ├── index.html           # Main HTML file
│   ├── css/
│   │   └── style.css        # Styling
│   └── js/
│       ├── app.js           # Main app logic
│       ├── socket.js        # Socket.IO setup
│       ├── ui.js            # UI interactions
│       └── auth.js          # Frontend auth
└── uploads/                 # User uploads (avatars)
```

## API Documentation

See API_DOCS.md for complete endpoint documentation.

## Building for Desktop/Mobile

### Windows (.exe)
```bash
npm install electron --save-dev
npx electron-builder --win
```

### Android (.apk)
```bash
npm install cordova -g
cordova create nebula-chat-mobile
cordova platform add android
cordova build android
```

## License

MIT License
