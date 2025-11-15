# ⛓️ Solana Trivia Game

A blockchain-based trivia game built on **Solana** where answering questions generates hash attempts. Successful hashes earn points for the leaderboard, while unsuccessful hashes contribute to a prize pool (lottery system).

## 🎮 Features

### Core Gameplay
- **Trivia Questions**: Multiple categories (Blockchain, Programming, Science, History)
- **Difficulty Levels**: Easy, Medium, Hard
- **Timer**: 30 seconds per question with time-based scoring
- **Score System**: Points based on speed and successful hash generation

### Solana Blockchain Features
- **Hash Mining**: Each answer attempt generates multiple hashes (SHA-256)
- **Hash Difficulty**: Hashes must start with 4 leading zeros to be "successful"
- **Prize Pool**: Unsuccessful hashes contribute 0.001 SOL to the prize pool
- **Leaderboard**: Top players ranked by score and successful hashes
- **Phantom Wallet Integration**: Connect your Phantom wallet to track your address
- **Solana Program**: On-chain smart contract for prize pool and leaderboard

### How It Works

1. **Answer Questions**: Select your answer to trivia questions
2. **Generate Hashes**: 
   - Correct answers: 3 hash attempts
   - Incorrect answers: 1 hash attempt
3. **Hash Success**: Hashes starting with 4+ zeros are "successful"
   - Successful hashes: Earn bonus points and count toward leaderboard
   - Unsuccessful hashes: Contribute to prize pool (lottery system)
4. **Compete**: Your score and successful hashes are tracked on the leaderboard
5. **Win Prizes**: Top player can claim the prize pool!

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge)
- **Phantom wallet** extension installed ([Download here](https://phantom.app/))
- Solana CLI tools (for deploying the program)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hackathon-project-blockchain
```

2. Open `index.html` in your web browser

3. Connect your Phantom wallet by clicking "Connect Phantom"

### Playing the Game

1. Select a category and difficulty level
2. Click "Start Game"
3. Answer questions within the time limit
4. Watch as hashes are generated for each answer
5. View your final score and hash mining results
6. Check the leaderboard to see top players

## 📁 Project Structure

```
hackathon-project-blockchain/
├── index.html                      # Main HTML file
├── styles.css                      # Styling
├── script.js                       # Main game logic
├── blockchain.js                   # Solana blockchain utilities
├── programs/
│   └── trivia-game/
│       └── src/
│           └── lib.rs             # Solana program (Anchor/Rust)
├── Anchor.toml                     # Anchor configuration
├── Cargo.toml                      # Rust dependencies
└── README.md                       # This file
```

## 🔧 Technical Details

### Hash Generation
- Uses Web Crypto API (SHA-256) for hash generation
- Hash input: `question-answer-nonce-timestamp-walletAddress`
- Difficulty: Hash must start with 4 leading zeros
- Multiple attempts per answer (more for correct answers)

### Prize Pool System
- Each unsuccessful hash contributes 0.001 SOL to the pool
- Prize pool is displayed in real-time
- Top player can claim the prize via Solana program

### Leaderboard
- Tracks top 100 players
- Sorted by score (descending)
- Shows wallet address, score, and successful hashes
- Stored in localStorage (can be upgraded to on-chain via Solana program)

### Solana Program

The Solana program (`lib.rs`) provides:
- On-chain prize pool management
- Leaderboard storage (up to 100 players)
- Hash attempt tracking
- Prize claiming functionality
- PDA (Program Derived Address) for game state

#### Deploying the Program

1. Install Anchor framework:
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

2. Build the program:
```bash
anchor build
```

3. Deploy to devnet:
```bash
anchor deploy --provider.cluster devnet
```

4. Update program ID in:
   - `programs/trivia-game/src/lib.rs` (declare_id!)
   - `Anchor.toml`
   - `blockchain.js` (setProgramId method)

## 🎯 Game Mechanics

### Scoring
- Base points: `max(10, timeLeft * 2)`
- Hash bonus: `successfulHashes * 5`
- Total: `basePoints + hashBonus`

### Hash Success Rate
- Difficulty: 4 leading zeros
- Probability: ~1 in 65,536 (16^4)
- More attempts = higher chance of success

## 💰 Solana Integration

### Wallet Connection
- Uses Phantom wallet (most popular Solana wallet)
- Displays wallet address and SOL balance
- Supports both devnet and mainnet

### Transactions
- Hash submissions can be sent to Solana program
- Score submissions update on-chain leaderboard
- Prize claims transfer SOL from program to winner

### Network
- Default: **devnet** (for testing)
- Change to **mainnet-beta** in `blockchain.js` for production

## 🔐 Security Notes

- Current implementation uses localStorage for leaderboard (demo)
- For production, integrate with deployed Solana program
- Hash generation is client-side (for demo purposes)
- Real blockchain integration requires program deployment
- Always verify program ID before connecting

## 🛠️ Future Enhancements

- [ ] Deploy Solana program to devnet/mainnet
- [ ] Integrate on-chain leaderboard
- [ ] Add SPL token rewards for top players
- [ ] Implement NFT rewards system
- [ ] Add multiplayer competitions
- [ ] Create question submission system
- [ ] Add difficulty adjustment based on hash success rate
- [ ] Implement cross-program invocations

## 📝 License

MIT License - Hackathon Project for Build Fest

## 👥 Contributors

Built for blockchain hackathon - Build Fest

## 🔗 Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Phantom Wallet](https://phantom.app/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

---

**Note**: This is a hackathon project. For production use, additional security audits and Solana program testing would be required.
