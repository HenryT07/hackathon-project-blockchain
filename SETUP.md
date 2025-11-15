# Quick Setup Guide

> **Note:** If you have Solana installed in WSL, see [SETUP-WSL.md](./SETUP-WSL.md) for specific instructions.

## For Windows Users

### 1. Install Prerequisites

**Node.js:**
- Download from https://nodejs.org/
- Install Node.js 18 or higher

**Rust:**
- Download rustup-init.exe from https://rustup.rs/
- Run the installer and follow prompts

**Solana CLI (Choose one method):**

**Method 1 - PowerShell (Recommended):**

**If you get connection errors, try these alternatives:**

**Option A - With TLS settings (try this first):**
```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls11 -bor [Net.SecurityProtocolType]::Tls
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri "https://release.solana.com/stable/install" -OutFile "install-solana.ps1" -UseBasicParsing -TimeoutSec 30
.\install-solana.ps1 stable
```

**Option A2 - Use the comprehensive installer script:**
```powershell
cd app
.\install-solana-windows.ps1
```
This script tries multiple methods automatically.

**Option B - Using curl.exe (Windows 10+):**
```powershell
curl.exe -o install-solana.ps1 https://release.solana.com/stable/install
.\install-solana.ps1
```

**Option C - Standard method:**
- Open PowerShell as Administrator
- Run: `Invoke-WebRequest https://release.solana.com/stable/install -OutFile install-solana.ps1`
- Then: `.\install-solana.ps1`
- If you get an execution policy error, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Then run `.\install-solana.ps1` again
- Add Solana to PATH (the installer will show the path, usually `%USERPROFILE%\.local\share\solana\install\active_release\bin`)

**Method 2 - Git Bash (if you have Git installed):**
- Open Git Bash
- Run: `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`
- Add Solana to PATH (the installer will show the path)

**Method 3 - Manual Download (Best if network issues persist):**
1. Go to: https://github.com/solana-labs/solana/releases
2. Download the latest `solana-install-init-x86_64-pc-windows-msvc.exe`
3. Run the installer with a release version:
   ```powershell
   .\solana-install-init-x86_64-pc-windows-msvc.exe stable
   ```
   Or to install a specific version:
   ```powershell
   .\solana-install-init-x86_64-pc-windows-msvc.exe v1.18.0
   ```
4. The installer will show you the installation path
5. Add the installation directory to your PATH environment variable:
   - Usually: `%USERPROFILE%\.local\share\solana\install\active_release\bin`
   - Or check the path shown by the installer

**Method 4 - Using WSL (Windows Subsystem for Linux):**
- If you have WSL installed, you can use the Linux installation method
- In WSL terminal: `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`
- **Note:** Solana installed in WSL is NOT accessible from Windows PowerShell
- You'll need to either:
  - Use WSL terminal for Solana commands, OR
  - Install Solana separately on Windows (see Method 1-3)

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

**"Please specify the release to install" error**
- Run the installer with `stable` as argument: `.\install-solana.ps1 stable`
- Or for exe installer: `.\solana-install-init-x86_64-pc-windows-msvc.exe stable`
- Or use the fix script: `cd app` then `.\install-solana-fix.ps1`

**Connection errors or "underlying connection was closed"**
- Try the alternative installation script: `cd app` then `.\install-solana-alternative.ps1`
- Or use Method 1 Option A (with TLS settings)
- Or use Method 1 Option B (using curl.exe)
- Or use Method 3 (Manual Download from GitHub) - Most reliable if network issues persist

**"curl: command not found" or curl errors**
- Use Method 1 (PowerShell with Invoke-WebRequest) instead
- Or use Method 2 (Git Bash) if you have Git installed
- Or use Method 3 (Manual Download)

**PowerShell execution policy errors**
- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Then try the installation again

**"solana: command not found" or "solana is not recognized"**

**If Solana is installed in WSL:**
- WSL and Windows are separate environments - Solana in WSL won't work in PowerShell
- **Option 1:** Use WSL terminal for Solana commands:
  ```bash
  wsl
  solana --version
  solana config set --url devnet
  ```
- **Option 2:** Install Solana on Windows separately (see Method 1-3 above)
- **Option 3:** Run your entire development environment in WSL

**If Solana should be on Windows:**

**Quick Fix - Run this PowerShell script:**
```powershell
cd app
.\check-solana-install.ps1
```

**Manual Fix:**
1. Check if Solana is installed:
   - Look in: `%USERPROFILE%\.local\share\solana\install\active_release\bin\`
   - Or: `%USERPROFILE%\.local\share\solana\install\release\stable\bin\`

2. If found, add to PATH:
   - Press `Win + X` and select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "User variables", find "Path" and click "Edit"
   - Click "New" and add: `%USERPROFILE%\.local\share\solana\install\active_release\bin`
   - Click OK on all dialogs
   - **Close and reopen your terminal/PowerShell**

3. If not found, install Solana:
   - Open PowerShell as Administrator
   - Run: `Invoke-WebRequest https://release.solana.com/stable/install -OutFile install-solana.ps1`
   - Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` (if needed)
   - Run: `.\install-solana.ps1`
   - Restart terminal after installation

**"cargo: command not found"**
- Rust may not be in PATH
- Restart terminal after Rust installation
- Or add Rust to PATH manually: `%USERPROFILE%\.cargo\bin`

**Wallet connection issues**
- Make sure Phantom is set to Devnet
- Check browser console for errors
- Try disconnecting and reconnecting wallet

**Transaction failures**
- Ensure you have enough SOL in your wallet
- Check network (should be Devnet)
- Verify RPC endpoint is accessible

