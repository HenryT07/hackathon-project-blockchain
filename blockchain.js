// Solana Blockchain Utilities for Trivia Game
// This module handles hash generation, prize pool, and leaderboard on Solana

class SolanaTriviaGame {
    constructor() {
        this.connection = null;
        this.wallet = null;
        this.publicKey = null;
        this.prizePool = 0;
        this.leaderboard = [];
        this.hashDifficulty = 4; // Number of leading zeros required for successful hash
        this.programId = null; // Will be set when program is deployed
        
        // Initialize Solana connection (default to devnet)
        this.initConnection();
        
        // Initialize from localStorage
        this.loadLeaderboard();
        this.loadPrizePool();
    }

    // Initialize Solana Connection
    initConnection() {
        // Use devnet for development, mainnet-beta for production
        const network = 'devnet'; // Change to 'mainnet-beta' for production
        this.connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl(network),
            'confirmed'
        );
    }

    // Connect Phantom Wallet (Browser Extension)
    async connectWallet() {
        try {
            console.log('Attempting to connect Phantom wallet...');
            
            // First try to get provider immediately
            let provider = this.getPhantomProvider();
            
            // If not found, wait a bit for it to be injected
            if (!provider) {
                console.log('Phantom not found immediately, waiting for injection...');
                provider = await this.waitForPhantom(3000);
            }
            
            if (!provider) {
                console.error('Phantom wallet not found after waiting');
                
                // Check if window.solana exists at all
                const hasSolana = typeof window !== 'undefined' && !!window.solana;
                let errorMsg = 'Phantom wallet not found. ';
                
                if (!hasSolana) {
                    errorMsg += 'window.solana is undefined - the Phantom extension is not injecting into this page. ';
                    errorMsg += 'Please verify the extension is installed and enabled, then refresh the page. ';
                    errorMsg += 'Visit https://phantom.app/ to install.';
                } else {
                    errorMsg += 'Please make sure the Phantom browser extension is installed and enabled. Visit https://phantom.app/ to install.';
                }
                
                throw new Error(errorMsg);
            }

            console.log('Phantom provider found:', provider);

            // Check if already connected
            if (provider.isConnected && provider.publicKey) {
                console.log('Already connected to:', provider.publicKey.toString());
                this.publicKey = provider.publicKey;
                this.wallet = provider;
                this.setupEventListeners(provider);
                return this.publicKey.toString();
            }

            console.log('Requesting connection...');
            // Connect to Phantom - use connect() method
            // Some versions might need { onlyIfTrusted: false }
            let resp;
            try {
                resp = await provider.connect();
            } catch (connectError) {
                console.error('Connection error:', connectError);
                // Try with explicit parameters
                if (provider.connect && typeof provider.connect === 'function') {
                    resp = await provider.connect({ onlyIfTrusted: false });
                } else {
                    throw connectError;
                }
            }

            if (!resp || !resp.publicKey) {
                throw new Error('Connection failed: No public key returned');
            }

            console.log('Connected successfully:', resp.publicKey.toString());
            this.publicKey = resp.publicKey;
            this.wallet = provider;
            
            // Set up event listeners
            this.setupEventListeners(provider);
            
            return this.publicKey.toString();
        } catch (error) {
            console.error('Error connecting wallet:', error);
            if (error.code === 4001) {
                throw new Error('User rejected the connection request');
            }
            if (error.message) {
                throw error;
            }
            throw new Error('Failed to connect to Phantom wallet: ' + (error.toString() || 'Unknown error'));
        }
    }

    // Set up event listeners for wallet
    setupEventListeners(provider) {
        try {
            // Listen for disconnect events
            if (provider.on && typeof provider.on === 'function') {
                provider.on('disconnect', () => {
                    console.log('Wallet disconnected');
                    this.publicKey = null;
                    this.wallet = null;
                    this.handleWalletDisconnect();
                });

                // Listen for account changes
                provider.on('accountChanged', (publicKey) => {
                    console.log('Account changed:', publicKey ? publicKey.toString() : 'disconnected');
                    if (publicKey) {
                        this.publicKey = publicKey;
                    } else {
                        this.publicKey = null;
                        this.wallet = null;
                        this.handleWalletDisconnect();
                    }
                });
            }
        } catch (error) {
            console.warn('Could not set up event listeners:', error);
        }
    }

    // Get Phantom Provider (supports both extension and desktop)
    getPhantomProvider() {
        // More lenient detection - check if window.solana exists and has connect method
        if (typeof window !== 'undefined' && window.solana) {
            // Check if it's Phantom (preferred)
            if (window.solana.isPhantom) {
                console.log('Phantom detected via window.solana (isPhantom=true)');
                return window.solana;
            }
            // If window.solana exists and has connect method, assume it's a Solana wallet
            // (Phantom might not always set isPhantom immediately)
            if (typeof window.solana.connect === 'function') {
                console.log('Solana wallet detected via window.solana (has connect method)');
                // Additional check: Phantom usually has these properties
                if (window.solana.publicKey !== undefined || window.solana.isConnected !== undefined) {
                    console.log('Likely Phantom wallet detected');
                    return window.solana;
                }
            }
        }
        
        // Check for Phantom in different locations (for various wallet implementations)
        if (typeof window !== 'undefined' && window.phantom) {
            if (window.phantom.solana) {
                console.log('Phantom detected via window.phantom.solana');
                return window.phantom.solana;
            }
            // Sometimes Phantom injects directly as window.phantom
            if (typeof window.phantom.connect === 'function') {
                console.log('Phantom detected via window.phantom (direct)');
                return window.phantom;
            }
        }
        
        // Check for injected provider
        if (typeof window !== 'undefined' && window.solflare && window.solflare.isSolflare) {
            // Optional: Support Solflare as alternative
            console.log('Solflare detected');
            return window.solflare;
        }
        
        console.log('No Phantom wallet detected. Available:', {
            hasWindow: typeof window !== 'undefined',
            hasSolana: typeof window !== 'undefined' && !!window.solana,
            solanaIsPhantom: typeof window !== 'undefined' && window.solana && window.solana.isPhantom,
            hasPhantom: typeof window !== 'undefined' && !!window.phantom
        });
        
        return null;
    }

    // Wait for Phantom to be injected (with timeout)
    async waitForPhantom(maxWait = 5000) {
        const startTime = Date.now();
        let lastCheck = 0;
        
        while (Date.now() - startTime < maxWait) {
            const provider = this.getPhantomProvider();
            if (provider) {
                console.log(`Phantom found after ${Date.now() - startTime}ms`);
                return provider;
            }
            
            // Log progress every 500ms
            const elapsed = Date.now() - startTime;
            if (elapsed - lastCheck >= 500) {
                console.log(`Waiting for Phantom... (${Math.round(elapsed/1000)}s)`);
                lastCheck = elapsed;
            }
            
            // Wait 100ms before checking again
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.warn(`Phantom not found after ${maxWait}ms`);
        return null;
    }

    // Handle wallet disconnect
    handleWalletDisconnect() {
        const walletInfo = document.getElementById('wallet-info');
        const connectBtn = document.getElementById('connect-wallet-btn');
        
        if (walletInfo) {
            walletInfo.style.display = 'none';
        }
        
        if (connectBtn) {
            connectBtn.textContent = 'Connect Phantom';
            connectBtn.disabled = false;
            connectBtn.classList.remove('connected');
        }
    }

    // Disconnect Wallet
    async disconnectWallet() {
        if (this.wallet && this.wallet.disconnect) {
            try {
                await this.wallet.disconnect();
            } catch (error) {
                console.error('Error disconnecting wallet:', error);
            }
        }
        this.publicKey = null;
        this.wallet = null;
        this.handleWalletDisconnect();
    }

    // Generate Hash Attempts
    async generateHashes(answerData, isCorrect) {
        const hashAttempts = [];
        const numAttempts = isCorrect ? 3 : 1; // More attempts for correct answers
        
        for (let i = 0; i < numAttempts; i++) {
            const attempt = await this.attemptHash(answerData, i);
            hashAttempts.push(attempt);
        }
        
        return hashAttempts;
    }

    // Attempt to generate a successful hash
    async attemptHash(answerData, nonce) {
        const timestamp = Date.now();
        const walletAddr = this.publicKey ? this.publicKey.toString() : 'anonymous';
        const data = `${answerData}-${nonce}-${timestamp}-${walletAddr}`;
        
        // Generate hash using Web Crypto API (SHA-256)
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Check if hash is successful (starts with required zeros)
        const isSuccessful = this.checkHashSuccess(hashHex);
        
        const hashAttempt = {
            hash: hashHex,
            data: data,
            nonce: nonce,
            timestamp: timestamp,
            successful: isSuccessful,
            difficulty: this.hashDifficulty
        };

        // If unsuccessful, contribute to prize pool
        if (!isSuccessful) {
            this.contributeToPrizePool(0.001); // 0.001 SOL per unsuccessful hash
        }

        return hashAttempt;
    }

    // Check if hash meets difficulty requirement
    checkHashSuccess(hash) {
        const requiredZeros = '0'.repeat(this.hashDifficulty);
        return hash.startsWith(requiredZeros);
    }

    // Contribute to Prize Pool
    contributeToPrizePool(amount) {
        this.prizePool += amount;
        this.savePrizePool();
        this.updatePrizePoolDisplay();
    }

    // Update Prize Pool Display
    updatePrizePoolDisplay() {
        const prizePoolElement = document.getElementById('prize-pool');
        if (prizePoolElement) {
            prizePoolElement.textContent = this.prizePool.toFixed(3);
        }
    }

    // Submit Hash Attempt to Solana (if program is deployed)
    async submitHashToSolana(hash, successful) {
        if (!this.publicKey || !this.programId) {
            // Program not deployed, just store locally
            return;
        }

        try {
            // This would interact with the Solana program
            // For now, we'll simulate it
            // In production, you would:
            // 1. Create a transaction
            // 2. Add instruction to submit hash
            // 3. Sign and send transaction
            
            console.log('Hash submitted to Solana:', { hash, successful });
        } catch (error) {
            console.error('Error submitting hash to Solana:', error);
        }
    }

    // Submit Score to Solana Program
    async submitScoreToSolana(score, successfulHashes) {
        // Check if wallet is actually connected
        if (!this.publicKey) {
            console.warn('⚠️ No wallet connected - score not saved to leaderboard');
            return;
        }
        
        const walletAddr = this.publicKey.toString();
        
        // Check if it's a valid Solana address (not demo)
        if (walletAddr.startsWith('Demo') || walletAddr === 'Anonymous') {
            console.warn('⚠️ Demo mode - score not saved to leaderboard');
            return;
        }
        
        if (!this.programId) {
            // Program not deployed, store locally with wallet address
            this.addToLeaderboard(score, successfulHashes, walletAddr);
            return;
        }

        try {
            // This would interact with the Solana program
            // In production, you would:
            // 1. Create a transaction
            // 2. Add instruction to submit score
            // 3. Sign and send transaction
            
            console.log('Score submitted to Solana:', { score, successfulHashes });
            this.addToLeaderboard(score, successfulHashes, this.publicKey.toString());
        } catch (error) {
            console.error('Error submitting score to Solana:', error);
            // Fallback to local storage
            this.addToLeaderboard(score, successfulHashes, this.publicKey ? this.publicKey.toString() : null);
        }
    }

    // Add Score to Leaderboard
    addToLeaderboard(score, successfulHashes, walletAddress) {
        // Only save if we have a valid wallet address (not demo/anonymous)
        if (!walletAddress || walletAddress === 'Anonymous' || walletAddress.startsWith('Demo')) {
            console.warn('Score not saved to leaderboard - no valid wallet connected');
            return;
        }
        
        const playerAddress = walletAddress;
        const shortAddress = this.shortenAddress(playerAddress);
        
        const entry = {
            address: playerAddress,
            shortAddress: shortAddress,
            score: score,
            successfulHashes: successfulHashes,
            timestamp: Date.now()
        };

        this.leaderboard.push(entry);
        this.leaderboard.sort((a, b) => b.score - a.score); // Sort by score descending
        this.leaderboard = this.leaderboard.slice(0, 100); // Keep top 100
        
        this.saveLeaderboard();
    }

    // Get Top Players
    getTopPlayers(limit = 10) {
        return this.leaderboard.slice(0, limit);
    }

    // Shorten Address (Solana addresses are base58, typically 32-44 chars)
    shortenAddress(address) {
        if (!address || address === 'Anonymous') return 'Anonymous';
        if (address.length <= 12) return address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    // Get Balance
    async getBalance() {
        if (!this.publicKey || !this.connection) {
            return 0;
        }
        try {
            const balance = await this.connection.getBalance(this.publicKey);
            return balance / solanaWeb3.LAMPORTS_PER_SOL; // Convert lamports to SOL
        } catch (error) {
            console.error('Error getting balance:', error);
            return 0;
        }
    }

    // Save/Load Leaderboard
    saveLeaderboard() {
        try {
            localStorage.setItem('solanaTriviaLeaderboard', JSON.stringify(this.leaderboard));
        } catch (error) {
            console.error('Error saving leaderboard:', error);
        }
    }

    loadLeaderboard() {
        try {
            const saved = localStorage.getItem('solanaTriviaLeaderboard');
            if (saved) {
                this.leaderboard = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            this.leaderboard = [];
        }
    }

    // Save/Load Prize Pool
    savePrizePool() {
        try {
            localStorage.setItem('solanaTriviaPrizePool', this.prizePool.toString());
        } catch (error) {
            console.error('Error saving prize pool:', error);
        }
    }

    loadPrizePool() {
        try {
            const saved = localStorage.getItem('solanaTriviaPrizePool');
            if (saved) {
                this.prizePool = parseFloat(saved);
            }
        } catch (error) {
            console.error('Error loading prize pool:', error);
            this.prizePool = 0;
        }
    }

    // Reset Prize Pool (for testing/admin)
    resetPrizePool() {
        this.prizePool = 0;
        this.savePrizePool();
        this.updatePrizePoolDisplay();
    }

    // Get Prize Pool
    getPrizePool() {
        return this.prizePool;
    }

    // Set Program ID (for when program is deployed)
    setProgramId(programId) {
        this.programId = new solanaWeb3.PublicKey(programId);
    }
}

// Initialize Solana trivia game instance
const blockchainGame = new SolanaTriviaGame();
