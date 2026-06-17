@echo off
REM Gradle Installer Script for Nebula Chat Android Build
REM This script automatically downloads and installs Gradle if not present

CLS
echo ======================================
echo   GRADLE AUTO-INSTALLER
echo   For Nebula Chat Android Build
echo ======================================
echo.

setlocal enabledelayedexpansion

REM Set Gradle version
set GRADLE_VERSION=8.0
set GRADLE_HOME=%cd%\gradle
set GRADLE_URL=https://services.gradle.org/distributions/gradle-8.0-bin.zip

REM Check if Gradle is already installed
if exist "!GRADLE_HOME!\bin\gradle.bat" (
    echo.
    echo ✓ Gradle is already installed at: !GRADLE_HOME!
    echo.
    !GRADLE_HOME!\bin\gradle.bat --version
    echo.
    echo Starting Android build...
    echo.
    call !GRADLE_HOME!\bin\gradle.bat build
    goto :end
)

echo.
echo Gradle not found. Starting auto-installation...
echo.

REM Create gradle directory if it doesn't exist
if not exist "!GRADLE_HOME!" (
    mkdir "!GRADLE_HOME!"
)

echo Downloading Gradle !GRADLE_VERSION!...
echo This may take a few minutes depending on your connection speed.
echo.

REM Download Gradle using PowerShell
powershell -Command "& {
    $url = '!GRADLE_URL!'
    $output = '!GRADLE_HOME!\gradle.zip'
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($url, $output)
    Write-Host 'Download complete!'
}"

if errorlevel 1 (
    echo Failed to download Gradle!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo Extracting Gradle...

REM Extract Gradle using PowerShell
powershell -Command "& {
    $zip = '!GRADLE_HOME!\gradle.zip'
    $destination = '!GRADLE_HOME!'
    Expand-Archive -Path $zip -DestinationPath $destination
    Write-Host 'Extraction complete!'
}"

if errorlevel 1 (
    echo Failed to extract Gradle!
    pause
    exit /b 1
)

REM Move gradle folder to expected location
for /d %%D in ("!GRADLE_HOME!\gradle-*") do (
    for /d %%S in ("%%D\*") do (
        move "%%S" "!GRADLE_HOME!\temp_gradle" >nul 2>&1
    )
    rmdir /s /q "%%D"
)

if exist "!GRADLE_HOME!\temp_gradle" (
    move "!GRADLE_HOME!\temp_gradle" "!GRADLE_HOME!\current"
    for /d %%D in ("!GRADLE_HOME!\current\*") do (
        move "%%D\*" "!GRADLE_HOME!"
        rmdir /s /q "%%D"
    )
    rmdir /s /q "!GRADLE_HOME!\current"
)

REM Clean up zip file
del /q "!GRADLE_HOME!\gradle.zip"

echo.
echo ✓ Gradle installed successfully!
echo.
echo Verifying installation...
echo.

if exist "!GRADLE_HOME!\bin\gradle.bat" (
    !GRADLE_HOME!\bin\gradle.bat --version
    echo.
    echo Installation verified!
    echo.
    echo Starting Android build...
    echo.
    call !GRADLE_HOME!\bin\gradle.bat build
) else (
    echo Error: Gradle installation verification failed!
    echo Please try running this script again.
    pause
    exit /b 1
)

:end
echo.
echo ======================================
echo   Build Process Complete!
echo ======================================
echo.
echo Your APK file should be in:
echo   build\outputs\apk\release\app-release.apk
echo.
echo To build with Gradle directly, use:
echo   gradle build
echo.
pause
exit /b 0
