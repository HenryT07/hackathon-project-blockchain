@echo off
echo ========================================
echo   Starting Local Web Server
echo ========================================
echo.
echo Server will start on: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

cd /d "%~dp0"
python -m http.server 8000

if errorlevel 1 (
    echo.
    echo ERROR: Python not found!
    echo.
    echo Please install Python from: https://www.python.org/
    echo Or try: python3 -m http.server 8000
    echo.
    pause
)

