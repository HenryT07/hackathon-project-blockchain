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
├── program/          # Solana program (Rust)
├── app/              # Frontend React application
└── README.md
```

## Prerequisites

- Node.js 18+ and npm/yarn
- Rust and Solana CLI tools
- Phantom Wallet browser extension

## Setup

### 1. Install Solana CLI

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd app
npm install

# Build Solana program
cd ../program
cargo build-sbf
```

### 3. Run Development Server

```bash
cd app
npm run dev
```

## How It Works

1. **Connect Wallet**: Connect your Phantom wallet to the app
2. **Stake Tokens**: Stake a small amount of tokens before starting a study session
3. **Start Session**: Begin your study session with timer and activity tracking
4. **Complete Session**: If you complete the session (verified by timer/keystrokes), receive your tokens back plus a bonus
5. **Accountability**: If you fail to complete, tokens are burned or go to a communal pool

## Technology Stack

- **Blockchain**: Solana
- **Smart Contract**: Rust (Solana Program)
- **Frontend**: React + TypeScript
- **Wallet**: Phantom Wallet Extension
- **Web3**: @solana/web3.js, @solana/wallet-adapter-react

