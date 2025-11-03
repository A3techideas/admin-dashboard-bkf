# Quick Start - Connect to Real Data

## The Problem
Your dashboard shows fake data because no `.env` file exists.

## The Solution (2 Steps)

### Step 1: Create `.env` File

Create a file named `.env` in the project root with this content:

```env
VITE_API_BASE_URL=https://your-actual-api-gateway-url.execute-api.us-west-1.amazonaws.com
```

**Where to get the URL:**
- AWS Console → API Gateway → Your API → Stages → Copy the URL
- Or from your backend deployment logs

### Step 2: Restart Server

```bash
# Stop the current server (Ctrl+C if running)
# Then start again:
npm run dev
```

## ✅ Done!

Now your dashboard will connect to real AWS backend and show real data.

---

## How to Verify It's Working

1. Open browser console (F12)
2. Login to dashboard
3. Look for messages:
   - ❌ "🎭 Demo mode" = Still using fake data
   - ✅ No demo messages = Using real data!

---

## If It's Still Not Working

### Check 1: `.env` file exists in project root?
```bash
# In project root directory
ls .env
# Should show: .env
```

### Check 2: Correct URL format?
```env
# ✅ Correct
VITE_API_BASE_URL=https://8scms50sw3.execute-api.us-west-1.amazonaws.com

# ❌ Wrong
VITE_API_BASE_URL=http://localhost:3001
VITE_API_BASE_URL=https://api.example.com
VITE_API_BASE_URL=localhost
```

### Check 3: Restarted dev server?
- Must restart after creating/modifying `.env`
- Stop with Ctrl+C, then run `npm run dev` again

### Check 4: Backend endpoints exist?
Test with curl:
```bash
curl https://your-api-url/admin/dashboard/stats
```
Should return JSON data (not 404 error)

---

## Still Need Help?

See detailed guides:
- **IMPLEMENTATION_SUMMARY.md** - Complete explanation
- **INTEGRATION_GUIDE.md** - Full technical guide
- **README.md** - Project documentation

---

## Example `.env` File

```env
# AWS Configuration
VITE_AWS_REGION=us-west-1
VITE_AWS_COGNITO_USER_POOL_ID=us-west-1_DSzdhSGBI
VITE_AWS_COGNITO_USER_POOL_CLIENT_ID=7vfnnrecbdandieqk13mep6mst

# This is the most important one - your API Gateway URL
VITE_API_BASE_URL=https://8scms50sw3.execute-api.us-west-1.amazonaws.com

# Admin configuration
VITE_ADMIN_ROLE=admin
```

**Copy this, paste into `.env` file, and update `VITE_API_BASE_URL` with your actual API Gateway URL.**

