# PowerShell script to check and help configure Solana CLI

Write-Host "Checking Solana installation..." -ForegroundColor Cyan

# Check common installation locations
$solanaPaths = @(
    "$env:USERPROFILE\.local\share\solana\install\active_release\bin\solana.exe",
    "$env:USERPROFILE\.local\share\solana\install\release\stable\bin\solana.exe",
    "$env:LOCALAPPDATA\solana\install\active_release\bin\solana.exe",
    "C:\Program Files\Solana\bin\solana.exe"
)

$found = $false
foreach ($path in $solanaPaths) {
    if (Test-Path $path) {
        Write-Host "Found Solana at: $path" -ForegroundColor Green
        $found = $true
        
        # Get the directory
        $solanaDir = Split-Path $path -Parent
        
        # Check if it's in PATH
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
        if ($currentPath -notlike "*$solanaDir*") {
            Write-Host "`nSolana is not in your PATH. Adding it now..." -ForegroundColor Yellow
            [Environment]::SetEnvironmentVariable("Path", "$currentPath;$solanaDir", "User")
            Write-Host "Added to PATH. Please restart your terminal/PowerShell for changes to take effect." -ForegroundColor Green
        } else {
            Write-Host "Solana is already in your PATH!" -ForegroundColor Green
        }
        break
    }
}

if (-not $found) {
    Write-Host "`nSolana CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "1. Open PowerShell as Administrator" -ForegroundColor Yellow
    Write-Host "2. Run: Invoke-WebRequest https://release.solana.com/stable/install -OutFile install-solana.ps1" -ForegroundColor Yellow
    Write-Host "3. Run: .\install-solana.ps1" -ForegroundColor Yellow
    Write-Host "`nOr use Git Bash: sh -c `"`$(curl -sSfL https://release.solana.com/stable/install)`"" -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

