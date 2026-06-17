# Nebula Chat - Windows Build Configuration for Electron

## Building Windows Executable (.exe)

### Prerequisites
- Node.js and npm
- Electron
- Electron-builder

### Step 1: Install Dependencies

```bash
npm install electron electron-builder electron-is-dev --save-dev
```

### Step 2: Add Build Scripts to package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "electron-dev": "electron .",
    "electron-build": "electron-builder",
    "build-win": "npm run build && electron-builder --win",
    "build-mac": "npm run build && electron-builder --mac",
    "build-linux": "npm run build && electron-builder --linux"
  }
}
```

### Step 3: Create electron-builder Configuration

Add to `package.json`:

```json
{
  "build": {
    "appId": "com.nebulaChat",
    "productName": "Nebula Chat",
    "files": [
      "server.js",
      "config/**/*",
      "models/**/*",
      "middleware/**/*",
      "routes/**/*",
      "public/**/*",
      "uploads/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "directories": {
      "buildResources": "public"
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        },
        {
          "target": "portable",
          "arch": ["x64"]
        }
      ],
      "certificateFile": null,
      "certificatePassword": null
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Nebula Chat"
    }
  }
}
```

### Step 4: Build for Windows

```bash
npm run build-win
```

The .exe file will be created in the `dist` folder.

## Building Android APK

### Prerequisites
- Cordova CLI: `npm install -g cordova`
- Android SDK
- Java Development Kit (JDK)

### Step 1: Create Cordova Project

```bash
cordova create nebula-chat-mobile com.nebulaChat NebulaChat
cd nebula-chat-mobile
cordova platform add android
```

### Step 2: Copy Web Files

Copy the contents of `public` folder to `www` folder in Cordova project.

### Step 3: Build APK

```bash
cordova build android --release
```

The APK will be in `platforms/android/build/outputs/apk/`

## Building HTML Single Page

The application is already a single HTML file experience. You can:

1. Package as-is for web deployment
2. Use a static hosting service (Netlify, Vercel, GitHub Pages)
3. Bundle with your Node.js server

### For Static Hosting:

```bash
# Build
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=public
```

## Distribution

### Windows
- Installer (.exe setup file)
- Portable (.exe single file)

### Android
- APK file (install on devices/emulators)
- Google Play Store submission

### Web
- Hosted on any web server
- Serverless deployment (AWS Lambda, Vercel)
- Traditional hosting (Heroku, DigitalOcean)

## File Sizes (Approximate)

- HTML/CSS/JS: ~500 KB
- Electron build: ~150 MB (includes Chromium)
- APK: ~80 MB
- Compressed (.zip): ~30-50 MB

## Code Signing

For production releases:

### Windows
- Obtain code signing certificate
- Configure in electron-builder

### Android
- Generate keystore: `keytool -genkey -v -keystore nebula-chat.keystore -keyalg RSA -keysize 2048 -validity 10000`
- Sign APK in Cordova config

## Security Considerations

1. Use HTTPS in production
2. Implement rate limiting
3. Validate all user input
4. Use environment variables for secrets
5. Keep dependencies updated
6. Implement CSRF protection
7. Use secure session management
