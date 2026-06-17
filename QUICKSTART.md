# Quick Start Guide

## One-Click Setup

### Windows
1. Double-click `setup.bat`
2. Wait for installation to complete
3. Run `start-dev.bat` to start the server
4. Open http://localhost:5000 in your browser

### Linux/Mac
1. Run `chmod +x setup.sh start-dev.sh gradle-installer.sh`
2. Run `./setup.sh`
3. Run `./start-dev.sh` to start the server
4. Open http://localhost:5000 in your browser

## Building Applications

### Windows Executable (.exe)
```bash
gradle-installer.bat
# or
npm run build-win
```

### Android APK
```bash
gradle-installer.bat
# or
npm run build-android
```

### Complete Build Suite
```bash
build-all.bat          # Windows
./build-all.sh         # Linux/Mac
```

## Owner Account Setup

Sign up with username: **RequiredTest** to get owner panel access

## Environment Configuration

Edit `.env` file:
```
PORT=5000
NODEDEV=development
MONGODB_URI=mongodb://localhost:27017/nebula-chat
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5000
```

## Features Available

✅ Real-time messaging with Socket.IO
✅ Direct messages & group chats
✅ User profiles with bio & avatar
✅ Status management (Online/DND/Offline)
✅ @Mentions and pings
✅ Message replies
✅ Admin panel with user management
✅ Ban/unban users
✅ Chat mute/unmute
✅ Slowmode & channel controls
✅ Complete admin logs
✅ Auto-deploy ready

## Build Scripts Explained

### gradle-installer.bat / gradle-installer.sh
- Automatically downloads Gradle 8.0
- Sets up Android build environment
- Runs build automatically
- No manual installation needed!

### setup.bat / setup.sh
- Checks Node.js and npm
- Installs all dependencies
- Creates .env configuration
- Gets you ready to run

### start-dev.bat / start-dev.sh
- Checks MongoDB is ready
- Starts development server
- Opens on localhost:5000

### build-all.bat / build-all.sh
- Interactive build menu
- Build for Windows (.exe)
- Build for Android (.apk)
- Build for Web
- Or build everything at once!

## Troubleshooting

### MongoDB not running
```bash
mongod
# In another terminal
npm run dev
```

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Node modules issue
```bash
rm -rf node_modules
npm install
```

## More Information

- See `SETUP.md` for detailed setup instructions
- See `API_DOCS.md` for API documentation
- See `BUILD_GUIDE.md` for build configuration
- See `FEATURES.md` for feature list

## Support

For issues, check the documentation or create an issue on GitHub.
