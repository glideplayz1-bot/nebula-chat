#!/bin/bash

# Nebula Chat - Quick Start Script
# Run this to start the development server

echo "======================================"
echo "   NEBULA CHAT - Development Server"
echo "======================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies first..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Failed to install dependencies!"
        exit 1
    fi
fi

echo ""
echo "Checking for MongoDB..."
echo "If MongoDB is not running, start it separately:"
echo "   mongod"
echo ""
echo "Starting Nebula Chat server on http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""

# Start the development server
npm run dev

if [ $? -ne 0 ]; then
    echo ""
    echo "Server failed to start. Check the errors above."
    exit 1
fi
