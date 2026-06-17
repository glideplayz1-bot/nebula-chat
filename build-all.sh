#!/bin/bash

# Nebula Chat - Complete Build Script
# Builds for Linux/Mac, Android, and creates HTML package

echo "======================================"
echo "   NEBULA CHAT - Complete Build Suite"
echo "======================================"
echo ""
echo "Select what you want to build:"
echo ""
echo "1. Linux/Mac - Executable app"
echo "2. Android (.apk) - Mobile app"
echo "3. Both (Linux/Mac + Android)"
echo "4. Web files only (HTML/CSS/JS)"
echo "5. Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1) build_unix ;;
    2) build_android ;;
    3) build_both ;;
    4) build_web ;;
    5) exit 0 ;;
    *) echo "Invalid choice!"; exit 1 ;;
esac

build_unix() {
    echo ""
    echo "======================================"
    echo "   Building for Linux/Mac"
    echo "======================================"
    echo ""
    echo "Installing Electron dependencies..."
    npm install electron electron-builder --save-dev
    echo ""
    echo "Building executable..."
    echo "This may take several minutes."
    echo ""
    npm run build-unix
    if [ $? -ne 0 ]; then
        echo "Build failed!"
        exit 1
    fi
    echo ""
    echo "✓ Unix build complete!"
    echo "Look for executable in the \"dist\" folder"
    echo ""
}

build_android() {
    echo ""
    echo "======================================"
    echo "   Building for Android (.apk)"
    echo "======================================"
    echo ""
    echo "Installing Cordova dependencies..."
    sudo npm install -g cordova
    echo ""
    echo "Running Gradle installer..."
    bash gradle-installer.sh
    if [ $? -ne 0 ]; then
        echo "Build failed!"
        exit 1
    fi
    echo ""
    echo "✓ Android build complete!"
    echo "Look for .apk in the build outputs folder"
    echo ""
}

build_both() {
    echo ""
    echo "Building for both platforms..."
    echo ""
    echo "Starting Unix build..."
    echo ""
    build_unix
    echo ""
    echo "Starting Android build..."
    echo ""
    build_android
    echo ""
    echo "✓ All builds complete!"
    echo ""
}

build_web() {
    echo ""
    echo "Web files are located in the \"public\" folder"
    echo ""
    echo "To deploy web version:"
    echo "  1. Copy all files from \"public\" folder"
    echo "  2. Upload to your web server"
    echo "  3. Run \"npm start\" to start the backend server"
    echo ""
    echo "For static hosting (Netlify, Vercel, etc.):"
    echo "  - Backend must run separately on a server"
    echo "  - Update API_URL in public/js/auth.js"
    echo ""
}
