// Simple Node.js server for classroom management
// Run with: node server.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// In-memory storage (use database in production)
const classrooms = new Map();
const scores = new Map();

app.use(cors());
app.use(express.json());

// Create classroom
app.post('/api/classroom/create', (req, res) => {
    const { code, playerId, playerName } = req.body;
    
    if (classrooms.has(code)) {
        return res.status(400).json({ error: 'Classroom already exists' });
    }
    
    const classroom = {
        code,
        players: [{ playerId, playerName }],
        createdAt: Date.now()
    };
    
    classrooms.set(code, classroom);
    scores.set(code, []);
    
    console.log(`Classroom created: ${code} by ${playerName}`);
    res.json({ success: true, classroom });
});

// Join classroom
app.post('/api/classroom/join', (req, res) => {
    const { code, playerId, playerName } = req.body;
    
    const classroom = classrooms.get(code);
    if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
    }
    
    // Check if player already in classroom
    const exists = classroom.players.some(p => p.playerId === playerId);
    if (!exists) {
        classroom.players.push({ playerId, playerName });
        classrooms.set(code, classroom);
    }
    
    console.log(`Player ${playerName} joined classroom ${code}`);
    res.json({ success: true, classroom });
});

// Leave classroom
app.post('/api/classroom/leave', (req, res) => {
    const { code, playerId } = req.body;
    
    const classroom = classrooms.get(code);
    if (classroom) {
        classroom.players = classroom.players.filter(p => p.playerId !== playerId);
        classrooms.set(code, classroom);
        console.log(`Player left classroom ${code}`);
    }
    
    res.json({ success: true });
});

// Get players in classroom
app.get('/api/classroom/players/:code', (req, res) => {
    const { code } = req.params;
    const classroom = classrooms.get(code);
    
    if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
    }
    
    res.json({ players: classroom.players });
});

// Submit score
app.post('/api/classroom/score', (req, res) => {
    const { code, playerId, playerName, score, successfulHashes, timestamp } = req.body;
    
    const classroomScores = scores.get(code) || [];
    const scoreData = {
        playerId,
        playerName,
        score,
        successfulHashes,
        timestamp
    };
    
    // Remove old score from same player
    const filtered = classroomScores.filter(s => s.playerId !== playerId);
    filtered.push(scoreData);
    
    // Sort by score and keep top 100
    filtered.sort((a, b) => b.score - a.score);
    scores.set(code, filtered.slice(0, 100));
    
    console.log(`Score submitted: ${playerName} - ${score} points in classroom ${code}`);
    res.json({ success: true });
});

// Get leaderboard
app.get('/api/classroom/leaderboard/:code', (req, res) => {
    const { code } = req.params;
    const classroomScores = scores.get(code) || [];
    
    res.json({ leaderboard: classroomScores });
});

// Cleanup old classrooms (every hour)
setInterval(() => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    for (const [code, classroom] of classrooms.entries()) {
        if (now - classroom.createdAt > oneHour && classroom.players.length === 0) {
            classrooms.delete(code);
            scores.delete(code);
            console.log(`Cleaned up empty classroom: ${code}`);
        }
    }
}, 60 * 60 * 1000);

// Get local IP address for network access
const os = require('os');

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (loopback) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const LOCAL_IP = getLocalIP();

// Listen on all network interfaces (0.0.0.0) so others can connect
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Classroom server running!`);
    console.log(`📚 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://${LOCAL_IP}:${PORT}`);
    console.log(`\n💡 Share the network URL with others to join your classroom!`);
    console.log(`   Make sure they use: http://${LOCAL_IP}:${PORT} as the server URL`);
});

