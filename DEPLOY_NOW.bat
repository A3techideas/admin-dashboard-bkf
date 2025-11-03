@echo off
REM ============================================================
REM DEPLOY ADMIN BACKEND SCRIPT
REM ============================================================

echo.
echo ============================================================
echo   DEPLOYING ADMIN BACKEND TO AWS
echo ============================================================
echo.

cd "D:\Real_World_Project_Source_Code_VSCODE\Breakfree-Beta-v02\version19 copy\backend"

echo [STEP 1] Setting environment variables...
set ADMIN_JWT_SECRET=breakfree-admin-secret-key-2025-please-change-in-production
echo JWT_SECRET configured

echo.
echo [STEP 2] Deploying admin backend with Serverless Framework...
echo This will take 2-5 minutes...
echo.

serverless deploy --config admin-serverless.yml --stage dev

echo.
echo ============================================================
echo   DEPLOYMENT COMPLETE!
echo ============================================================
echo.

echo Next steps:
echo 1. Note the API endpoint URL from above
echo 2. Update admin dashboard .env file with the URL
echo 3. Create admin user
echo 4. Login to dashboard

pause

