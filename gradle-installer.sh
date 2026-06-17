#!/bin/bash

# Gradle Installer Script for Nebula Chat Android Build
# This script automatically downloads and installs Gradle if not present

echo "======================================"
echo "   GRADLE AUTO-INSTALLER"
echo "   For Nebula Chat Android Build"
echo "======================================"
echo ""

GRADLE_VERSION="8.0"
GRADLE_HOME="$(pwd)/gradle"
GRADLE_URL="https://services.gradle.org/distributions/gradle-8.0-bin.zip"

# Check if Gradle is already installed
if [ -f "$GRADLE_HOME/bin/gradle" ]; then
    echo ""
    echo "✓ Gradle is already installed at: $GRADLE_HOME"
    echo ""
    $GRADLE_HOME/bin/gradle --version
    echo ""
    echo "Starting Android build..."
    echo ""
    $GRADLE_HOME/bin/gradle build
    exit 0
fi

echo ""
echo "Gradle not found. Starting auto-installation..."
echo ""

# Create gradle directory if it doesn't exist
mkdir -p "$GRADLE_HOME"

echo "Downloading Gradle $GRADLE_VERSION..."
echo "This may take a few minutes depending on your connection speed."
echo ""

# Download Gradle
if command -v curl &> /dev/null; then
    curl -L "$GRADLE_URL" -o "$GRADLE_HOME/gradle.zip"
elif command -v wget &> /dev/null; then
    wget "$GRADLE_URL" -O "$GRADLE_HOME/gradle.zip"
else
    echo "Error: Neither curl nor wget found!"
    echo "Please install curl or wget and try again."
    exit 1
fi

if [ $? -ne 0 ]; then
    echo "Failed to download Gradle!"
    echo "Please check your internet connection and try again."
    exit 1
fi

echo ""
echo "Extracting Gradle..."

# Extract Gradle
if command -v unzip &> /dev/null; then
    unzip -q "$GRADLE_HOME/gradle.zip" -d "$GRADLE_HOME"
else
    echo "Error: unzip not found!"
    echo "Please install unzip and try again."
    exit 1
fi

if [ $? -ne 0 ]; then
    echo "Failed to extract Gradle!"
    exit 1
fi

# Move gradle folder to expected location
for dir in "$GRADLE_HOME"/gradle-*; do
    if [ -d "$dir" ]; then
        mv "$dir"/* "$GRADLE_HOME/"
        rm -rf "$dir"
    fi
done

# Make gradle executable
chmod +x "$GRADLE_HOME/bin/gradle"

# Clean up zip file
rm -f "$GRADLE_HOME/gradle.zip"

echo ""
echo "✓ Gradle installed successfully!"
echo ""
echo "Verifying installation..."
echo ""

if [ -f "$GRADLE_HOME/bin/gradle" ]; then
    $GRADLE_HOME/bin/gradle --version
    echo ""
    echo "Installation verified!"
    echo ""
    echo "Starting Android build..."
    echo ""
    $GRADLE_HOME/bin/gradle build
else
    echo "Error: Gradle installation verification failed!"
    echo "Please try running this script again."
    exit 1
fi

echo ""
echo "======================================"
echo "   Build Process Complete!"
echo "======================================"
echo ""
echo "Your APK/JAR file should be in:"
echo "   build/outputs/"
echo ""
echo "To build with Gradle directly, use:"
echo "   gradle build"
echo ""
