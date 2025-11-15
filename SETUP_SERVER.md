# How to Set Up Local Server - Step-by-Step Guide

## Why Use a Local Server?

Browsers block browser extensions (like Phantom) from injecting when you open HTML files directly (`file://` protocol). Running via a local server (`http://localhost`) allows extensions to work properly.

---

## Method 1: Python HTTP Server (Easiest - No Installation Needed)

### Step 1: Check if Python is Installed

**Windows:**
1. Press `Win + R` to open Run dialog
2. Type `cmd` and press Enter
3. In Command Prompt, type:
   ```bash
   python --version
   ```
   or
   ```bash
   python3 --version
   ```

**Mac/Linux:**
1. Open Terminal (Applications > Utilities > Terminal on Mac)
2. Type:
   ```bash
   python3 --version
   ```

**If Python is NOT installed:**
- Download from: https://www.python.org/downloads/
- During installation, check "Add Python to PATH" (Windows)
- Restart your computer after installation

### Step 2: Navigate to Project Folder

**Windows:**
1. Open Command Prompt
2. Type (replace with your actual path):
   ```bash
   cd D:\Git\hackathon-project-blockchain
   ```
3. Press Enter

**Mac/Linux:**
1. Open Terminal
2. Type (replace with your actual path):
   ```bash
   cd /path/to/hackathon-project-blockchain
   ```
3. Press Enter

**Tip:** You can also:
- Navigate to the folder in File Explorer/Finder
- Right-click in the folder
- Select "Open in Terminal" or "Open PowerShell here"

### Step 3: Start the Server

**Windows:**
```bash
python -m http.server 8000
```

**Mac/Linux:**
```bash
python3 -m http.server 8000
```

You should see output like:
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

### Step 4: Open the Game in Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: `http://localhost:8000`
3. The game should load!

### Step 5: Stop the Server

- Press `Ctrl + C` in the terminal/command prompt
- The server will stop

---

## Method 2: Using the Batch File (Windows Only)

### Step 1: Locate the File
Find `start-server.bat` in your project folder

### Step 2: Run the File
Double-click `start-server.bat`

### Step 3: Server Starts
- A window will open showing the server is running
- You'll see: "Serving HTTP on :: port 8000"

### Step 4: Open Browser
- Go to: `http://localhost:8000`

### Step 5: Stop Server
- Press `Ctrl + C` in the window
- Or close the window

---

## Method 3: Node.js HTTP Server

### Step 1: Install Node.js

1. Go to: https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Follow the installation wizard
5. Restart your computer

### Step 2: Verify Installation

Open Command Prompt (Windows) or Terminal (Mac/Linux) and type:
```bash
node --version
npm --version
```

Both should show version numbers.

### Step 3: Install http-server (One Time Only)

```bash
npm install -g http-server
```

This installs a global package that you can use from anywhere.

### Step 4: Navigate to Project Folder

```bash
cd D:\Git\hackathon-project-blockchain
```
(Replace with your actual path)

### Step 5: Start the Server

```bash
http-server -p 8000
```

### Step 6: Open Browser

Go to: `http://localhost:8000`

### Step 7: Stop Server

Press `Ctrl + C`

---

## Method 4: VS Code Live Server Extension

### Step 1: Install VS Code

1. Download from: https://code.visualstudio.com/
2. Install VS Code
3. Open VS Code

### Step 2: Install Live Server Extension

1. Click the Extensions icon in the left sidebar (or press `Ctrl+Shift+X`)
2. Search for "Live Server"
3. Click "Install" on the "Live Server" extension by Ritwick Dey
4. Wait for installation to complete

### Step 3: Open Project in VS Code

1. File > Open Folder
2. Select your project folder: `hackathon-project-blockchain`
3. Click "Select Folder"

### Step 4: Start Live Server

1. Right-click on `index.html` in the file explorer
2. Select "Open with Live Server"
3. Browser will open automatically to the game!

### Step 5: Stop Live Server

- Click the "Go Live" button in the bottom-right of VS Code
- Or right-click `index.html` and select "Stop Live Server"

---

## Method 5: PHP Server (If PHP is Installed)

### Step 1: Check if PHP is Installed

Open terminal and type:
```bash
php --version
```

If not installed:
- **Windows:** Download from https://windows.php.net/download/
- **Mac:** Usually pre-installed, or use Homebrew: `brew install php`
- **Linux:** `sudo apt-get install php` (Ubuntu/Debian)

### Step 2: Navigate to Project Folder

```bash
cd D:\Git\hackathon-project-blockchain
```

### Step 3: Start Server

```bash
php -S localhost:8000
```

### Step 4: Open Browser

Go to: `http://localhost:8000`

### Step 5: Stop Server

Press `Ctrl + C`

---

## Complete Setup for Multiplayer (Classroom Feature)

### New Features: Connection Testing & Server URL Configuration

The game now includes:
- **Connection Test Button:** Test server connectivity before joining
- **Server URL Input:** Configure server URL at the top of the classroom screen
- **Better Error Messages:** Detailed error messages explain connection issues
- **Network Access:** Server automatically detects and displays network IP

### Step 1: Install Node.js
Follow Method 3, Step 1 above

### Step 2: Install Dependencies

1. Open terminal in project folder
2. Run:
   ```bash
   npm install
   ```
3. Wait for installation to complete

### Step 3: Start Backend Server (Terminal 1)

```bash
npm start
```

You should see:
```
🚀 Classroom server running!
📚 Local: http://localhost:3000
🌐 Network: http://192.168.1.100:3000

💡 Share the network URL with others to join your classroom!
   Make sure they use: http://192.168.1.100:3000 as the server URL
```

**Important:** Note the **Network** URL - this is what others need to use to join your classroom!

**Keep this terminal open!**

### Step 4: Start Game Server (Terminal 2)

Open a **new** terminal window and run:

**Windows:**
```bash
python -m http.server 8000
```

**Mac/Linux:**
```bash
python3 -m http.server 8000
```

### Step 5: Open Game

Go to: `http://localhost:8000`

### Step 6: Test Multiplayer

1. Open the game in two different browser tabs/windows
2. Click "Join/Create Classroom" in both
3. **Set Server URL** (at the top of the classroom screen):
   - For same computer: Use `http://localhost:3000`
   - For network access: Use the Network URL shown when starting server (e.g., `http://192.168.1.100:3000`)
   - Click "Test" button to verify connection (should show ✅ Connection successful!)
4. Create a classroom in one tab
5. Join with the code in the other tab
6. Both should see each other in the "Active Players" list!

---

## Troubleshooting

### "python is not recognized" (Windows)

**Solution 1:** Try `python3` instead:
```bash
python3 -m http.server 8000
```

**Solution 2:** Install Python:
1. Go to https://www.python.org/downloads/
2. Download Python 3.x
3. **IMPORTANT:** Check "Add Python to PATH" during installation
4. Restart Command Prompt
5. Try again

### "Port 8000 is already in use"

**Solution:** Use a different port:
```bash
python -m http.server 8080
```
Then open: `http://localhost:8080`

**Or find what's using port 8000:**
- **Windows:** `netstat -ano | findstr :8000`
- **Mac/Linux:** `lsof -i :8000`

### "npm is not recognized"

**Solution:** Node.js is not installed or not in PATH
1. Install Node.js from https://nodejs.org/
2. Restart terminal
3. Verify: `node --version`

### "Cannot connect to server"

**Check:**
1. Is the server actually running? (Check terminal for output)
2. Are you using `http://localhost:8000` (not `file://`)
3. Check browser console (F12) for errors
4. Try a different browser
5. **For classroom server:** Use the "Test Connection" button in the classroom screen to verify server is reachable
6. **For network access:** Make sure you're using the Network IP (not localhost) when joining from another device

### Server starts but page doesn't load

**Check:**
1. Make sure you're in the correct folder (should contain `index.html`)
2. Check terminal for error messages
3. Try `http://127.0.0.1:8000` instead of `localhost:8000`

### Phantom still not connecting

**Even with local server:**
1. Make sure you're using `http://localhost:8000` (check address bar)
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check browser console (F12) for errors
4. Click the "Test" button in the game to see diagnostics

### "Cannot connect to server" when joining classroom

**Solutions:**
1. **Test the connection first:** Use the "Test Connection" button at the top of the classroom screen
2. **Check server URL:**
   - Same computer: Use `http://localhost:3000`
   - Network access: Use the Network IP shown when starting server (e.g., `http://192.168.1.100:3000`)
3. **Verify server is running:** Check the terminal where you ran `npm start`
4. **Check firewall:** Windows Firewall may be blocking port 3000
5. **Check error message:** The game now shows detailed error messages explaining what went wrong

### "Classroom not found" error

**Solutions:**
1. Verify the classroom code is correct (6 digits)
2. Make sure you're using the **same server URL** as the classroom creator
3. Check that the creator's server is still running
4. If joining from another device, use the creator's Network IP (not localhost)

---

## Quick Reference

### Start Game Server (Python)
```bash
python -m http.server 8000
```
Then open: `http://localhost:8000`

### Start Backend Server (Node.js)
```bash
npm start
```
Runs on: `http://localhost:3000`

### Stop Any Server
Press `Ctrl + C` in the terminal

### Verify It's Working
1. Server shows output in terminal
2. Browser address bar shows `http://localhost:8000`
3. Open console (F12) and type: `window.solana`
4. Should show an object (not `undefined`)

---

## Recommended Setup for Development

1. **Terminal 1:** Backend server (`npm start`)
   - Note the Network URL shown (e.g., `http://192.168.1.100:3000`)
2. **Terminal 2:** Game server (`python -m http.server 8000`)
3. **Browser:** `http://localhost:8000`

This gives you:
- ✅ Phantom wallet connection
- ✅ Multiplayer classrooms
- ✅ Real-time leaderboard sync
- ✅ Connection testing before joining
- ✅ Network access for other devices

### Using the Connection Test Feature

1. **Before joining a classroom:**
   - Enter the server URL in the "Server URL" field at the top
   - Click "Test" button
   - Wait for connection status (✅ success or ❌ error)
   - If successful, proceed to join/create classroom

2. **For network access:**
   - Use the Network IP shown when starting the backend server
   - Example: If server shows `http://192.168.1.100:3000`, use that in the Server URL field
   - Test the connection first to verify it works

---

## Production Deployment

For making the game available online:

1. **Deploy Backend:**
   - Heroku, Railway, Render, or similar
   - Update `serverUrl` in `classroom.js` to your deployed URL

2. **Deploy Frontend:**
   - GitHub Pages, Netlify, Vercel, or similar
   - Upload all HTML/CSS/JS files

3. **Update Configuration:**
   - Change `serverUrl` in `classroom.js` to production URL
   - Update any hardcoded localhost URLs

---

## Network Access for Multiplayer

### Allowing Others to Join Your Classroom

1. **Start the backend server:**
   ```bash
   npm start
   ```
   Note the **Network** URL (e.g., `http://192.168.1.100:3000`)

2. **In the game:**
   - Go to Classroom screen
   - Enter the Network URL in the "Server URL" field at the top
   - Click "Test" to verify connection
   - Create or join a classroom

3. **Share with others:**
   - Share the **Network URL** (not localhost!)
   - Share the **classroom code**
   - Others must use the same Network URL to join

4. **For others joining:**
   - Enter the Network URL in the Server URL field
   - Click "Test" to verify connection
   - Enter the classroom code
   - Click "Join"

**Important:** All players must be on the same network (same Wi-Fi) for this to work!

For more details, see `NETWORK_SETUP.md`

---

## Need Help?

- **Connection issues:** Use the "Test Connection" button in the classroom screen
- Check browser console (F12) for errors
- Check terminal for server errors
- Verify all files are in the correct location
- Make sure ports 8000 and 3000 are not blocked by firewall
- **For network access:** Use the Network IP shown when starting server (not localhost)
