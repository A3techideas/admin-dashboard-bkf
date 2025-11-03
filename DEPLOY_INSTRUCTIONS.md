# 🚀 Step-by-Step Deployment Instructions

## ⚠️ Important: AWS Terminal Required

You need to run these commands in a terminal where AWS credentials are configured.

---

## Step-by-Step:

### **Option 1: Use PowerShell (Recommended)**

1. **Open PowerShell** (as Administrator if needed)

2. **Navigate to backend directory:**
```powershell
cd "D:\Real_World_Project_Source_Code_VSCODE\Breakfree-Beta-v02\version19 copy\backend"
```

3. **Set environment variable:**
```powershell
$env:ADMIN_JWT_SECRET="breakfree-admin-secret-key-2025-please-change-in-production"
```

4. **Deploy:**
```powershell
serverless deploy --config admin-serverless.yml --stage dev
```

---

### **Option 2: Use CMD**

1. **Open Command Prompt**

2. **Navigate to backend directory:**
```cmd
cd "D:\Real_World_Project_Source_Code_VSCODE\Breakfree-Beta-v02\version19 copy\backend"
```

3. **Set environment variable:**
```cmd
set ADMIN_JWT_SECRET=breakfree-admin-secret-key-2025-please-change-in-production
```

4. **Deploy:**
```cmd
serverless deploy --config admin-serverless.yml --stage dev
```

---

## What Will Happen:

1. Serverless will create CloudFormation stack
2. Deploy 15 Lambda functions
3. Create 2 DynamoDB tables (AdminUsers, AdminAuditLogs)
4. Configure API Gateway routes
5. Return API endpoint URL

**Expected time:** 2-5 minutes

---

## After Deployment:

1. **Note the API endpoint URL** from the output
2. **Create admin user:**
   ```bash
   cd scripts
   node create-admin-user.js admin@breakfree.com YourSecurePassword123! "Admin User"
   ```
3. **Update dashboard .env** with API URL
4. **Login!** ✅

---

## If Deployment Fails:

- Check AWS credentials: `aws sts get-caller-identity`
- Check IAM permissions
- Read CloudWatch logs
- Try `--debug` flag for verbose output

