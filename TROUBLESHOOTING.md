# Server Troubleshooting Guide

## Common Errors and Solutions

### Error: "Cannot find module 'express'"

**Problem:** Dependencies are not installed.

**Solution:**
```bash
npm install
```

This will install `express` and `cors` packages.

---

### Error: "Port 3000 is already in use"

**Problem:** Another application is using port 3000.

**Solutions:**

**Option 1: Use a different port**
1. Edit `server.js`
2. Change `const PORT = 3000;` to `const PORT = 3001;` (or any available port)
3. Update `classroom.js` to use the new port

**Option 2: Find and stop the process using port 3000**

**Windows:**
```bash
netstat -ano | findstr :3000
# Note the PID (last number)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
# Note the PID
kill -9 <PID>
```

---

### Error: "EADDRINUSE: address already in use"

Same as port conflict above. Use solutions from "Port 3000 is already in use".

---

### Error: "SyntaxError" or "Unexpected token"

**Problem:** Node.js version might be too old, or syntax error in code.

**Solutions:**
1. Check Node.js version: `node --version` (should be 14+)
2. Update Node.js from https://nodejs.org/
3. Check for syntax errors in `server.js`

---

### Error: "MODULE_NOT_FOUND"

**Problem:** Missing dependencies or wrong directory.

**Solutions:**
1. Make sure you're in the project directory
2. Run: `npm install`
3. Verify `node_modules` folder exists

---

### Error: "CORS policy" in browser

**Problem:** CORS is blocking requests (though we have CORS enabled).

**Solution:** Make sure `cors` package is installed:
```bash
npm install cors
```

---

### Server starts but shows "undefined" for IP address

**Problem:** Network interface detection issue.

**Solution:** 
- This is okay, server still works on localhost
- Manually find your IP:
  - Windows: `ipconfig` → look for IPv4 Address
  - Mac/Linux: `ifconfig` or `ip addr show`
- Use that IP in the Server URL field

---

### "ECONNREFUSED" when trying to connect

**Problem:** Server is not running or wrong URL.

**Solutions:**
1. Make sure server is running: `npm start`
2. Check the server URL in the game matches the server
3. Verify firewall isn't blocking port 3000

---

## Step-by-Step Server Setup

### 1. Install Dependencies
```bash
npm install
```

Expected output:
```
added 50 packages in 5s
```

### 2. Start Server
```bash
npm start
```

Expected output:
```
🚀 Classroom server running!
📚 Local: http://localhost:3000
🌐 Network: http://192.168.1.100:3000
```

### 3. If You See Errors

**"npm is not recognized"**
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

**"Cannot find module"**
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` fresh

**"Permission denied"**
- Windows: Run terminal as Administrator
- Mac/Linux: May need `sudo` (not recommended, fix permissions instead)

---

## Quick Fixes

### Reinstall Everything
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules & del package-lock.json  # Windows

# Reinstall
npm install

# Try starting again
npm start
```

### Check Node.js Installation
```bash
node --version
npm --version
```

Both should show version numbers. If not, reinstall Node.js.

### Verify Files Exist
Make sure these files are in your project:
- `server.js`
- `package.json`
- `node_modules/` folder (after npm install)

---

## Still Having Issues?

1. **Check the exact error message** - Copy the full error
2. **Check Node.js version** - Should be 14 or higher
3. **Check if port is available** - Try a different port
4. **Check firewall** - Allow Node.js through firewall
5. **Try running directly:** `node server.js` (instead of `npm start`)

---

## Getting Help

When asking for help, provide:
1. The exact error message
2. Node.js version: `node --version`
3. Operating system (Windows/Mac/Linux)
4. What command you ran
5. Full error output from terminal

