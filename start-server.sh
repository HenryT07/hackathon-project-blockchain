#!/bin/bash

echo "========================================"
echo "  Starting Local Web Server"
echo "========================================"
echo ""
echo "Server will start on: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "========================================"
echo ""

cd "$(dirname "$0")"

# Try python3 first, then python
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
else
    echo "ERROR: Python not found!"
    echo ""
    echo "Please install Python from: https://www.python.org/"
    exit 1
fi

