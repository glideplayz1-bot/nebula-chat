# Installation & Setup Guide

## Nebula Chat - Full-Stack Application

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/glideplayz1-bot/nebula-chat.git
cd nebula-chat
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nebula-chat
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Step 4: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
- Create a cluster on MongoDB Atlas
- Get your connection string
- Update `MONGODB_URI` in `.env`

### Step 5: Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## Creating the Owner Account

To access the admin panel, sign up with the username: **RequiredTest**

### Example Account:
- Username: `RequiredTest`
- Email: `owner@nebulachat.com`
- Password: `YourSecurePassword123`

Once signed up, you'll have full owner access to:
- Ban/Unban users
- View private messages
- Delete messages
- Reset user passwords
- Promote users to admin
- View all system logs
- Control channels (lock, slowmode, lockdown)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile/update` - Update profile
- `PUT /api/users/status` - Update user status
- `PUT /api/users/password` - Change password
- `POST /api/users/logout-all` - Logout all devices

### Chats
- `GET /api/chats` - Get all chats
- `POST /api/chats/create-dm` - Create DM
- `POST /api/chats/create-group` - Create group chat
- `GET /api/chats/:chatId/messages` - Get messages
- `POST /api/chats/:chatId/send-message` - Send message
- `POST /api/chats/:chatId/add-member` - Add member to group
- `POST /api/chats/:chatId/remove-member` - Remove member from group

### Admin (Owner Only)
- `POST /api/admin/ban-user` - Ban a user
- `POST /api/admin/unban-user` - Unban a user
- `POST /api/admin/promote-admin` - Promote to admin
- `POST /api/admin/demote-admin` - Demote from admin
- `GET /api/admin/logs` - Get admin logs
- `GET /api/admin/private-messages/:chatId` - View private messages
- `DELETE /api/admin/message/:messageId` - Delete message
- `POST /api/admin/mute-user` - Mute user
- `POST /api/admin/unmute-user` - Unmute user
- `POST /api/admin/reset-password` - Reset user password
- `POST /api/admin/delete-user` - Delete user account
- `POST /api/admin/channel-lock` - Lock/unlock channel
- `POST /api/admin/slowmode` - Set slowmode
- `POST /api/admin/lockdown` - Lockdown server

## Building for Desktop & Mobile

### Windows (.exe) with Electron

1. Install Electron:
```bash
npm install electron --save-dev
```

2. Create `electron-main.js` in root:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadURL('http://localhost:5000');
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());
```

3. Build:
```bash
npx electron-builder --win
```

### Android (.apk) with Cordova

1. Install Cordova:
```bash
npm install -g cordova
```

2. Create project:
```bash
cordova create nebula-chat-mobile com.nebulachat NebulaChat
cd nebula-chat-mobile
cordova platform add android
```

3. Copy `public` folder files to `www`

4. Build:
```bash
cordova build android
```

### Web Deployment

For production deployment:

1. Build optimization:
```bash
NODE_ENV=production npm run dev
```

2. Use process manager (PM2):
```bash
npm install -g pm2
pm2 start server.js --name "nebula-chat"
```

3. Deploy to platforms like:
- Heroku
- AWS
- DigitalOcean
- Railway
- Render

## Features Implemented

✅ User Authentication & Authorization
✅ Real-time Messaging (Socket.IO)
✅ Direct Messages (DMs)
✅ Group Chats
✅ Public Chat Channel
✅ User Profiles with Bio
✅ Profile Picture Upload
✅ Status Management (Online/DND/Offline)
✅ @Mentions and Pings
✅ Message Replies
✅ Admin Panel
✅ Ban/Unban Users (Temp/Perm)
✅ Chat Mute/Unmute
✅ Message Deletion
✅ Admin Logs
✅ Password Reset
✅ Channel Controls (Lock/Unlock)
✅ Slowmode
✅ Server Lockdown
✅ Announcements Channel
✅ User Promotion to Admin

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network access for MongoDB Atlas

### Socket.IO Connection Issues
- Check CORS settings in `server.js`
- Verify `CLIENT_URL` in `.env`
- Check browser console for errors

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000   # Windows
```

## Support & Documentation

For more information, visit:
- [Express.js Docs](https://expressjs.com/)
- [Socket.IO Docs](https://socket.io/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)

## License

MIT License - Feel free to use this project for personal or commercial purposes.
