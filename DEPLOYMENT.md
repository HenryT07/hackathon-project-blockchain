# Deployment Guide

## Prerequisites

1. **Install Solana CLI**
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   solana --version
   ```

2. **Install Rust** (if not already installed)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

3. **Install Node.js 18+**
   ```bash
   node --version
   npm --version
   ```

## Setup Steps

### 1. Configure Solana CLI

```bash
# For development, use devnet
solana config set --url devnet

# Create a new keypair (or use existing)
solana-keygen new

# Get some devnet SOL for testing
solana airdrop 2
```

### 2. Build the Solana Program

```bash
cd program
cargo build-sbf
```

### 3. Deploy the Program (Devnet)

```bash
# Deploy to devnet
solana program deploy target/deploy/study_staking.so --url devnet

# Note the program ID that gets returned - you'll need this for the frontend
```

### 4. Update Frontend with Program ID

After deploying, update the program ID in the frontend code (if you create a config file).

### 5. Install Frontend Dependencies

```bash
cd ../app
npm install
```

### 6. Run the Frontend

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Testing with Phantom Wallet

1. Install Phantom wallet extension in your browser
2. Create a new wallet or import existing
3. Switch to Devnet in Phantom settings
4. Get devnet SOL: Use the Solana CLI airdrop or a devnet faucet
5. Connect wallet in the app and start testing!

## Production Deployment

For production:

1. Build the program for mainnet
2. Deploy to mainnet-beta
3. Update frontend to use mainnet RPC endpoint
4. Deploy frontend to Vercel, Netlify, or your preferred hosting

## Important Notes

- The current implementation uses placeholder transactions for staking
- To fully integrate with the Solana program, you'll need to:
  - Create proper instruction calls to your deployed program
  - Set up proper account management (PDA accounts)
  - Implement token transfers using SPL Token program
  - Add proper error handling and transaction confirmation

## Next Steps for Full Integration

1. Create a client SDK for interacting with the program
2. Implement proper PDA (Program Derived Address) account creation
3. Add SPL Token support for token staking
4. Implement proper session verification on-chain
5. Add communal pool account management

