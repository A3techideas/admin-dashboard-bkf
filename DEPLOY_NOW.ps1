# DEPLOY ADMIN BACKEND SCRIPT (PowerShell)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  DEPLOYING ADMIN BACKEND TO AWS" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Change to backend directory
Set-Location "D:\Real_World_Project_Source_Code_VSCODE\Breakfree-Beta-v02\version19 copy\backend"

Write-Host "[STEP 1] Setting environment variables..." -ForegroundColor Yellow
$env:ADMIN_JWT_SECRET = "breakfree-admin-secret-key-2025-please-change-in-production"
Write-Host "JWT_SECRET configured" -ForegroundColor Green

Write-Host ""
Write-Host "[STEP 2] Deploying admin backend with Serverless Framework..." -ForegroundColor Yellow
Write-Host "This will take 2-5 minutes..." -ForegroundColor Gray
Write-Host ""

# Deploy
serverless deploy --config admin-serverless.yml --stage dev

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Note the API endpoint URL from above" -ForegroundColor White
Write-Host "2. Update admin dashboard .env file with the URL" -ForegroundColor White
Write-Host "3. Create admin user" -ForegroundColor White
Write-Host "4. Login to dashboard" -ForegroundColor White

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

