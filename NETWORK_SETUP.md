# Network Setup for Multiplayer Classrooms

## Problem: Others Can't Join Your Classroom

If other people can't join your classroom, it's because the server is only accessible on `localhost` (your computer only). To allow others to join, you need to make the server accessible on your network.

## Solution: Use Your Computer's IP Address

### Step 1: Find Your Computer's IP Address

**Windows:**
1. Open Command Prompt
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter
4. It will look like: `192.168.1.100` or `10.0.0.5`

**Mac:**
1. Open System Settings
2. Go to Network
3. Select your active connection (Wi-Fi or Ethernet)
4. Your IP address is shown there
5. Or in Terminal: `ifconfig | grep "inet "`

**Linux:**
```bash
ip addr show
# or
ifconfig
```

### Step 2: Update Server to Listen on Network

The server is already configured to listen on all network interfaces. Just make sure it's running:

```bash
npm start
```

You should see:
```
🚀 Classroom server running!
📚 Local: http://localhost:3000
🌐 Network: http://192.168.1.100:3000
```

### Step 3: Configure Server URL in Game

**For the Classroom Creator:**
1. Create a classroom
2. In the "Server URL" field, enter: `http://YOUR_IP:3000`
   - Replace `YOUR_IP` with your actual IP (e.g., `http://192.168.1.100:3000`)
3. Click "Update"
4. Share BOTH the classroom code AND the server URL with others

**For People Joining:**
1. Enter the classroom code
2. In the "Server URL" field, enter the server URL provided by the creator
   - Should be: `http://CREATOR_IP:3000`
3. Click "Update" (if needed)
4. Click "Join"

## Example Setup

### Classroom Creator's Computer:
- IP Address: `192.168.1.100`
- Server URL: `http://192.168.1.100:3000`
- Shares: Code `123456` + URL `http://192.168.1.100:3000`

### Other Players:
- Enter code: `123456`
- Enter server URL: `http://192.168.1.100:3000`
- Click Join

## Important Notes

### Same Network Required
- All players must be on the **same Wi-Fi/network**
- Can't connect from different networks (unless you set up port forwarding)

### Firewall
- Windows Firewall may block the connection
- Allow Node.js through firewall when prompted
- Or manually allow port 3000 in Windows Firewall settings

### Testing
1. Creator: Create classroom with network IP
2. Creator: Share code + server URL
3. Others: Use the shared server URL (not localhost!)
4. Others: Enter the code and join

## Troubleshooting

### "Cannot connect to server"
- Make sure creator's server is running
- Verify the IP address is correct
- Check firewall settings
- Ensure all devices are on same network

### "Classroom not found"
- Double-check the server URL matches creator's IP
- Make sure creator's server is still running
- Verify the classroom code is correct

### Finding IP Address Issues
- If IP starts with `127.0.0.1` or `localhost`, that's wrong
- Need an IP like `192.168.x.x` or `10.0.x.x`
- Make sure you're connected to Wi-Fi/network

## Alternative: Deploy Online

For players on different networks, deploy the server online:

1. **Deploy Backend Server:**
   - Use Heroku, Railway, Render, etc.
   - Get the deployed URL (e.g., `https://your-app.herokuapp.com`)

2. **Update Server URL:**
   - In the game, set server URL to your deployed URL
   - All players use the same online URL
   - Works from anywhere!

3. **Deploy Frontend:**
   - Deploy game files to GitHub Pages, Netlify, etc.
   - Update `serverUrl` in `classroom.js` to deployed backend URL

