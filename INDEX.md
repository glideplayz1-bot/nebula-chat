<!-- Project Summary Badge -->
[![Nebula Chat](https://img.shields.io/badge/Nebula%20Chat-Complete-success?style=flat-square&logo=github)](https://github.com/glideplayz1-bot/nebula-chat)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.18-black?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.5-black?style=flat-square&logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

# 🌟 Nebula Chat

> A full-stack, real-time chat application with admin controls, perfect for deployment across Web, Desktop (.exe), and Mobile (.apk)

## ⚡ Quick Start (30 seconds)

### Windows
```bash
setup.bat          # First time only
start-dev.bat      # Start server
# Open http://localhost:5000
```

### Linux/Mac
```bash
./setup.sh         # First time only
./start-dev.sh     # Start server
# Open http://localhost:5000
```

## 🎯 Features

✨ **Real-time Messaging**
- Direct messages
- Group chats
- Public chat channel
- Message replies & mentions

🔐 **Security & Auth**
- JWT authentication
- Password hashing
- Role-based access (User/Admin/Owner)
- Ban system with logs

👑 **Admin Panel** (Owner: RequiredTest)
- Ban/unban users
- Chat mute/unmute
- View private messages
- Delete messages
- Reset passwords
- Promote admins
- Server lockdown
- Complete audit logs

📱 **Multi-Platform**
- 💻 Web (Current)
- 🪟 Windows .exe (Electron)
- 📱 Android .apk (Cordova)

## 🚀 Build Options

```bash
# Web (Default)
npm run dev

# Windows .exe
build-all.bat        # Choose Windows

# Android .apk (Auto-installs Gradle!)
gradle-installer.bat

# All platforms
build-all.bat        # Choose "Both"
```

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[SETUP.md](SETUP.md)** - Detailed installation
- **[API_DOCS.md](API_DOCS.md)** - Complete API reference
- **[BUILD_GUIDE.md](BUILD_GUIDE.md)** - Build instructions
- **[FEATURES.md](FEATURES.md)** - Feature list

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Real-time** | Socket.IO |
| **Auth** | JWT + bcryptjs |
| **Desktop** | Electron |
| **Mobile** | Cordova |

## 📁 Project Structure

```
nebula-chat/
├── server.js              # Main server
├── setup.bat/sh           # Auto-setup script
├── start-dev.bat/sh       # Dev server
├── build-all.bat/sh       # Build menu
├── gradle-installer.bat/sh # Auto-gradle setup ⭐
├── config/                # Database config
├── models/                # Database schemas
├── routes/                # API endpoints
├── public/                # Frontend files
└── docs/                  # Documentation
```

## 🔑 Owner Account

Sign up with username: **RequiredTest**

Gain access to:
- Admin panel
- User management
- Chat controls
- System logs
- Server controls

## 🌐 Deployment

### Quick Deploy to Heroku
```bash
heroku create your-app
git push heroku main
heroku config:set MONGODB_URI=your_uri
heroku open
```

### Deploy to Railway
1. Connect GitHub repo
2. Add environment variables
3. Deploy! 🚀

## ⚙️ Gradle Auto-Installer

No need to install Gradle manually!

```bash
# Windows
gradle-installer.bat

# Linux/Mac
bash gradle-installer.sh
```

- Automatically downloads Gradle 8.0
- Extracts and configures
- Runs build automatically
- Creates APK/JAR files

## 🐛 Troubleshooting

### MongoDB not running
```bash
mongod              # Start in one terminal
npm run dev         # Start server in another
```

### Port 5000 in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Dependencies issue
```bash
rm -rf node_modules
npm install
```

## 📊 Project Stats

- **40+** API Endpoints
- **6** Database Models
- **3** Build Targets (Web, Windows, Android)
- **100%** Documented
- **Ready to Deploy**

## 📝 License

MIT License - Free to use and modify

## 🎉 Ready to Start?

1. Run setup script (Windows: `setup.bat`, Linux/Mac: `./setup.sh`)
2. Start dev server (Windows: `start-dev.bat`, Linux/Mac: `./start-dev.sh`)
3. Open http://localhost:5000
4. Sign up with username "RequiredTest"
5. Explore and enjoy! 🚀

---

**Made with ❤️ - Start building your chat app today!**
