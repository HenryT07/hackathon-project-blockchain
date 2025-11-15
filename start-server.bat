@echo off
echo ========================================
echo   Starting Classroom Server
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed or not in PATH!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Checking dependencies...
if not exist "node_modules" (
    echo Dependencies not found. Installing...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
    echo Dependencies installed!
    echo.
)

echo Starting server...
echo.
echo Server will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

node server.js

if errorlevel 1 (
    echo.
    echo ERROR: Server failed to start!
    echo Check the error message above.
    echo.
    pause
)
