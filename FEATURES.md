# Nebula Chat - Features Overview

## 🎯 Core Features

### User Management
- **Authentication**: Secure signup and login with JWT
- **Profiles**: User bio, profile picture, status
- **Account Settings**: Change password, logout all devices
- **Status Management**: Online, Do Not Disturb, Offline

### Messaging
- **Direct Messages**: One-on-one private chats
- **Group Chats**: Create and manage group conversations
- **Public Chat**: Global chat channel for all users
- **Message Replies**: Quote and reply to specific messages
- **@Mentions**: Tag users with @username for notifications
- **Pings**: Get notifications when mentioned
- **Real-time Updates**: Instant message delivery via Socket.IO
- **Typing Indicators**: See when others are typing

### Admin Features (Owner Only)

#### User Management
- **Ban/Unban**: Temporary (with days) or permanent bans
- **Chat Mute**: Prevent users from chatting
- **Promote to Admin**: Give users moderation rights
- **Reset Password**: Override user passwords
- **Delete Accounts**: Remove user accounts

#### Chat Controls
- **Channel Lock**: Lock/unlock private messaging
- **Slowmode**: Limit message frequency (in seconds)
- **Server Lockdown**: Lock all channels at once
- **Announcements Channel**: Owner/Admin only posting

#### Monitoring & Logs
- **Admin Logs**: Track all actions (user creation, deletions, bans, etc.)
- **View Private Messages**: Inspect private conversations
- **Delete Messages**: Remove inappropriate messages
- **Message History**: Complete audit trail

### Admin Permissions
Admins can have specific permissions:
- Delete messages
- Temporary ban users (not permanent)
- Chat mute/unmute
- View logs

## 🚀 Technical Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs password hashing
- **File Upload**: Multer

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Vanilla JS (no framework)
- **Icons**: Font Awesome
- **Real-time**: Socket.IO client

## 📱 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop experience
- Collapsible sidebar on mobile

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Authorization middleware
- Ban system with expiry
- Admin action logging
- CORS protection

## 📊 Database Models

### User
- username, email, password (hashed)
- profilePicture, bio
- status (online/dnd/offline)
- role (user/admin/owner)
- ban information
- chat mute status
- admin permissions

### Message
- sender (reference to User)
- content
- chatId (reference to Chat)
- replyTo (reference to Message)
- mentions (array of User references)
- isDeleted flag
- deletedBy (reference to User)
- timestamps

### Chat
- name (for groups)
- members (array of User references)
- admin (reference to User)
- isGroup, isPublic, isAnnouncement flags
- locked, slowmode, lockdown flags
- lastMessage reference
- timestamps

### AdminLog
- action (type of action performed)
- performedBy (reference to User)
- targetUser, targetChat, targetMessage
- reason, details
- ipAddress, userAgent
- timestamp

### Ban
- user (reference to User)
- bannedBy (reference to User)
- reason, duration
- isPermanent flag
- expiresAt date
- status (active/lifted)
- timestamps

## 🎨 UI/UX Features

- Modern gradient design (Purple theme)
- Smooth animations and transitions
- Dark sidebar with light chat area
- Real-time user status indicators
- Message notifications (toast)
- Modal dialogs for settings/admin
- Responsive layout
- Accessibility considerations

## 📦 Deployment Options

### Web
- Heroku
- AWS
- DigitalOcean
- Render
- Railway

### Desktop
- Electron (Windows .exe, Mac .dmg, Linux .AppImage)

### Mobile
- Cordova (Android .apk, iOS .ipa)
- React Native
- Flutter (with web services)

## 🔄 Real-time Features

- Live message delivery
- User online/offline status
- Typing indicators
- Ping notifications
- Status updates
- Connection state management

## 📝 What You Can Do

### As a Regular User
1. Sign up and create an account
2. Browse and chat with other users in DMs
3. Create group chats
4. Participate in public chat
5. Edit your profile (bio, picture, status)
6. Change your password
7. Get notifications when mentioned
8. Reply to specific messages

### As an Owner (RequiredTest)
1. Do everything a user can do
2. Ban/unban users (temp or permanent)
3. Mute users from chatting
4. View private conversations
5. Delete messages
6. Reset user passwords
7. Delete user accounts
8. Promote users to admin
9. View complete activity logs
10. Control channels (lock/unlock)
11. Set slowmode
12. Perform server lockdown
13. Manage announcements

## 🎓 Learning Resources

This project teaches:
- Full-stack MERN development
- Real-time WebSocket communication
- Authentication & Authorization
- Database design and modeling
- RESTful API design
- Frontend/Backend integration
- UI/UX design principles
- Deployment strategies

## 🐛 Known Limitations

- File uploads currently support images only
- Message search not yet implemented
- No voice/video calling (can be added)
- No message reactions (can be added)
- No custom themes (can be added)
- No dark mode toggle (can be added)

## 🚀 Future Enhancements

- [ ] Voice messaging
- [ ] Video calls
- [ ] Message reactions (emojis)
- [ ] Custom themes/dark mode
- [ ] Message search
- [ ] User blocking
- [ ] Friend requests
- [ ] Notifications API
- [ ] Two-factor authentication
- [ ] End-to-end encryption
- [ ] Message scheduling
- [ ] Role-based permissions system
- [ ] Rate limiting
- [ ] Advanced moderation tools

## 📄 License

MIT License - Free to use and modify
