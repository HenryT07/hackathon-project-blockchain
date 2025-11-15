// Simple Node.js server for classroom management
// Run with: node server.js

// Check for required modules
try {
    var express = require('express');
    var cors = require('cors');
} catch (error) {
    console.error('❌ Error: Missing dependencies!');
    console.error('Please run: npm install');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage (use database in production)
const classrooms = new Map();
const scores = new Map();

// CORS configuration - allow all origins for development
app.use(cors({
    origin: '*', // Allow all origins (change in production)
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Test endpoint to verify server is reachable
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Server is running', timestamp: Date.now() });
});

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Listen on all network interfaces (0.0.0.0) so others can connect
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Classroom server running!`);
    console.log(`📚 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://${LOCAL_IP}:${PORT}`);
    console.log(`\n💡 Share the network URL with others to join your classroom!`);
    console.log(`   Make sure they use: http://${LOCAL_IP}:${PORT} as the server URL`);
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use!`);
        console.error('\n💡 Solutions:');
        console.error(`1. Stop the other application using port ${PORT}`);
        console.error('2. Or change PORT in server.js to a different number (e.g., 3001)');
        console.error('3. Or set PORT environment variable: $env:PORT=3001; node server.js (Windows)');
        console.error('   Or: PORT=3001 node server.js (Mac/Linux)');
    } else {
        console.error('❌ Error starting server:', err.message);
    }
    process.exit(1);
});

