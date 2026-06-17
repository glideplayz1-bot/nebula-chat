@echo off
REM Nebula Chat - Automated Setup Script for Windows
REM This script will install all dependencies and start the application

CLS
echo ======================================
echo   NEBULA CHAT - Automated Setup
echo ======================================
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✓ Node.js found
    node --version
)

echo.
echo Checking for npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo npm is not installed!
    pause
    exit /b 1
) else (
    echo ✓ npm found
    npm --version
)

echo.
echo ======================================
echo   Installing Dependencies
echo ======================================
echo.

REM Install npm dependencies
echo Installing npm packages...
call npm install
if errorlevel 1 (
    echo Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ✓ Dependencies installed successfully!

echo.
echo ======================================
echo   Configuration
echo ======================================
echo.

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo ✓ .env file created
    echo.
    echo IMPORTANT: Edit .env file with your MongoDB URI and JWT secret!
) else (
    echo .env file already exists
)

echo.
echo ======================================
echo   Setup Complete!
echo ======================================
echo.
echo To start the server, run one of these commands:
echo.
echo   Production:  npm start
echo   Development: npm run dev
echo.
echo To build for Windows (.exe):
echo   npm run build-win
echo.
echo To build for Android (.apk):
echo   npm run build-android
echo.
echo Press any key to exit...
pause
exit /b 0
