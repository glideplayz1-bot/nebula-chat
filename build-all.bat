@echo off
REM Nebula Chat - Complete Build Script
REM Builds for Windows (.exe), Android (.apk), and creates HTML package

CLS
echo ======================================
echo   NEBULA CHAT - Complete Build Suite
echo ======================================
echo.
echo Select what you want to build:
echo.
echo 1. Windows (.exe) - Electron app
echo 2. Android (.apk) - Mobile app
echo 3. Both (Windows + Android)
echo 4. Web files only (HTML/CSS/JS)
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto build_windows
if "%choice%"=="2" goto build_android
if "%choice%"=="3" goto build_both
if "%choice%"=="4" goto build_web
if "%choice%"=="5" goto end

echo Invalid choice!
goto end

:build_windows
echo.
echo ======================================
echo   Building for Windows (.exe)
echo ======================================
echo.
echo Installing Electron dependencies...
call npm install electron electron-builder --save-dev
echo.
echo Building Windows executable...
echo This may take several minutes.
echo.
call npm run build-win
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)
echo.
echo ✓ Windows build complete!
echo Look for .exe in the "dist" folder
echo.
goto end

:build_android
echo.
echo ======================================
echo   Building for Android (.apk)
echo ======================================
echo.
echo Installing Cordova dependencies...
call npm install -g cordova
echo.
echo Running Gradle installer...
call gradle-installer.bat
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)
echo.
echo ✓ Android build complete!
echo Look for .apk in the build outputs folder
echo.
goto end

:build_both
echo.
echo Building for both platforms...
echo.
echo Starting Windows build...
echo.
call :build_windows
echo.
echo Starting Android build...
echo.
call :build_android
echo.
echo ✓ All builds complete!
echo.
goto end

:build_web
echo.
echo Web files are located in the "public" folder
echo.
echo To deploy web version:
echo   1. Copy all files from "public" folder
echo   2. Upload to your web server
echo   3. Run "npm start" to start the backend server
echo.
echo For static hosting (Netlify, Vercel, etc.):
echo   - Backend must run separately on a server
echo   - Update API_URL in public/js/auth.js
echo.
goto end

:end
echo.
echo ======================================
echo   Done!
echo ======================================
echo.
pause
exit /b 0
