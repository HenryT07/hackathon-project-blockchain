# Study Commitment Staking System - Solana Blockchain App

A blockchain-verified accountability system that gamifies studying through token staking on Solana.

## Features

- **Token Staking**: Students stake tokens before study sessions
- **Session Verification**: Tracks study sessions via timers and keystroke detection
- **Reward System**: Complete sessions = tokens back + bonus rewards
- **Accountability**: Failed sessions result in token burn or contribution to communal pool
- **Phantom Wallet Integration**: Seamless connection to Phantom wallet extension

## Project Structure

```
├── program/          # Solana program (Rust) - optional
├── index.html        # Main webpage with all functionality
└── README.md
```

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, etc.)
- Phantom Wallet browser extension
- (Optional) Rust and Solana CLI tools for program development

## Setup

### 1. Install Phantom Wallet

1. Go to https://phantom.app/
2. Install the Phantom wallet extension for your browser
3. Create a new wallet or import an existing one
4. Switch to Devnet in Phantom settings (Settings > Developer Mode > Change Network)

### 2. Open the Webpage

Simply open `index.html` in your web browser, or serve it using a local web server:

**Option A - Direct file open:**
- Double-click `index.html` (works in most browsers)

**Option B - Using Python (if installed):**
```bash
python -m http.server 8000
```
Then open http://localhost:8000

**Option C - Using Node.js http-server:**
```bash
npx http-server
```

### 3. Connect Your Wallet

1. Click "Connect Phantom Wallet" button
2. Approve the connection in Phantom wallet popup
3. Start using the app!

## How It Works

1. **Connect Wallet**: Connect your Phantom wallet to the app
2. **Stake Tokens**: Stake a small amount of tokens before starting a study session
3. **Start Session**: Begin your study session with timer and activity tracking
4. **Complete Session**: If you complete the session (verified by timer/keystrokes), receive your tokens back plus a bonus
5. **Accountability**: If you fail to complete, tokens are burned or go to a communal pool

## Technology Stack

- **Blockchain**: Solana
- **Smart Contract**: Rust (Solana Program) - optional
- **Frontend**: Pure HTML/CSS/JavaScript
- **Wallet**: Phantom Wallet Extension
- **Web3**: @solana/web3.js (via CDN)

## Development

### Building the Solana Program (Optional)

If you want to deploy the Solana program:

```bash
cd program
cargo build-sbf
solana program deploy target/deploy/study_staking.so --url devnet
```

Then update the program ID in `index.html` to interact with your deployed program.

