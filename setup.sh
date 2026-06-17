#!/bin/bash

# Nebula Chat - Automated Setup Script for Linux/Mac
# This script will install all dependencies and start the application

echo "======================================"
echo "  NEBULA CHAT - Automated Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
echo "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    exit 1
else
    echo "✓ Node.js found"
    node --version
fi

echo ""
echo "Checking for npm..."
if ! command -v npm &> /dev/null; then
    echo "npm is not installed!"
    exit 1
else
    echo "✓ npm found"
    npm --version
fi

echo ""
echo "======================================"
echo "  Installing Dependencies"
echo "======================================"
echo ""

# Install npm dependencies
echo "Installing npm packages..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies!"
    exit 1
fi

echo ""
echo "✓ Dependencies installed successfully!"

echo ""
echo "======================================"
echo "  Configuration"
echo "======================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "IMPORTANT: Edit .env file with your MongoDB URI and JWT secret!"
else
    echo ".env file already exists"
fi

echo ""
echo "======================================"
echo "  Setup Complete!"
echo "======================================"
echo ""
echo "To start the server, run one of these commands:"
echo ""
echo "  Production:  npm start"
echo "  Development: npm run dev"
echo ""
echo "To build for Linux/Mac:"
echo "  npm run build-unix"
echo ""
echo "To build for Android (.apk):"
echo "  npm run build-android"
echo ""
echo "Press Ctrl+C to exit or Enter to continue..."
read
