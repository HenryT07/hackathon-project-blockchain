# Comprehensive Solana installation script for Windows
# Tries multiple methods to handle connection issues

Write-Host "Solana CLI Installation for Windows" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$success = $false

# Method 1: PowerShell with TLS 1.2 and retry logic
Write-Host "Method 1: PowerShell with TLS 1.2..." -ForegroundColor Yellow
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls11 -bor [Net.SecurityProtocolType]::Tls
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri "https://release.solana.com/stable/install" -OutFile "install-solana.ps1" -UseBasicParsing -TimeoutSec 30
    if (Test-Path "install-solana.ps1") {
        Write-Host "Download successful!" -ForegroundColor Green
        Write-Host "Running installer with 'stable' release..." -ForegroundColor Yellow
        & .\install-solana.ps1 stable
        $success = $true
    }
} catch {
    Write-Host "Method 1 failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Method 2: Using curl.exe
if (-not $success) {
    Write-Host "`nMethod 2: Using curl.exe..." -ForegroundColor Yellow
    try {
        if (Get-Command curl.exe -ErrorAction SilentlyContinue) {
            curl.exe -L -o install-solana.ps1 https://release.solana.com/stable/install
            if (Test-Path "install-solana.ps1") {
                Write-Host "Download successful!" -ForegroundColor Green
                Write-Host "Running installer with 'stable' release..." -ForegroundColor Yellow
                & .\install-solana.ps1 stable
                $success = $true
            }
        } else {
            Write-Host "curl.exe not found, skipping..." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Method 2 failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Method 3: Using .NET WebClient
if (-not $success) {
    Write-Host "`nMethod 3: Using .NET WebClient..." -ForegroundColor Yellow
    try {
        $client = New-Object System.Net.WebClient
        $client.Headers.Add("User-Agent", "PowerShell")
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $client.DownloadFile("https://release.solana.com/stable/install", "install-solana.ps1")
        if (Test-Path "install-solana.ps1") {
            Write-Host "Download successful!" -ForegroundColor Green
            Write-Host "Running installer with 'stable' release..." -ForegroundColor Yellow
            & .\install-solana.ps1 stable
            $success = $true
        }
    } catch {
        Write-Host "Method 3 failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($success) {
    Write-Host "`n✅ Solana installation completed!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Close and reopen your terminal" -ForegroundColor White
    Write-Host "2. Run: solana --version" -ForegroundColor White
    Write-Host "3. Run: solana config set --url devnet" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "`n❌ All automatic methods failed." -ForegroundColor Red
    Write-Host "`nPlease use Manual Download:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Open your browser and go to:" -ForegroundColor Cyan
    Write-Host "   https://github.com/solana-labs/solana/releases" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Download the latest:" -ForegroundColor Cyan
    Write-Host "   solana-install-init-x86_64-pc-windows-msvc.exe" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Run the installer with:" -ForegroundColor Cyan
    Write-Host "   .\solana-install-init-x86_64-pc-windows-msvc.exe stable" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Add to PATH: %USERPROFILE%\.local\share\solana\install\active_release\bin" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OR - Since you have Solana in WSL, you can just use that:" -ForegroundColor Yellow
    Write-Host "   wsl" -ForegroundColor White
    Write-Host "   solana config set --url devnet" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

