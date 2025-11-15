# Setup Guide for WSL Users

If you have Solana installed in WSL but need to use it from Windows, here are your options:

## Option 1: Use WSL for Solana Commands (Recommended)

Since Solana is already installed in WSL, use WSL terminal for all Solana operations:

```bash
# Open WSL terminal
wsl

# Verify Solana installation
solana --version

# Configure for devnet
solana config set --url devnet

# Get devnet SOL
solana airdrop 2

# Check your keypair
solana address
```

**For building the Solana program:**
```bash
# In WSL
cd /mnt/d/Git/hackathon-project-blockchain/program
cargo build-sbf
```

## Option 2: Install Solana on Windows Separately

You can have Solana installed in both WSL and Windows:

1. Follow **Method 1-3** in SETUP.md to install Solana on Windows
2. This way you can use Solana from PowerShell when needed
3. WSL and Windows installations won't conflict

## Option 3: Run Everything in WSL

Run your entire development environment in WSL:

```bash
# In WSL terminal
cd /mnt/d/Git/hackathon-project-blockchain

# Install Node.js in WSL (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install frontend dependencies
cd app
npm install

# Run the app
npm run dev
```

Then access the app from Windows browser at `http://localhost:3000`

## Option 4: Use WSL for Solana, Windows for Frontend

**Hybrid approach:**

1. **Use WSL for Solana operations:**
   ```bash
   wsl
   solana config set --url devnet
   solana program deploy ...
   ```

2. **Use Windows PowerShell for frontend:**
   ```powershell
   cd D:\Git\hackathon-project-blockchain\app
   npm install
   npm run dev
   ```

3. **Connect Phantom wallet from Windows browser** (works fine)

## Recommended Workflow

For this project, I recommend **Option 4** (Hybrid):
- Use WSL for Solana CLI commands (program building, deployment)
- Use Windows for frontend development (Next.js, npm)
- Phantom wallet runs in Windows browser and connects fine

## Quick Commands Reference

**In WSL:**
```bash
solana --version                    # Check version
solana config set --url devnet      # Set to devnet
solana airdrop 2                    # Get devnet SOL
solana address                      # Show your address
solana balance                      # Check balance
```

**In Windows PowerShell:**
```powershell
cd app
npm install                         # Install dependencies
npm run dev                         # Run frontend
```

## Troubleshooting

**"solana: command not found" in PowerShell:**
- This is expected if Solana is only in WSL
- Use `wsl` to enter WSL terminal, then run Solana commands there
- Or install Solana on Windows separately

**Need to access WSL files from Windows:**
- WSL files are at: `\\wsl$\Ubuntu\home\yourusername\` (or your WSL distro name)
- Or use `/mnt/c/` in WSL to access Windows files

**Port forwarding:**
- Ports opened in WSL are automatically forwarded to Windows
- `localhost:3000` in WSL = `localhost:3000` in Windows browser

