# Quick Setup Guide

## For Windows Users

### 1. Install Prerequisites

**Node.js:**
- Download from https://nodejs.org/
- Install Node.js 18 or higher

**Rust:**
- Download rustup-init.exe from https://rustup.rs/
- Run the installer and follow prompts

**Solana CLI:**
- Open PowerShell as Administrator
- Run: `cmd /c "curl https://release.solana.com/stable/install -o install-solana.ps1"`
- Then: `cmd /c "powershell -ExecutionPolicy Bypass -File install-solana.ps1"`
- Add Solana to PATH (the installer will show the path)

### 2. Setup Project

```powershell
# Navigate to project directory
cd D:\Git\hackathon-project-blockchain

# Install frontend dependencies
cd app
npm install

# Configure Solana (use devnet for testing)
solana config set --url devnet

# Get devnet SOL
solana airdrop 2
```

### 3. Build Solana Program (Optional - for full integration)

```powershell
cd ..\program
cargo build-sbf
```

### 4. Run the App

```powershell
cd ..\app
npm run dev
```

Open http://localhost:3000 in your browser

### 5. Connect Phantom Wallet

1. Install Phantom extension from https://phantom.app/
2. Create/import wallet
3. Switch to Devnet in Phantom settings (Settings > Developer Mode > Change Network)
4. Get devnet SOL from faucet if needed
5. Connect wallet in the app

## Troubleshooting

**"solana: command not found"**
- Add Solana to your PATH
- Restart terminal/PowerShell

**"cargo: command not found"**
- Rust may not be in PATH
- Restart terminal after Rust installation

**Wallet connection issues**
- Make sure Phantom is set to Devnet
- Check browser console for errors
- Try disconnecting and reconnecting wallet

**Transaction failures**
- Ensure you have enough SOL in your wallet
- Check network (should be Devnet)
- Verify RPC endpoint is accessible

