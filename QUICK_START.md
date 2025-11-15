# Quick Start Guide - Fix Server Errors

## Most Common Issue: Missing Dependencies

If you see errors like "Cannot find module 'express'", run:

```bash
npm install
```

Wait for it to finish, then try again:
```bash
npm start
```

---

## Step-by-Step Fix

### Step 1: Check Node.js is Installed
```bash
node --version
```

If you see a version number (like `v18.0.0`), you're good!
If you see an error, install Node.js from https://nodejs.org/

### Step 2: Install Dependencies
```bash
npm install
```

You should see:
```
added 50 packages in 5s
```

### Step 3: Start Server
```bash
npm start
```

You should see:
```
🚀 Classroom server running!
📚 Local: http://localhost:3000
🌐 Network: http://192.168.1.100:3000
```

---

## Common Errors

### "Port 3000 is already in use"

**Quick Fix:** Use a different port
1. Edit `server.js`
2. Change line 7: `const PORT = 3001;` (or any number)
3. Update game's server URL to match

### "Cannot find module"

**Quick Fix:**
```bash
npm install express cors
```

### "npm is not recognized"

**Quick Fix:** Install Node.js from https://nodejs.org/
- Make sure to check "Add to PATH" during installation
- Restart terminal after installing

---

## Windows Users: Use the Batch File

Double-click `start-server.bat` - it will:
- ✅ Check if Node.js is installed
- ✅ Install dependencies if needed
- ✅ Start the server
- ✅ Show helpful error messages

---

## Still Not Working?

1. **Copy the exact error message** you're seeing
2. **Check TROUBLESHOOTING.md** for detailed solutions
3. **Try:** `node server.js` directly (instead of `npm start`)

The error message will tell us exactly what's wrong!

