@echo off
REM Nebula Chat - Quick Start Script
REM Run this to start the development server

CLS
echo ======================================
echo   NEBULA CHAT - Development Server
echo ======================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies first...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Checking for MongoDB...
echo If MongoDB is not running, start it separately:
echo   mongod
echo.
echo Starting Nebula Chat server on http://localhost:5000
echo Press Ctrl+C to stop
echo.

REM Start the development server
npm run dev

if errorlevel 1 (
    echo.
    echo Server failed to start. Check the errors above.
    pause
    exit /b 1
)

pause
exit /b 0
