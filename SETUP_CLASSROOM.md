# Classroom Multiplayer Setup

## Overview

The game now supports multiplayer classrooms! Players can create or join classrooms using a 6-digit code to compete together.

## Features

- **Create Classroom**: Generate a unique 6-digit code
- **Join Classroom**: Enter a code to join an existing classroom
- **Real-time Players**: See who's in your classroom
- **Classroom Leaderboard**: Compete with players in your classroom
- **Works Offline**: Falls back to localStorage if server is unavailable

## Setup Instructions

### Option 1: With Backend Server (Recommended for Real Multiplayer)

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Start the Game Server** (in a separate terminal)
   ```bash
   python -m http.server 8000
   ```

5. **Open the Game**
   - Go to: `http://localhost:8000`
   - The classroom server runs on: `http://localhost:3000`

### Option 2: Without Backend Server (LocalStorage Only)

The game works without the backend server using localStorage, but:
- Only works on the same browser/computer
- Players on different devices won't see each other
- Still functional for single-device testing

## How to Use

### Creating a Classroom

1. Click "Join/Create Classroom" on the start screen
2. Click "Create New Classroom"
3. A 6-digit code will be generated
4. Share this code with others
5. Click "Start Game" when ready

### Joining a Classroom

1. Click "Join/Create Classroom" on the start screen
2. Enter the 6-digit classroom code
3. Click "Join"
4. You'll see other players in the classroom
5. Click "Start Game" when ready

### Playing in a Classroom

- All players in the same classroom see the same leaderboard
- Scores are synced in real-time (if server is running)
- The classroom badge shows at the top during gameplay
- Leaderboard shows only players in your classroom

## Server Configuration

The server URL is configured in `classroom.js`:
```javascript
this.serverUrl = 'http://localhost:3000';
```

For production, change this to your deployed server URL.

## API Endpoints

The server provides these endpoints:

- `POST /api/classroom/create` - Create a new classroom
- `POST /api/classroom/join` - Join an existing classroom
- `POST /api/classroom/leave` - Leave a classroom
- `GET /api/classroom/players/:code` - Get players in classroom
- `POST /api/classroom/score` - Submit a score
- `GET /api/classroom/leaderboard/:code` - Get classroom leaderboard

## Deployment

### Deploy Backend Server

You can deploy the server to:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Deploy from GitHub
- **Vercel/Netlify**: For serverless functions

Update `serverUrl` in `classroom.js` to your deployed URL.

### Deploy Frontend

Deploy the frontend files to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

Make sure to update the `serverUrl` in `classroom.js` to point to your backend.

## Troubleshooting

### "Cannot connect to server"
- Make sure the backend server is running on port 3000
- Check that `serverUrl` in `classroom.js` is correct
- The game will fall back to localStorage if server is unavailable

### "Classroom not found"
- Make sure you entered the correct 6-digit code
- Check that the classroom creator is still connected
- Classrooms expire after 1 hour of inactivity

### Players not showing up
- Make sure backend server is running
- Check browser console for errors
- Try refreshing the page

## Notes

- Classrooms are stored in memory (lost on server restart)
- For production, use a database (MongoDB, PostgreSQL, etc.)
- Player IDs are stored in localStorage for persistence
- Scores sync every 2 seconds when server is connected

