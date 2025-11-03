# 🚀 DEPLOY ADMIN BACKEND NOW

## The Problem
Your API Gateway exists but admin Lambda functions are NOT deployed yet, so all admin endpoints return 404.

## The Solution
Deploy the admin backend using Serverless Framework.

## Step-by-Step Deployment

### Step 1: Open Terminal in Your Backend Directory

Navigate to your backend directory:
```bash
cd "D:\Real_World_Project_Source_Code_VSCODE\Breakfree-Beta-v02\version19 copy\backend"
```

### Step 2: Set Environment Variable

Set the JWT secret (required for authentication):
```bash
# Windows PowerShell
$env:ADMIN_JWT_SECRET="breakfree-admin-secret-key-2025-please-change-in-production"

# Windows CMD
set ADMIN_JWT_SECRET=breakfree-admin-secret-key-2025-please-change-in-production

# Linux/Mac
export ADMIN_JWT_SECRET="breakfree-admin-secret-key-2025-please-change-in-production"
```

### Step 3: Deploy Admin Backend

```bash
serverless deploy --config admin-serverless.yml --stage dev
```

**This will:**
- Deploy all admin Lambda functions
- Create DynamoDB tables (AdminUsers, AdminAuditLogs)
- Configure API Gateway routes
- Set up IAM roles and permissions
- Enable CloudWatch logging

**Expected output:**
```
Serverless: Packaging service...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
Serverless: Stack create finished...
Serverless: Publishing service to the Serverless Dashboard...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
Serverless: Stack update finished...

Service Information
service: breakfree-admin-backend
stage: dev
region: us-west-1
stack: breakfree-admin-backend-dev
functions:
  adminLogin: breakfree-admin-backend-dev-adminLogin
  adminVerify: breakfree-admin-backend-dev-adminVerify
  adminLogout: breakfree-admin-backend-dev-adminLogout
  getDashboardStats: breakfree-admin-backend-dev-getDashboardStats
  getUserAnalytics: breakfree-admin-backend-dev-getUserAnalytics
  getTransactionAnalytics: breakfree-admin-backend-dev-getTransactionAnalytics
  getUsers: breakfree-admin-backend-dev-getUsers
  getUserById: breakfree-admin-backend-dev-getUserById
  getTransactions: breakfree-admin-backend-dev-getTransactions
  getTransactionById: breakfree-admin-backend-dev-getTransactionById
  getTickets: breakfree-admin-backend-dev-getTickets
  updateTicket: breakfree-admin-backend-dev-updateTicket
  generateReport: breakfree-admin-backend-dev-generateReport
  getReports: breakfree-admin-backend-dev-getReports
  getAuditLogs: breakfree-admin-backend-dev-getAuditLogs

endpoints:
  POST - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/auth/login
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/auth/verify
  POST - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/auth/logout
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/dashboard/stats
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/analytics/users
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/analytics/transactions
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/users
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/users/{userId}
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/transactions
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/transactions/{transactionId}
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/tickets
  PUT - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/tickets/{ticketId}
  POST - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/reports/generate
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/reports
  GET - https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/audit-logs

Stack Outputs:
  ServiceEndpoint: https://8scms50sw3.execute-api.us-west-1.amazonaws.com
  ServerlessDeploymentBucketName: breakfree-user

```

### Step 4: Save the API Endpoint URL

Copy the `ServiceEndpoint` URL from the output. This is your API base URL.

Example: `https://8scms50sw3.execute-api.us-west-1.amazonaws.com`

### Step 5: Create First Admin User

After deployment, create an admin user:

```bash
# Navigate to backend/scripts directory
cd scripts

# Run the create admin user script
node create-admin-user.js admin@breakfree.com YourSecurePassword123! "Admin User"
```

**Example:**
```bash
node create-admin-user.js admin@breakfree.com AdminPass2025! "Super Admin"
```

**Output:**
```
✅ Admin user created successfully!
-----------------------------------
Email: admin@breakfree.com
Admin ID: admin-1728123456789
Name: Admin User
Role: admin
-----------------------------------
⚠️  IMPORTANT: Save these credentials securely!
Password: YourSecurePassword123!
-----------------------------------
```

### Step 6: Update Dashboard .env File

Go to your admin dashboard directory and update `.env`:

```bash
cd "D:\Real_World_Project_Source_Code_VSCODE\admin-Beta\admin-dashboard-bkf"
```

Edit `.env` file:
```env
VITE_AWS_REGION=us-west-1
VITE_AWS_COGNITO_USER_POOL_ID=us-west-1_DSzdhSGBI
VITE_AWS_COGNITO_USER_POOL_CLIENT_ID=7vfnnrecbdandieqk13mep6mst
VITE_API_BASE_URL=https://8scms50sw3.execute-api.us-west-1.amazonaws.com
VITE_ADMIN_ROLE=admin
```

**Important:** Use the API endpoint URL from Step 4 deployment output!

### Step 7: Restart Dashboard Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 8: Test Login

1. Navigate to `http://localhost:5173`
2. Enter your admin credentials (from Step 5)
3. Click "Sign In"
4. ✅ Should successfully login!

## Troubleshooting

### Error: ADMIN_JWT_SECRET not set

**Solution:** Make sure you set the environment variable before deploying:
```bash
$env:ADMIN_JWT_SECRET="your-secret-here"
```

### Error: Missing dependencies

**Solution:** Install dependencies:
```bash
npm install
```

### Error: Deployment failed

**Solution:** Check:
- AWS credentials configured
- Sufficient IAM permissions
- Internet connection stable
- No conflicting resources

### Error: User creation failed

**Solution:** Check:
- Deployment completed successfully
- AdminUsers table exists
- Correct AWS credentials

### Error: Login still fails

**Solution:**
1. Verify `.env` has correct API URL
2. Restart dev server after changing `.env`
3. Check browser console for API errors
4. Test endpoint manually:
```bash
curl -X POST https://your-api-url/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@breakfree.com","password":"YourPassword"}'
```

## What Gets Deployed

### Lambda Functions (15 total):
- **Authentication:** adminLogin, adminVerify, adminLogout
- **Dashboard:** getDashboardStats, getUserAnalytics, getTransactionAnalytics
- **Users:** getUsers, getUserById
- **Transactions:** getTransactions, getTransactionById
- **Tickets:** getTickets, updateTicket
- **Reports:** generateReport, getReports
- **Audit:** getAuditLogs

### DynamoDB Tables:
- **AdminUsers** - Stores admin user accounts
- **AdminAuditLogs** - Stores audit trail (90-day retention)

### API Gateway Routes:
- All admin endpoints configured with CORS
- Authentication middleware
- CloudWatch logging enabled

## Security Notes

⚠️ **Important:**
- Change JWT_SECRET in production
- Use strong passwords (min 12 characters)
- Enable HTTPS in production
- Configure IP whitelist for production
- Regularly rotate JWT secrets
- Monitor CloudWatch logs
- Review audit logs regularly

## Next Steps

After successful deployment:

1. ✅ Login to dashboard
2. ✅ Verify data loads correctly
3. ✅ Test all features
4. ✅ Review CloudWatch logs
5. ✅ Set up monitoring alerts
6. ✅ Configure production settings

## Support

If you encounter issues:
1. Check CloudWatch logs for Lambda errors
2. Verify DynamoDB tables exist
3. Test API endpoints with curl/Postman
4. Check browser console for errors
5. Review deployment logs

---

**Estimated Deployment Time:** 2-5 minutes  
**Estimated Setup Time:** 10-15 minutes total  
**Difficulty:** Medium (requires AWS knowledge)

