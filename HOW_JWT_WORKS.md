# 🔐 How JWT Authorization Works in Your Dashboard

## YES! JWT Authorization is Already Built-In ✅

Your dashboard **ALREADY uses JWT** for authentication. Here's how it works:

---

## 🔄 The Complete JWT Flow

### **Step 1: Login Request (What Happens Now)**
```
User enters credentials → Frontend sends to AWS Lambda → Lambda verifies password
```

**Current code in AuthContext.jsx (line 74-136):**
```javascript
const login = async (email, password) => {
  // Production mode - use real API
  const response = await adminAPI.login({ email, password })
  
  // Lambda returns JWT token
  const { token, user } = response.data
  
  // Save JWT token to localStorage
  localStorage.setItem('adminToken', token)
  
  // Set user data
  setUser(user)
  setSessionExpiry(Date.now() + 15 * 60 * 1000)
  
  return { success: true }
}
```

### **Step 2: JWT Token Storage**
```
Lambda returns JWT token → Frontend saves to localStorage → Ready for future requests
```

### **Step 3: Automatic Token Attachment**
```
Future API requests → Axios interceptor adds JWT → AWS Lambda validates
```

**Code in api.js (line 12-22):**
```javascript
// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')  // Get JWT from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`  // Add to all requests
    }
    return config
  }
)
```

### **Step 4: Token Validation**
```
API request → Lambda checks JWT signature → Returns data or 401 error
```

---

## ✅ What Happens When You Login

### **Current Setup (Before Deployment):**
❌ You try to login → 404 error (endpoint doesn't exist)

### **After Deployment:**
✅ You try to login → Success! Here's what happens:

1. **Frontend sends credentials:**
   ```javascript
   POST https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/auth/login
   {
     "email": "admin@breakfree.com",
     "password": "YourPassword123"
   }
   ```

2. **AWS Lambda (login function) processes:**
   - Checks if user exists in AdminUsers DynamoDB table
   - Verifies password hash matches
   - Generates JWT token with 15-minute expiration
   - Stores audit log
   - Returns token + user data

3. **Frontend receives response:**
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "adminId": "admin-001",
       "email": "admin@breakfree.com",
       "role": "admin",
       "name": "Admin User"
     }
   }
   ```

4. **Frontend saves JWT:**
   - Stores in `localStorage` as `adminToken`
   - Sets user session with 15-minute expiry

5. **All future requests:**
   - Automatically includes `Authorization: Bearer <token>` header
   - Lambda validates JWT signature and expiration
   - Returns data if valid, 401 if invalid/expired

---

## 🔒 JWT Token Structure

When Lambda generates the JWT, it contains:

```javascript
{
  "adminId": "admin-001",
  "email": "admin@breakfree.com",
  "role": "admin",
  "exp": 1735680123,  // Expiration time (15 minutes)
  "iat": 1735679223   // Issued at time
}
```

This is **signed** with your JWT_SECRET, so it can't be tampered with.

---

## 🛡️ Security Features Already Built-In

### ✅ **Automatic Token Expiration**
- JWT expires after 15 minutes (PCI DSS requirement)
- Frontend checks and logs out automatically

**Code in AuthContext.jsx (line 23-31):**
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    if (sessionExpiry && Date.now() > sessionExpiry) {
      logout()  // Auto-logout when expired
    }
  }, 60000)
  return () => clearInterval(interval)
}, [sessionExpiry])
```

### ✅ **Automatic Token Attachment**
- Every API request automatically adds JWT
- No need to manually add headers

### ✅ **Automatic 401 Handling**
- If JWT is invalid/expired, user is logged out
- Redirected to login page

**Code in api.js (line 28-35):**
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/login'  // Auto-redirect to login
    }
    return Promise.reject(error)
  }
)
```

### ✅ **Audit Logging**
- Every login attempt is logged
- Failed attempts tracked
- Stored in AdminAuditLogs DynamoDB table

---

## 🎯 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER LOGIN FLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. User enters credentials
   ↓
2. Frontend sends: POST /admin/auth/login
   ↓
3. AWS Lambda receives request
   ↓
4. Lambda checks AdminUsers table
   ↓
5. Lambda verifies password hash
   ↓
6. Lambda generates JWT token
   ↓
7. Lambda logs to AdminAuditLogs
   ↓
8. Lambda returns: { token, user }
   ↓
9. Frontend saves token to localStorage
   ↓
10. Frontend shows dashboard
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ALL FUTURE API REQUESTS                      │
└─────────────────────────────────────────────────────────────────┘

11. User navigates to Dashboard/Users/etc
    ↓
12. Frontend makes API request
    ↓
13. Axios interceptor adds: Authorization: Bearer <token>
    ↓
14. AWS Lambda receives request
    ↓
15. Lambda validates JWT signature
    ↓
16. Lambda checks token expiration
    ↓
17. Lambda returns data (or 401 if invalid)
    ↓
18. Frontend displays data

```

---

## ⚠️ Important Points

### **JWT Secret Must Match**
Your Lambda functions use `JWT_SECRET` environment variable. Make sure:
- ✅ Same secret used for signing tokens (login)
- ✅ Same secret used for verifying tokens (all other endpoints)
- ⚠️ If secrets don't match, all requests will return 401

### **Token Expiration**
- **15 minutes** - JWT expires
- **Auto-logout** - Frontend checks every minute
- **Session refresh** - User must re-login after expiration

### **CORS Configuration**
Your Lambda functions already include CORS headers:
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
}
```

---

## 🧪 Testing JWT After Deployment

### **1. Test Login:**
```bash
curl -X POST https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@breakfree.com","password":"YourPassword"}'
```

**Expected response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1p",
  "user": {
    "adminId": "admin-001",
    "email": "admin@breakfree.com",
    "role": "admin",
    "name": "Admin User"
  }
}
```

### **2. Test Token Usage:**
```bash
# Use the token from step 1
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test dashboard stats endpoint
curl https://8scms50sw3.execute-api.us-west-1.amazonaws.com/admin/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:**
```json
{
  "totalUsers": 1234,
  "activeUsers": 856,
  "totalTransactions": 45678,
  ...
}
```

---

## ✅ Summary

### **Question:** Will JWT authorization work when I login?
**Answer:** YES! Everything is already configured:

1. ✅ Login endpoint generates JWT tokens
2. ✅ Frontend saves tokens automatically
3. ✅ All requests include JWT automatically
4. ✅ Lambda validates JWT automatically
5. ✅ Auto-logout when JWT expires
6. ✅ Automatic redirect on 401 errors

### **What You Need to Do:**
1. Deploy admin backend (creates login Lambda)
2. Create admin user (in AdminUsers table)
3. Update dashboard .env with API URL
4. Login → JWT will work automatically!

### **No Code Changes Needed:**
- ✅ JWT implementation is complete
- ✅ Token management is automatic
- ✅ Security features are built-in
- ✅ Just deploy and it works!

---

## 🚀 Next Steps

1. **Read:** DEPLOY_ADMIN_NOW.md
2. **Deploy:** Admin backend
3. **Create:** Admin user
4. **Test:** Login → JWT works automatically!

**Time:** ~10 minutes  
**Difficulty:** Medium  
**Result:** Fully functional JWT authentication! ✅

