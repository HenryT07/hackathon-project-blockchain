// Classroom Management for Multiplayer Trivia Game

class ClassroomManager {
    constructor() {
        this.classroomCode = null;
        this.playerId = null;
        this.playerName = null;
        // Auto-detect server URL or use configured one
        this.serverUrl = this.getServerUrl();
        this.pollInterval = null;
        this.players = [];
        this.isConnected = false;
        
        // Generate unique player ID
        this.playerId = this.generatePlayerId();
        this.playerName = this.getPlayerName();
    }

    // Get server URL - check localStorage first, then default
    getServerUrl() {
        // Check if user has configured a custom server URL
        const savedUrl = localStorage.getItem('classroomServerUrl');
        if (savedUrl) {
            return savedUrl;
        }
        
        // Default to same origin (if server is on same host) or localhost
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        } else {
            // If deployed, assume server is on same host but different port
            return `http://${hostname}:3000`;
        }
    }

    // Set custom server URL
    setServerUrl(url) {
        this.serverUrl = url;
        localStorage.setItem('classroomServerUrl', url);
    }

    // Generate unique player ID
    generatePlayerId() {
        const stored = localStorage.getItem('playerId');
        if (stored) return stored;
        
        const id = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('playerId', id);
        return id;
    }

    // Get player name (from wallet or generate)
    getPlayerName() {
        const walletAddr = blockchainGame.publicKey ? blockchainGame.shortenAddress(blockchainGame.publicKey.toString()) : null;
        if (walletAddr && !walletAddr.startsWith('Demo')) {
            return walletAddr;
        }
        return 'Player_' + this.playerId.slice(-6);
    }

    // Generate 6-digit classroom code
    generateClassroomCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Create a new classroom
    async createClassroom() {
        try {
            const code = this.generateClassroomCode();
            this.classroomCode = code;
            
            // Try to connect to backend, fallback to localStorage
            try {
                const response = await fetch(`${this.serverUrl}/api/classroom/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code: code,
                        playerId: this.playerId,
                        playerName: this.playerName
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.isConnected = true;
                    this.startPolling();
                    return code;
                }
            } catch (error) {
                console.warn('Backend not available, using localStorage fallback:', error);
            }
            
            // Fallback: Store in localStorage
            this.saveClassroomToLocal(code);
            this.isConnected = false;
            return code;
        } catch (error) {
            console.error('Error creating classroom:', error);
            throw error;
        }
    }

    // Test server connection
    async testConnection() {
        try {
            const response = await fetch(`${this.serverUrl}/api/test`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            return response.ok;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }

    // Join an existing classroom
    async joinClassroom(code) {
        try {
            this.classroomCode = code.toUpperCase();
            
            // First, test if server is reachable
            const serverReachable = await this.testConnection();
            if (!serverReachable) {
                // Try to provide helpful error message
                const errorMsg = `Cannot connect to server at ${this.serverUrl}\n\n` +
                    `Possible issues:\n` +
                    `1. Server is not running\n` +
                    `2. Wrong server URL (check the Server URL field)\n` +
                    `3. Firewall blocking connection\n` +
                    `4. CORS error (server needs to allow your origin)\n\n` +
                    `For local network: Use http://YOUR_IP:3000 (not localhost)\n` +
                    `For same computer: Use http://localhost:3000`;
                throw new Error(errorMsg);
            }
            
            // Try to connect to backend
            try {
                const response = await fetch(`${this.serverUrl}/api/classroom/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code: this.classroomCode,
                        playerId: this.playerId,
                        playerName: this.playerName
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.isConnected = true;
                    this.players = data.classroom?.players || data.players || [];
                    this.startPolling();
                    return true;
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    if (response.status === 404) {
                        throw new Error(`Classroom code "${this.classroomCode}" not found. Make sure:\n1. The code is correct (6 digits)\n2. The classroom was created on the same server\n3. The server URL matches the creator's server`);
                    } else {
                        throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
                    }
                }
            } catch (error) {
                // If it's a network error, provide better message
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    throw new Error(`Network error: Cannot reach server at ${this.serverUrl}\n\nMake sure:\n1. Server is running\n2. Server URL is correct\n3. No firewall blocking`);
                }
                // Re-throw if it's already a formatted error
                if (error.message.includes('Classroom code') || error.message.includes('Server error')) {
                    throw error;
                }
                // Otherwise, it's a connection issue
                throw new Error(`Connection failed: ${error.message}\n\nServer URL: ${this.serverUrl}`);
            }
        } catch (error) {
            console.error('Error joining classroom:', error);
            throw error;
        }
    }

    // Leave classroom
    async leaveClassroom() {
        if (this.classroomCode) {
            try {
                if (this.isConnected) {
                    await fetch(`${this.serverUrl}/api/classroom/leave`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            code: this.classroomCode,
                            playerId: this.playerId
                        })
                    });
                }
            } catch (error) {
                console.warn('Error leaving classroom:', error);
            }
            
            this.stopPolling();
            this.removePlayerFromLocal();
            this.classroomCode = null;
            this.players = [];
            this.isConnected = false;
        }
    }

    // Submit score to classroom
    async submitScore(score, successfulHashes) {
        if (!this.classroomCode) return;
        
        const scoreData = {
            playerId: this.playerId,
            playerName: this.playerName,
            score: score,
            successfulHashes: successfulHashes,
            timestamp: Date.now()
        };
        
        try {
            if (this.isConnected) {
                await fetch(`${this.serverUrl}/api/classroom/score`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code: this.classroomCode,
                        ...scoreData
                    })
                });
            } else {
                // Fallback: Save to localStorage
                this.saveScoreToLocal(scoreData);
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            this.saveScoreToLocal(scoreData);
        }
    }

    // Get classroom leaderboard
    async getClassroomLeaderboard() {
        if (!this.classroomCode) return [];
        
        try {
            if (this.isConnected) {
                const response = await fetch(`${this.serverUrl}/api/classroom/leaderboard/${this.classroomCode}`);
                if (response.ok) {
                    const data = await response.json();
                    return data.leaderboard || [];
                }
            }
        } catch (error) {
            console.warn('Error fetching leaderboard:', error);
        }
        
        // Fallback: Get from localStorage
        return this.getScoresFromLocal();
    }

    // Start polling for updates
    startPolling() {
        if (this.pollInterval) return;
        
        this.pollInterval = setInterval(async () => {
            await this.updatePlayers();
        }, 2000); // Poll every 2 seconds
    }

    // Stop polling
    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    // Update players list
    async updatePlayers() {
        if (!this.classroomCode || !this.isConnected) return;
        
        try {
            const response = await fetch(`${this.serverUrl}/api/classroom/players/${this.classroomCode}`);
            if (response.ok) {
                const data = await response.json();
                this.players = data.players || [];
                this.updatePlayersDisplay();
            }
        } catch (error) {
            console.warn('Error updating players:', error);
        }
    }

    // Update players display
    updatePlayersDisplay() {
        if (playerCount) {
            playerCount.textContent = this.players.length;
        }
        
        if (playersList) {
            playersList.innerHTML = '';
            this.players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player-item';
                playerDiv.textContent = player.name || player.playerName;
                playersList.appendChild(playerDiv);
            });
        }
    }

    // LocalStorage fallback methods
    saveClassroomToLocal(code) {
        const classroom = {
            code: code,
            players: [{
                playerId: this.playerId,
                playerName: this.playerName
            }],
            createdAt: Date.now()
        };
        localStorage.setItem(`classroom_${code}`, JSON.stringify(classroom));
    }

    loadClassroomFromLocal(code) {
        const data = localStorage.getItem(`classroom_${code}`);
        return data ? JSON.parse(data) : null;
    }

    addPlayerToLocal() {
        if (!this.classroomCode) return;
        
        const classroom = this.loadClassroomFromLocal(this.classroomCode);
        if (classroom) {
            // Check if player already exists
            const exists = classroom.players.some(p => p.playerId === this.playerId);
            if (!exists) {
                classroom.players.push({
                    playerId: this.playerId,
                    playerName: this.playerName
                });
                localStorage.setItem(`classroom_${this.classroomCode}`, JSON.stringify(classroom));
            }
            this.players = classroom.players;
        }
    }

    removePlayerFromLocal() {
        if (!this.classroomCode) return;
        
        const classroom = this.loadClassroomFromLocal(this.classroomCode);
        if (classroom) {
            classroom.players = classroom.players.filter(p => p.playerId !== this.playerId);
            localStorage.setItem(`classroom_${this.classroomCode}`, JSON.stringify(classroom));
        }
    }

    saveScoreToLocal(scoreData) {
        if (!this.classroomCode) return;
        
        const key = `classroom_scores_${this.classroomCode}`;
        const scores = JSON.parse(localStorage.getItem(key) || '[]');
        scores.push(scoreData);
        // Keep only top 100 scores
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem(key, JSON.stringify(scores.slice(0, 100)));
    }

    getScoresFromLocal() {
        if (!this.classroomCode) return [];
        
        const key = `classroom_scores_${this.classroomCode}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }
}

// Initialize classroom manager
const classroomManager = new ClassroomManager();

