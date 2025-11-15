// Question Database
const questions = {
    blockchain: [
        {
            question: "What is a blockchain?",
            answers: [
                "A distributed ledger technology",
                "A type of cryptocurrency",
                "A programming language",
                "A database management system"
            ],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "What does 'mining' mean in blockchain?",
            answers: [
                "Digging for digital coins",
                "The process of validating transactions and adding them to the blockchain",
                "Creating new wallets",
                "Trading cryptocurrencies"
            ],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "What is a smart contract?",
            answers: [
                "A legal document",
                "Self-executing contracts with terms written in code",
                "A type of cryptocurrency",
                "A blockchain protocol"
            ],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "What consensus mechanism does Bitcoin use?",
            answers: [
                "Proof of Stake",
                "Proof of Work",
                "Delegated Proof of Stake",
                "Proof of Authority"
            ],
            correct: 1,
            difficulty: "hard"
        },
        {
            question: "What is a hash in blockchain?",
            answers: [
                "A type of cryptocurrency",
                "A unique digital fingerprint of data",
                "A wallet address",
                "A transaction fee"
            ],
            correct: 1,
            difficulty: "medium"
        }
    ],
    programming: [
        {
            question: "What does HTML stand for?",
            answers: [
                "HyperText Markup Language",
                "High-level Text Markup Language",
                "Hyperlink and Text Markup Language",
                "Home Tool Markup Language"
            ],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "Which of the following is NOT a JavaScript framework?",
            answers: [
                "React",
                "Vue",
                "Angular",
                "Python"
            ],
            correct: 3,
            difficulty: "easy"
        },
        {
            question: "What is the time complexity of binary search?",
            answers: [
                "O(n)",
                "O(log n)",
                "O(n²)",
                "O(1)"
            ],
            correct: 1,
            difficulty: "hard"
        },
        {
            question: "What is a closure in JavaScript?",
            answers: [
                "A function that has access to variables in its outer scope",
                "A way to close a browser tab",
                "A type of loop",
                "A method to hide code"
            ],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "Which method adds an element to the end of an array in JavaScript?",
            answers: [
                "push()",
                "pop()",
                "shift()",
                "unshift()"
            ],
            correct: 0,
            difficulty: "easy"
        }
    ],
    science: [
        {
            question: "What is the speed of light in vacuum?",
            answers: [
                "300,000 km/s",
                "150,000 km/s",
                "450,000 km/s",
                "200,000 km/s"
            ],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "What is the chemical symbol for gold?",
            answers: [
                "Go",
                "Gd",
                "Au",
                "Ag"
            ],
            correct: 2,
            difficulty: "easy"
        },
        {
            question: "How many planets are in our solar system?",
            answers: [
                "7",
                "8",
                "9",
                "10"
            ],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "What is the smallest unit of matter?",
            answers: [
                "Molecule",
                "Atom",
                "Electron",
                "Proton"
            ],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "What process do plants use to make food?",
            answers: [
                "Respiration",
                "Photosynthesis",
                "Digestion",
                "Fermentation"
            ],
            correct: 1,
            difficulty: "easy"
        }
    ],
    history: [
        {
            question: "In which year did World War II end?",
            answers: [
                "1943",
                "1944",
                "1945",
                "1946"
            ],
            correct: 2,
            difficulty: "medium"
        },
        {
            question: "Who was the first person to walk on the moon?",
            answers: [
                "Buzz Aldrin",
                "Neil Armstrong",
                "Michael Collins",
                "Yuri Gagarin"
            ],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "Which ancient civilization built the pyramids?",
            answers: [
                "Greeks",
                "Romans",
                "Egyptians",
                "Mayans"
            ],
            correct: 2,
            difficulty: "easy"
        },
        {
            question: "When did the Berlin Wall fall?",
            answers: [
                "1987",
                "1988",
                "1989",
                "1990"
            ],
            correct: 2,
            difficulty: "medium"
        },
        {
            question: "Who painted the Mona Lisa?",
            answers: [
                "Michelangelo",
                "Vincent van Gogh",
                "Leonardo da Vinci",
                "Pablo Picasso"
            ],
            correct: 2,
            difficulty: "easy"
        }
    ]
};

// Game State
let gameState = {
    currentQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    selectedCategory: 'all',
    selectedDifficulty: 'easy',
    timer: null,
    timeLeft: 30,
    answered: false,
    hashAttempts: 0,
    successfulHashes: 0,
    totalHashAttempts: 0,
    totalSuccessfulHashes: 0,
    contributedToPool: 0
};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const quitBtn = document.getElementById('quit-btn');
const nextBtn = document.getElementById('next-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const homeBtn = document.getElementById('home-btn');
const categorySelect = document.getElementById('category');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const scoreDisplay = document.getElementById('score');
const questionNumber = document.getElementById('question-number');
const totalQuestions = document.getElementById('total-questions');
const timerDisplay = document.getElementById('timer');
const feedback = document.getElementById('feedback');
const questionCategory = document.getElementById('question-category');
const finalScore = document.getElementById('final-score');
const correctCount = document.getElementById('correct-count');
const incorrectCount = document.getElementById('incorrect-count');
const accuracy = document.getElementById('accuracy');
const hashCount = document.getElementById('hash-count');
const hashAttemptsDisplay = document.getElementById('hash-attempts');
const hashSuccessfulDisplay = document.getElementById('hash-successful');
const hashStatus = document.getElementById('hash-status');
const finalHashAttempts = document.getElementById('final-hash-attempts');
const finalHashSuccessful = document.getElementById('final-hash-successful');
const contributedAmount = document.getElementById('contributed-amount');
const connectWalletBtn = document.getElementById('connect-wallet-btn');
const walletInfo = document.getElementById('wallet-info');
const walletAddress = document.getElementById('wallet-address');
const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const leaderboardList = document.getElementById('leaderboard-list');
const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');
const testPhantomBtn = document.getElementById('test-phantom-btn');
const classroomBtn = document.getElementById('classroom-btn');
const classroomScreen = document.getElementById('classroom-screen');
const createClassroomBtn = document.getElementById('create-classroom-btn');
const joinClassroomBtn = document.getElementById('join-classroom-btn');
const classroomCodeInput = document.getElementById('classroom-code-input');
const classroomInfo = document.getElementById('classroom-info');
const classroomCodeDisplay = document.getElementById('classroom-code-display');
const playerCount = document.getElementById('player-count');
const playersList = document.getElementById('players-list');
const startClassroomGameBtn = document.getElementById('start-classroom-game-btn');
const leaveClassroomBtn = document.getElementById('leave-classroom-btn');
const currentClassroomCode = document.getElementById('current-classroom-code');
const classroomBadge = document.getElementById('classroom-badge');
const classroomPlayersCount = document.getElementById('classroom-players-count');
const headerClassroomBtn = document.getElementById('header-classroom-btn');
const serverUrlInput = document.getElementById('server-url-input');
const serverUrlInputTop = document.getElementById('server-url-input-top');
const updateServerBtn = document.getElementById('update-server-btn');
const testConnectionBtn = document.getElementById('test-connection-btn');
const testConnectionBtnTop = document.getElementById('test-connection-btn-top');
const connectionStatus = document.getElementById('connection-status');
const connectionStatusText = document.getElementById('connection-status-text');
const connectionStatusTop = document.getElementById('connection-status-top');
const connectionStatusTextTop = document.getElementById('connection-status-text-top');

// Initialize Game
function init() {
    startBtn.addEventListener('click', startGame);
    quitBtn.addEventListener('click', quitGame);
    nextBtn.addEventListener('click', nextQuestion);
    playAgainBtn.addEventListener('click', startGame);
    homeBtn.addEventListener('click', goHome);
    connectWalletBtn.addEventListener('click', connectWallet);
    if (disconnectWalletBtn) {
        disconnectWalletBtn.addEventListener('click', disconnectWallet);
    }
    if (testPhantomBtn) {
        testPhantomBtn.addEventListener('click', testPhantom);
    }
    viewLeaderboardBtn.addEventListener('click', showLeaderboard);
    leaderboardBtn.addEventListener('click', showLeaderboard);
    closeLeaderboardBtn.addEventListener('click', closeLeaderboard);
    
    // Classroom functionality
    if (classroomBtn) {
        classroomBtn.addEventListener('click', () => showScreen('classroom-screen'));
    }
    if (headerClassroomBtn) {
        headerClassroomBtn.addEventListener('click', () => showScreen('classroom-screen'));
    }
    if (createClassroomBtn) {
        createClassroomBtn.addEventListener('click', createClassroom);
    }
    if (joinClassroomBtn) {
        joinClassroomBtn.addEventListener('click', joinClassroom);
    }
    if (startClassroomGameBtn) {
        startClassroomGameBtn.addEventListener('click', () => {
            showScreen('start-screen');
            updateClassroomBadge();
            // Start polling for players if connected
            if (classroomManager.classroomCode && classroomManager.isConnected) {
                classroomManager.startPolling();
            }
        });
    }
    if (leaveClassroomBtn) {
        leaveClassroomBtn.addEventListener('click', leaveClassroom);
    }
    if (classroomCodeInput) {
        classroomCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                joinClassroom();
            }
        });
    }
    if (updateServerBtn) {
        updateServerBtn.addEventListener('click', updateServerUrl);
    }
    if (testConnectionBtn) {
        testConnectionBtn.addEventListener('click', () => testServerConnection(serverUrlInput, connectionStatus, connectionStatusText, testConnectionBtn));
    }
    if (testConnectionBtnTop) {
        testConnectionBtnTop.addEventListener('click', () => testServerConnection(serverUrlInputTop, connectionStatusTop, connectionStatusTextTop, testConnectionBtnTop));
    }
    if (serverUrlInput) {
        serverUrlInput.value = classroomManager.serverUrl;
        serverUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                updateServerUrl();
            }
        });
    }
    if (serverUrlInputTop) {
        serverUrlInputTop.value = classroomManager.serverUrl;
        serverUrlInputTop.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                updateServerUrlFromTop();
            }
        });
        // Sync top input with main input when it changes
        serverUrlInputTop.addEventListener('blur', () => {
            if (serverUrlInputTop.value.trim()) {
                classroomManager.setServerUrl(serverUrlInputTop.value.trim());
                if (serverUrlInput) {
                    serverUrlInput.value = serverUrlInputTop.value;
                }
            }
        });
    }
    
    // Update prize pool display on load
    blockchainGame.updatePrizePoolDisplay();
    
    // Check if wallet is already connected (e.g., page refresh)
    // Wait a bit for Phantom extension to inject
    setTimeout(() => {
        checkExistingConnection();
        // Also check what's available for debugging
        checkPhantomAvailability();
        
        // Show test button if Phantom not detected
        if (!blockchainGame.getPhantomProvider()) {
            if (testPhantomBtn) {
                testPhantomBtn.style.display = 'inline-block';
            }
        }
    }, 500);
}

// Debug function to check Phantom availability
function checkPhantomAvailability() {
    const debugDiv = document.getElementById('wallet-debug');
    if (!debugDiv) return;
    
    const hasSolana = typeof window !== 'undefined' && !!window.solana;
    const solanaInfo = hasSolana ? {
        'isPhantom': !!window.solana.isPhantom,
        'hasConnect': typeof window.solana.connect === 'function',
        'hasPublicKey': window.solana.publicKey !== undefined,
        'isConnected': window.solana.isConnected !== undefined,
        'keys': Object.keys(window.solana).slice(0, 5).join(', ')
    } : null;
    
    const checks = {
        'window exists': typeof window !== 'undefined',
        'window.solana exists': hasSolana,
        'window.solana.isPhantom': hasSolana && !!window.solana.isPhantom,
        'window.solana.hasConnect': hasSolana && typeof window.solana.connect === 'function',
        'window.phantom exists': typeof window !== 'undefined' && !!window.phantom,
        'Provider found': !!blockchainGame.getPhantomProvider()
    };
    
    const allGood = checks['Provider found'];
    
    if (!allGood) {
        debugDiv.style.display = 'block';
        let debugHTML = '<strong>Debug Info:</strong><br>' + 
            Object.entries(checks).map(([key, value]) => 
                `${key}: ${value ? '✅' : '❌'}`
            ).join('<br>');
        
        if (solanaInfo) {
            debugHTML += '<br><br><strong>window.solana details:</strong><br>' +
                Object.entries(solanaInfo).map(([key, value]) => 
                    `${key}: ${value}`
                ).join('<br>');
        }
        
        debugHTML += '<br><br><strong>⚠️ Troubleshooting:</strong>';
        debugHTML += '<br><small>1. Open browser console (F12) and type: <code>window.solana</code></small>';
        debugHTML += '<br><small>2. If it shows "undefined", Phantom is not injecting</small>';
        debugHTML += '<br><small>3. Verify Phantom extension is installed and ENABLED</small>';
        debugHTML += '<br><small>4. Try restarting your browser</small>';
        debugHTML += '<br><small>5. Check browser extension settings</small>';
        debugHTML += '<br><small>6. Try a hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)</small>';
        
        debugDiv.innerHTML = debugHTML;
    } else {
        debugDiv.style.display = 'none';
    }
}

// Start Game
function startGame() {
    gameState.selectedCategory = categorySelect.value;
    gameState.selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    
    // Filter questions based on category and difficulty
    gameState.currentQuestions = getFilteredQuestions();
    
    if (gameState.currentQuestions.length === 0) {
        alert('No questions available for the selected category and difficulty. Please try different options.');
        return;
    }
    
    // Shuffle questions
    shuffleArray(gameState.currentQuestions);
    
    // Take first 10 questions
    gameState.currentQuestions = gameState.currentQuestions.slice(0, 10);
    
    // Reset game state
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.correctAnswers = 0;
    gameState.incorrectAnswers = 0;
    gameState.answered = false;
    gameState.hashAttempts = 0;
    gameState.successfulHashes = 0;
    gameState.totalHashAttempts = 0;
    gameState.totalSuccessfulHashes = 0;
    gameState.contributedToPool = 0;
    
    // Show game screen
    showScreen('game-screen');
    
    // Start first question
    displayQuestion();
}

// Get filtered questions
function getFilteredQuestions() {
    let filtered = [];
    
    if (gameState.selectedCategory === 'all') {
        // Get questions from all categories
        Object.values(questions).forEach(categoryQuestions => {
            filtered = filtered.concat(categoryQuestions);
        });
    } else {
        filtered = questions[gameState.selectedCategory] || [];
    }
    
    // Filter by difficulty
    return filtered.filter(q => q.difficulty === gameState.selectedDifficulty);
}

// Display Question
function displayQuestion() {
    const question = gameState.currentQuestions[gameState.currentQuestionIndex];
    
    if (!question) {
        endGame();
        return;
    }
    
    // Reset state
    gameState.answered = false;
    gameState.timeLeft = 30;
    gameState.hashAttempts = 0;
    gameState.successfulHashes = 0;
    clearInterval(gameState.timer);
    
    // Update UI
    questionText.textContent = question.question;
    questionNumber.textContent = gameState.currentQuestionIndex + 1;
    totalQuestions.textContent = gameState.currentQuestions.length;
    scoreDisplay.textContent = gameState.score;
    hashCount.textContent = gameState.totalSuccessfulHashes;
    feedback.textContent = '';
    feedback.className = 'feedback';
    nextBtn.style.display = 'none';
    hashStatus.style.display = 'none';
    
    // Get category name
    const categoryName = getCategoryName(question);
    questionCategory.textContent = categoryName;
    
    // Display answers
    answersContainer.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index));
        answersContainer.appendChild(button);
    });
    
    // Start timer
    startTimer();
}

// Start Timer
function startTimer() {
    timerDisplay.textContent = gameState.timeLeft;
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        timerDisplay.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            if (!gameState.answered) {
                handleTimeout();
            }
        }
    }, 1000);
}

// Handle Timeout
function handleTimeout() {
    gameState.answered = true;
    gameState.incorrectAnswers++;
    
    const question = gameState.currentQuestions[gameState.currentQuestionIndex];
    const correctButton = answersContainer.children[question.correct];
    
    correctButton.classList.add('correct');
    
    // Disable all buttons
    Array.from(answersContainer.children).forEach(btn => {
        btn.classList.add('disabled');
        btn.disabled = true;
    });
    
    feedback.textContent = '⏰ Time\'s up!';
    feedback.className = 'feedback incorrect';
    nextBtn.style.display = 'block';
}

// Select Answer
async function selectAnswer(index) {
    if (gameState.answered) return;
    
    gameState.answered = true;
    clearInterval(gameState.timer);
    
    const question = gameState.currentQuestions[gameState.currentQuestionIndex];
    const selectedButton = answersContainer.children[index];
    const correctButton = answersContainer.children[question.correct];
    
    // Disable all buttons
    Array.from(answersContainer.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
    });
    
    const isCorrect = index === question.correct;
    const answerData = `${question.question}-${question.answers[index]}`;
    
    // Show hash status
    hashStatus.style.display = 'block';
    feedback.textContent = '⛏️ Mining hashes...';
    feedback.className = 'feedback';
    
    // Generate hashes
    try {
        const hashAttempts = await blockchainGame.generateHashes(answerData, isCorrect);
        gameState.hashAttempts = hashAttempts.length;
        gameState.totalHashAttempts += hashAttempts.length;
        
        const successful = hashAttempts.filter(h => h.successful).length;
        gameState.successfulHashes = successful;
        gameState.totalSuccessfulHashes += successful;
        
        // Update hash displays
        hashAttemptsDisplay.textContent = gameState.hashAttempts;
        hashSuccessfulDisplay.textContent = gameState.successfulHashes;
        hashCount.textContent = gameState.totalSuccessfulHashes;
        
        // Calculate contribution to pool
        const unsuccessful = hashAttempts.length - successful;
        const contribution = unsuccessful * 0.001;
        gameState.contributedToPool += contribution;
        
        if (isCorrect) {
            // Correct answer
            selectedButton.classList.add('correct');
            gameState.correctAnswers++;
            
            // Calculate score based on time left and successful hashes
            const basePoints = Math.max(10, Math.floor(gameState.timeLeft * 2));
            const hashBonus = successful * 5; // Bonus points for successful hashes
            const points = basePoints + hashBonus;
            gameState.score += points;
            scoreDisplay.textContent = gameState.score;
            
            if (successful > 0) {
                feedback.textContent = `✅ Correct! +${points} points (${successful} successful hash${successful > 1 ? 'es' : ''}!)`;
            } else {
                feedback.textContent = `✅ Correct! +${points} points (Hash mining failed - contributed ${contribution.toFixed(3)} SOL to pool)`;
            }
            feedback.className = 'feedback correct';
        } else {
            // Incorrect answer
            selectedButton.classList.add('incorrect');
            correctButton.classList.add('correct');
            gameState.incorrectAnswers++;
            
            if (contribution > 0) {
                feedback.textContent = `❌ Incorrect! Contributed ${contribution.toFixed(3)} SOL to prize pool`;
            } else {
                feedback.textContent = '❌ Incorrect!';
            }
            feedback.className = 'feedback incorrect';
        }
    } catch (error) {
        console.error('Error generating hashes:', error);
        // Fallback to normal answer handling
        if (isCorrect) {
            selectedButton.classList.add('correct');
            gameState.correctAnswers++;
            const points = Math.max(10, Math.floor(gameState.timeLeft * 2));
            gameState.score += points;
            scoreDisplay.textContent = gameState.score;
            feedback.textContent = `✅ Correct! +${points} points`;
            feedback.className = 'feedback correct';
        } else {
            selectedButton.classList.add('incorrect');
            correctButton.classList.add('correct');
            gameState.incorrectAnswers++;
            feedback.textContent = '❌ Incorrect!';
            feedback.className = 'feedback incorrect';
        }
    }
    
    nextBtn.style.display = 'block';
}

// Next Question
function nextQuestion() {
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex >= gameState.currentQuestions.length) {
        endGame();
    } else {
        displayQuestion();
    }
}

// End Game
async function endGame() {
    clearInterval(gameState.timer);
    
    // Submit score to Solana and add to leaderboard
    const walletAddr = blockchainGame.publicKey ? blockchainGame.publicKey.toString() : null;
    
    // Check if wallet is connected before saving
    if (!walletAddr || walletAddr.startsWith('Demo') || walletAddr === 'Anonymous') {
        console.warn('⚠️ No wallet connected - score will not be saved to leaderboard');
    }
    
    await blockchainGame.submitScoreToSolana(
        gameState.score,
        gameState.totalSuccessfulHashes
    );
    
    showScreen('results-screen');
    
    finalScore.textContent = gameState.score;
    correctCount.textContent = gameState.correctAnswers;
    incorrectCount.textContent = gameState.incorrectAnswers;
    
    const total = gameState.correctAnswers + gameState.incorrectAnswers;
    const accuracyPercent = total > 0 ? Math.round((gameState.correctAnswers / total) * 100) : 0;
    accuracy.textContent = accuracyPercent;
    
    // Update hash summary
    finalHashAttempts.textContent = gameState.totalHashAttempts;
    finalHashSuccessful.textContent = gameState.totalSuccessfulHashes;
    contributedAmount.textContent = gameState.contributedToPool.toFixed(3);
    
    // Update prize pool display
    blockchainGame.updatePrizePoolDisplay();
}

// Quit Game
function quitGame() {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
        clearInterval(gameState.timer);
        goHome();
    }
}

// Go Home
function goHome() {
    clearInterval(gameState.timer);
    showScreen('start-screen');
}

// Show Screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Get Category Name
function getCategoryName(question) {
    for (const [category, categoryQuestions] of Object.entries(questions)) {
        if (categoryQuestions.includes(question)) {
            return category.charAt(0).toUpperCase() + category.slice(1);
        }
    }
    return 'General';
}

// Shuffle Array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Connect Wallet
async function connectWallet() {
    // Disable button during connection
    connectWalletBtn.disabled = true;
    connectWalletBtn.textContent = 'Connecting...';
    
    try {
        console.log('Starting wallet connection...');
        const address = await blockchainGame.connectWallet();
        console.log('Wallet connected:', address);
        updateWalletUI(address);
        
        // Get and display balance
        try {
            const balance = await blockchainGame.getBalance();
            if (balance > 0) {
                walletAddress.textContent = blockchainGame.shortenAddress(address) + ` (${balance.toFixed(3)} SOL)`;
            } else {
                walletAddress.textContent = blockchainGame.shortenAddress(address);
            }
        } catch (balanceError) {
            console.warn('Could not fetch balance:', balanceError);
            walletAddress.textContent = blockchainGame.shortenAddress(address);
        }
    } catch (error) {
        console.error('Connection error:', error);
        let errorMessage = error.message || 'Unknown error occurred';
        
        // Re-enable button on error
        connectWalletBtn.disabled = false;
        connectWalletBtn.textContent = 'Connect Phantom';
        
        // Show user-friendly error
        if (errorMessage.includes('rejected')) {
            alert('Connection was cancelled. Please try again and approve the connection in Phantom.');
        } else if (errorMessage.includes('not found')) {
            // Check if window.solana is undefined
            const hasSolana = typeof window !== 'undefined' && !!window.solana;
            let instructions = 'Phantom wallet not detected.\n\n';
            
            if (!hasSolana) {
                instructions += '⚠️ window.solana is undefined - Phantom extension is not injecting.\n\n';
                instructions += 'Please verify:\n';
                instructions += '1. Phantom is installed from https://phantom.app/\n';
                instructions += '2. Extension is ENABLED in your browser\n';
                instructions += '3. You\'ve restarted your browser after installing\n';
                instructions += '4. Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)\n';
                instructions += '5. Check if other extensions are blocking it\n\n';
                instructions += 'To verify: Open browser console (F12) and type "window.solana"\n';
                instructions += 'If it shows "undefined", Phantom is not injecting properly.';
            } else {
                instructions += 'Please:\n1. Install Phantom from https://phantom.app/\n2. Refresh this page\n3. Make sure the extension is enabled';
            }
            
            alert(instructions);
        } else {
            alert('Error connecting wallet: ' + errorMessage + '\n\nPlease check the browser console for more details.');
        }
    }
}

// Update Wallet UI
function updateWalletUI(address) {
    walletAddress.textContent = blockchainGame.shortenAddress(address);
    walletInfo.style.display = 'flex';
    connectWalletBtn.textContent = 'Phantom Connected';
    connectWalletBtn.disabled = true;
    connectWalletBtn.classList.add('connected');
    
    // Hide test button when connected
    if (testPhantomBtn) {
        testPhantomBtn.style.display = 'none';
    }
    
    if (disconnectWalletBtn) {
        disconnectWalletBtn.style.display = 'inline-block';
    }
}

// Disconnect Wallet
async function disconnectWallet() {
    try {
        await blockchainGame.disconnectWallet();
        walletInfo.style.display = 'none';
        connectWalletBtn.textContent = 'Connect Phantom';
        connectWalletBtn.disabled = false;
        connectWalletBtn.classList.remove('connected');
    } catch (error) {
        console.error('Error disconnecting wallet:', error);
    }
}

// Test Phantom Availability
function testPhantom() {
    console.log('=== Testing Phantom Availability ===');
    
    const results = {
        'window exists': typeof window !== 'undefined',
        'window.solana exists': typeof window !== 'undefined' && !!window.solana,
        'window.solana type': typeof window !== 'undefined' && window.solana ? typeof window.solana : 'N/A',
        'window.solana.isPhantom': typeof window !== 'undefined' && window.solana && !!window.solana.isPhantom,
        'window.solana.connect': typeof window !== 'undefined' && window.solana && typeof window.solana.connect === 'function',
        'window.solana.publicKey': typeof window !== 'undefined' && window.solana && window.solana.publicKey !== undefined,
        'window.phantom exists': typeof window !== 'undefined' && !!window.phantom,
        'Protocol': typeof window !== 'undefined' ? window.location.protocol : 'N/A',
        'URL': typeof window !== 'undefined' ? window.location.href : 'N/A'
    };
    
    console.table(results);
    
    if (window.solana) {
        console.log('window.solana object:', window.solana);
        console.log('window.solana keys:', Object.keys(window.solana));
    }
    
    const provider = blockchainGame.getPhantomProvider();
    if (provider) {
        alert('✅ Phantom detected!\n\nClick "Connect Phantom" to connect.');
    } else {
        let msg = '❌ Phantom not detected\n\n';
        msg += 'Check console (F12) for details.\n\n';
        if (window.location.protocol === 'file:') {
            msg += '⚠️ You are using file:// protocol.\n';
            msg += 'Extensions cannot inject on local files.\n\n';
            msg += 'Solution: Run via local server:\n';
            msg += 'python -m http.server 8000\n';
            msg += 'Then open: http://localhost:8000';
        } else {
            msg += 'Make sure:\n';
            msg += '1. Phantom extension is installed\n';
            msg += '2. Extension is ENABLED\n';
            msg += '3. Browser was restarted after install';
        }
        alert(msg);
    }
}

// Check if wallet is already connected
async function checkExistingConnection() {
    try {
        // Wait a bit for Phantom to inject
        const provider = await blockchainGame.waitForPhantom(2000) || blockchainGame.getPhantomProvider();
        
        if (provider) {
            console.log('Phantom provider found, checking connection status...');
            // Check if already connected
            // Note: isConnected might not always be set, so check publicKey directly
            if (provider.publicKey) {
                console.log('Already connected to:', provider.publicKey.toString());
                blockchainGame.publicKey = provider.publicKey;
                blockchainGame.wallet = provider;
                const address = provider.publicKey.toString();
                updateWalletUI(address);
                
                // Set up event listeners
                blockchainGame.setupEventListeners(provider);
                
                // Get balance
                try {
                    const balance = await blockchainGame.getBalance();
                    if (balance > 0) {
                        walletAddress.textContent = blockchainGame.shortenAddress(address) + ` (${balance.toFixed(3)} SOL)`;
                    }
                } catch (error) {
                    console.warn('Could not fetch balance:', error);
                    // Ignore balance errors
                }
            } else {
                console.log('Phantom found but not connected');
            }
        } else {
            console.log('Phantom not detected');
        }
    } catch (error) {
        // Wallet not connected, that's fine
        console.log('No existing wallet connection:', error.message);
    }
}

// Show Leaderboard
function showLeaderboard() {
    // Check if in classroom mode
    if (classroomManager.classroomCode) {
        showClassroomLeaderboard();
        return;
    }
    
    // Show global leaderboard
    const topPlayers = blockchainGame.getTopPlayers(20);
    leaderboardList.innerHTML = '';
    
    if (topPlayers.length === 0) {
        leaderboardList.innerHTML = '<p class="no-leaders">No players yet. Be the first!</p>';
    } else {
        topPlayers.forEach((player, index) => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry';
            entry.innerHTML = `
                <div class="rank">#${index + 1}</div>
                <div class="player-info">
                    <div class="player-address">${player.shortAddress}</div>
                    <div class="player-stats">
                        <span>Score: ${player.score}</span>
                        <span>Hashes: ${player.successfulHashes}</span>
                    </div>
                </div>
            `;
            leaderboardList.appendChild(entry);
        });
    }
    
    showScreen('leaderboard-screen');
}

// Close Leaderboard
function closeLeaderboard() {
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen && currentScreen.id === 'leaderboard-screen') {
        // Return to previous screen or start screen
        if (gameState.currentQuestions.length > 0) {
            showScreen('results-screen');
        } else {
            showScreen('start-screen');
        }
    }
}

// Classroom Functions (defined here to avoid loading issues)
async function createClassroom() {
    try {
        // Update server URL if changed
        if (serverUrlInput && serverUrlInput.value !== classroomManager.serverUrl) {
            classroomManager.setServerUrl(serverUrlInput.value);
        }
        
        const code = await classroomManager.createClassroom();
        classroomCodeDisplay.textContent = code;
        classroomInfo.style.display = 'block';
        if (serverUrlInput) {
            serverUrlInput.value = classroomManager.serverUrl;
        }
        classroomManager.updatePlayersDisplay();
        
        // Copy code to clipboard
        navigator.clipboard.writeText(code).then(() => {
            alert(`Classroom created! Code: ${code}\n\nCode copied to clipboard - share it with others!\n\nServer: ${classroomManager.serverUrl}`);
        }).catch(() => {
            alert(`Classroom created! Code: ${code}\n\nShare this code with others to join!\n\nServer: ${classroomManager.serverUrl}`);
        });
    } catch (error) {
        alert('Error creating classroom: ' + error.message + '\n\nMake sure the server is running at: ' + classroomManager.serverUrl);
    }
}

async function joinClassroom() {
    const code = classroomCodeInput.value.trim().toUpperCase();
    
    if (!code || code.length !== 6) {
        alert('Please enter a valid 6-digit classroom code');
        return;
    }
    
    try {
        // Update server URL from top input if it was changed
        if (serverUrlInputTop && serverUrlInputTop.value.trim()) {
            classroomManager.setServerUrl(serverUrlInputTop.value.trim());
        }
        // Also check main input
        if (serverUrlInput && serverUrlInput.value !== classroomManager.serverUrl) {
            classroomManager.setServerUrl(serverUrlInput.value);
        }
        
        await classroomManager.joinClassroom(code);
        classroomCodeDisplay.textContent = code;
        classroomInfo.style.display = 'block';
        classroomCodeInput.value = '';
        // Sync both inputs
        if (serverUrlInput) {
            serverUrlInput.value = classroomManager.serverUrl;
        }
        if (serverUrlInputTop) {
            serverUrlInputTop.value = classroomManager.serverUrl;
        }
        classroomManager.updatePlayersDisplay();
        alert(`Successfully joined classroom ${code}!`);
    } catch (error) {
        alert('Error joining classroom: ' + error.message + '\n\nMake sure:\n1. The code is correct\n2. The server is running at: ' + classroomManager.serverUrl + '\n3. You tested the connection first');
    }
}

// Update Server URL
function updateServerUrl() {
    if (serverUrlInput) {
        const newUrl = serverUrlInput.value.trim();
        if (newUrl) {
            classroomManager.setServerUrl(newUrl);
            alert('Server URL updated to: ' + newUrl + '\n\nYou may need to rejoin the classroom.');
        }
    }
}

// Update Server URL from top input
function updateServerUrlFromTop() {
    if (serverUrlInputTop) {
        const newUrl = serverUrlInputTop.value.trim();
        if (newUrl) {
            classroomManager.setServerUrl(newUrl);
            if (serverUrlInput) {
                serverUrlInput.value = newUrl;
            }
        }
    }
}

// Test Server Connection (generic function that works with any input/status elements)
async function testServerConnection(inputElement, statusElement, statusTextElement, buttonElement) {
    if (!inputElement) return;
    
    const url = inputElement.value.trim();
    if (!url) {
        showConnectionStatus('Please enter a server URL', 'error', statusElement, statusTextElement);
        return;
    }
    
    // Update the server URL temporarily for testing
    const originalUrl = classroomManager.serverUrl;
    classroomManager.setServerUrl(url);
    
    // Show testing status
    showConnectionStatus('Testing connection...', 'testing', statusElement, statusTextElement);
    if (buttonElement) {
        buttonElement.disabled = true;
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Testing...';
        
        try {
            const isConnected = await classroomManager.testConnection();
            if (isConnected) {
                showConnectionStatus('✅ Connection successful!', 'success', statusElement, statusTextElement);
                // Update both inputs if successful
                if (serverUrlInput && inputElement !== serverUrlInput) {
                    serverUrlInput.value = url;
                }
                if (serverUrlInputTop && inputElement !== serverUrlInputTop) {
                    serverUrlInputTop.value = url;
                }
            } else {
                showConnectionStatus('❌ Connection failed - Server not responding', 'error', statusElement, statusTextElement);
                // Restore original URL if test failed
                classroomManager.setServerUrl(originalUrl);
            }
        } catch (error) {
            showConnectionStatus(`❌ Connection error: ${error.message}`, 'error', statusElement, statusTextElement);
            // Restore original URL if test failed
            classroomManager.setServerUrl(originalUrl);
        } finally {
            buttonElement.disabled = false;
            buttonElement.textContent = originalText;
        }
    }
}

// Show connection status (generic function)
function showConnectionStatus(message, type, statusElement, statusTextElement) {
    if (!statusElement || !statusTextElement) return;
    
    statusElement.style.display = 'block';
    statusTextElement.textContent = message;
    statusElement.className = `connection-status connection-${type}`;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (statusElement.className.includes('success')) {
                statusElement.style.display = 'none';
            }
        }, 5000);
    }
}

async function leaveClassroom() {
    await classroomManager.leaveClassroom();
    classroomInfo.style.display = 'none';
    classroomCodeDisplay.textContent = '';
    showScreen('start-screen');
    updateClassroomBadge();
}

function updateClassroomBadge() {
    if (classroomManager.classroomCode) {
        classroomBadge.style.display = 'inline-flex';
        currentClassroomCode.textContent = classroomManager.classroomCode;
        classroomPlayersCount.textContent = `(${classroomManager.players.length} players)`;
    } else {
        classroomBadge.style.display = 'none';
    }
}

async function showClassroomLeaderboard() {
    if (!classroomManager.classroomCode) {
        showLeaderboard();
        return;
    }
    
    const leaderboard = await classroomManager.getClassroomLeaderboard();
    leaderboardList.innerHTML = '';
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<p class="no-leaders">No scores yet in this classroom. Be the first!</p>';
    } else {
        leaderboard.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'leaderboard-entry';
            entryDiv.innerHTML = `
                <div class="rank">#${index + 1}</div>
                <div class="player-info">
                    <div class="player-address">${entry.playerName || entry.address}</div>
                    <div class="player-stats">
                        <span>Score: ${entry.score}</span>
                        <span>Hashes: ${entry.successfulHashes || 0}</span>
                    </div>
                </div>
            `;
            leaderboardList.appendChild(entryDiv);
        });
    }
    
    showScreen('leaderboard-screen');
}

// Initialize on load
init();

