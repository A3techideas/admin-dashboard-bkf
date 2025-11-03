# Simple deployment script
Set-Location "D:\Real_World_Project_Source_Code_VSCODE\Breakfree-Beta-v02\version19 copy\backend"
$env:ADMIN_JWT_SECRET = "breakfree-admin-secret-key-2025-please-change-in-production"
serverless deploy --config admin-serverless.yml --stage dev

