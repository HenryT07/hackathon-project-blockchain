# Fix for Solana installer that asks for release version

Write-Host "Solana Installation Fix" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""

# Check if installer script exists
if (Test-Path "install-solana.ps1") {
    Write-Host "Found install-solana.ps1, running with 'stable' release..." -ForegroundColor Yellow
    & .\install-solana.ps1 stable
    exit 0
}

# Check if exe installer exists
$exeInstaller = Get-ChildItem -Path . -Filter "solana-install-init-*.exe" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($exeInstaller) {
    Write-Host "Found installer: $($exeInstaller.Name)" -ForegroundColor Yellow
    Write-Host "Running with 'stable' release..." -ForegroundColor Yellow
    & $exeInstaller.FullName stable
    exit 0
}

Write-Host "No installer found. Please download it first:" -ForegroundColor Red
Write-Host ""
Write-Host "Option 1 - Download script:" -ForegroundColor Cyan
Write-Host "  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12" -ForegroundColor White
Write-Host "  Invoke-WebRequest https://release.solana.com/stable/install -OutFile install-solana.ps1" -ForegroundColor White
Write-Host "  .\install-solana.ps1 stable" -ForegroundColor White
Write-Host ""
Write-Host "Option 2 - Manual download:" -ForegroundColor Cyan
Write-Host "  1. Go to: https://github.com/solana-labs/solana/releases" -ForegroundColor White
Write-Host "  2. Download: solana-install-init-x86_64-pc-windows-msvc.exe" -ForegroundColor White
Write-Host "  3. Run: .\solana-install-init-x86_64-pc-windows-msvc.exe stable" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

