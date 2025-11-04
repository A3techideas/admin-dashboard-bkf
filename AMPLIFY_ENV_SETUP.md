# 🌐 AWS Amplify Environment Variables Setup

Your dashboard is deployed to AWS Amplify but running in DEMO MODE!

## ❌ The Problem:
- Dashboard is checking for demo credentials
- Not connecting to your real AWS API backend
- Missing environment variables in Amplify

---

## ✅ Solution: Add Environment Variables

### Step 1: Go to AWS Amplify Console
1. Log in to [AWS Console](https://console.aws.amazon.com)
2. Go to **AWS Amplify** service
3. Find your app: `main.dag59kmyx04lg.amplifyapp.com`

### Step 2: Add Environment Variables
1. Click on your app
2. Go to **App settings** → **Environment variables**
3. Click **Manage variables**

### Step 3: Add These Variables

Click **Add variable** for each one:

| Variable Name | Value |
|--------------|-------|
| `VITE_AWS_REGION` | `us-west-1` |
| `VITE_AWS_COGNITO_USER_POOL_ID` | `us-west-1_DSzdhSGBI` |
| `VITE_AWS_COGNITO_USER_POOL_CLIENT_ID` | `7vfnnrecbdandieqk13mep6mst` |
| **`VITE_API_BASE_URL`** | **`https://hglmst0fsi.execute-api.us-west-1.amazonaws.com`** |
| `VITE_ADMIN_ROLE` | `admin` |

### Step 4: Save and Redeploy
1. Click **Save** after adding all variables
2. Amplify will automatically trigger a new deployment
3. Wait for deployment to complete (usually 2-5 minutes)

---

## 🔑 After Deployment

Once deployment completes:

1. Go to: `https://main.dag59kmyx04lg.amplifyapp.com/login`
2. Login with:
   - **Email:** `admin@breakfree.com`
   - **Password:** `AdminPass2025!`
3. You should now see **REAL DATA** from your iOS app!

---

## 📸 Visual Guide

### Where to Find Environment Variables:

```
AWS Console
└── AWS Amplify
    └── Your App (main.dag59kmyx04lg...)
        └── App settings (left sidebar)
            └── Environment variables
                └── Manage variables
                    └── Add variable
```

### Add Variable Dialog:
```
Name:  VITE_API_BASE_URL
Value: https://hglmst0fsi.execute-api.us-west-1.amazonaws.com
```

---

## ⚠️ Important Notes

1. **Variable Names** must EXACTLY match: `VITE_API_BASE_URL` (case-sensitive!)
2. **Redeploy Required:** Changes only take effect after redeployment
3. **No Spaces:** Make sure there are no extra spaces in values
4. **Check Deployment:** Monitor the Amplify deployment logs for errors

---

## ✅ Verification

After redeploy, check:
1. No more "🎭 Demo mode" in browser console
2. Login with admin@breakfree.com works
3. Dashboard shows real statistics
4. Users page shows your 16 real users
5. Transactions show your 54 real transactions

---

## 🆘 Troubleshooting

### Still in demo mode?
- Double-check variable names are correct
- Make sure deployment completed successfully
- Clear browser cache (Ctrl+F5)
- Check deployment logs in Amplify

### Can't find environment variables?
- Make sure you're in App settings (not Build settings)
- You need proper permissions in AWS Amplify

### Deployment failing?
- Check Amplify build logs
- Verify all variables are added correctly
- Make sure there are no special characters


