# Alternative Solana installation script for Windows
# Use this if the standard installation method fails

Write-Host "Solana CLI Installation - Alternative Method" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Method 1: Try with TLS 1.2
Write-Host "Attempting Method 1: PowerShell with TLS 1.2..." -ForegroundColor Yellow
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri "https://release.solana.com/stable/install" -OutFile "install-solana.ps1" -UseBasicParsing
    Write-Host "Download successful!" -ForegroundColor Green
    Write-Host "Running installer..." -ForegroundColor Yellow
    & .\install-solana.ps1 stable
    exit 0
} catch {
    Write-Host "Method 1 failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Method 2: Try with curl.exe
Write-Host "`nAttempting Method 2: Using curl.exe..." -ForegroundColor Yellow
try {
    if (Get-Command curl.exe -ErrorAction SilentlyContinue) {
        curl.exe -o install-solana.ps1 https://release.solana.com/stable/install
        if (Test-Path install-solana.ps1) {
            Write-Host "Download successful!" -ForegroundColor Green
            Write-Host "Running installer..." -ForegroundColor Yellow
            & .\install-solana.ps1 stable
            exit 0
        }
    } else {
        Write-Host "curl.exe not found, skipping..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Method 2 failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Method 3: Manual download instructions
Write-Host "`nBoth automatic methods failed." -ForegroundColor Red
Write-Host "Please use Manual Download method:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open your browser and go to:" -ForegroundColor Cyan
Write-Host "   https://github.com/solana-labs/solana/releases" -ForegroundColor White
Write-Host ""
Write-Host "2. Download the latest:" -ForegroundColor Cyan
Write-Host "   solana-install-init-x86_64-pc-windows-msvc.exe" -ForegroundColor White
Write-Host ""
Write-Host "3. Run the downloaded installer" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. After installation, add Solana to PATH:" -ForegroundColor Cyan
Write-Host "   Usually: %USERPROFILE%\.local\share\solana\install\active_release\bin" -ForegroundColor White
Write-Host ""
Write-Host "5. Restart your terminal after adding to PATH" -ForegroundColor Cyan
Write-Host ""

# Check if Git Bash is available
if (Get-Command bash -ErrorAction SilentlyContinue) {
    Write-Host "Alternative: You can also use Git Bash:" -ForegroundColor Yellow
    Write-Host "  bash -c `"sh -c `$(curl -sSfL https://release.solana.com/stable/install)`"" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

