# Real-Time Analytics Dashboard Integration Guide

## Overview
This guide explains how to connect your admin dashboard to your iOS app's AWS backend and replace fake data with real-time data.

## Current State
Your admin dashboard is currently showing **fake/demo data** because:
- No `.env` file exists with production API configuration
- The app detects localhost/missing API URL and shows mock data instead
- This is intentional for development/demo purposes

## What You Need to Provide

### 1. AWS API Gateway URL
Your iOS app backend endpoint. Examples:
- Production: `https://8scms50sw3.execute-api.us-west-1.amazonaws.com` (already in config)
- Staging: `https://staging-api.execute-api.us-west-1.amazonaws.com`
- Custom: Your actual API Gateway URL

### 2. Required AWS Backend Endpoints
Your AWS Lambda/DynamoDB backend must implement these endpoints:

#### Authentication Endpoints
```
POST   /admin/auth/login       - Admin login
GET    /admin/auth/verify      - Verify JWT token
POST   /admin/auth/logout      - Logout
```

#### Dashboard Endpoints
```
GET    /admin/dashboard/stats  - Dashboard statistics
GET    /admin/analytics/users  - User analytics
GET    /admin/analytics/transactions?dateRange=30d  - Transaction analytics
GET    /admin/analytics/revenue - Revenue analytics
```

#### Data Management Endpoints
```
GET    /admin/users?page=1&limit=20&filter=active&search=john  - List users
GET    /admin/users/:userId  - Get user details
PUT    /admin/users/:userId/status  - Update user status

GET    /admin/transactions?page=1&limit=20&type=bill_payment&status=completed  - List transactions
GET    /admin/transactions/:transactionId  - Get transaction details

GET    /admin/tickets?status=open&priority=high  - List tickets
GET    /admin/tickets/:ticketId  - Get ticket details
PUT    /admin/tickets/:ticketId  - Update ticket

GET    /admin/audit-logs?action=login  - Get audit logs
POST   /admin/reports/generate  - Generate report
GET    /admin/reports  - List reports
GET    /admin/reports/:reportId/download  - Download report
```

### 3. Required Data Schemas

#### Dashboard Stats Response
```json
{
  "totalUsers": 1234,
  "activeUsers": 856,
  "totalTransactions": 45678,
  "totalRevenue": 892450.75,
  "monthlyGrowth": 12.5,
  "openTickets": 23,
  "revenueGrowth": 8.3,
  "transactionGrowth": 15.2,
  "revenueData": [
    { "month": "Jan", "revenue": 65000 },
    { "month": "Feb", "revenue": 72000 }
  ],
  "transactionTypes": [
    { "name": "Bill Payment", "value": 35 },
    { "name": "Money Transfer", "value": 28 }
  ],
  "userActivity": [
    { "day": "Mon", "users": 1200 },
    { "day": "Tue", "users": 1450 }
  ]
}
```

#### Users Response
```json
{
  "users": [
    {
      "userId": "user-001",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "status": "active",
      "joinDate": "2024-01-15",
      "totalTransactions": 45,
      "totalSpent": 12450.50,
      "lastActive": "2025-01-10"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 100
}
```

#### Transactions Response
```json
{
  "transactions": [
    {
      "transactionId": "txn-001",
      "userId": "user-001",
      "type": "bill_payment",
      "amount": 150.00,
      "currency": "USD",
      "status": "completed",
      "paymentMethod": {
        "type": "card",
        "last4": "4242"
      },
      "createdAt": "2025-01-10T10:30:00Z",
      "description": "Electricity Bill Payment"
    }
  ],
  "totalPages": 50,
  "currentPage": 1,
  "total": 1000
}
```

#### Analytics Response
```json
{
  "summary": {
    "totalRevenue": 892450.75,
    "totalTransactions": 45678,
    "averageTransaction": 19.54,
    "activeUsers": 8932
  },
  "revenueByDay": [
    { "date": "2025-01-01", "revenue": 28500 }
  ],
  "transactionsByType": [
    { "type": "Bill Payment", "count": 15234, "amount": 325000 }
  ],
  "userGrowth": [
    { "month": "Jan", "users": 8932 }
  ]
}
```

### 4. Authentication Requirements
- JWT-based authentication
- Token stored in `localStorage` with key `adminToken`
- Format: `Authorization: Bearer <token>`
- All endpoints require authentication except `/admin/auth/login`

## Step-by-Step Integration

### Step 1: Create Environment File
Create a `.env` file in the project root:

```env
# Production AWS Configuration
VITE_API_BASE_URL=https://your-api-gateway-url.execute-api.us-west-1.amazonaws.com
VITE_AWS_REGION=us-west-1
VITE_AWS_COGNITO_USER_POOL_ID=us-west-1_xxxxxxxxx
VITE_AWS_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
```

### Step 2: Test Your Backend
Before connecting the dashboard, test your API endpoints:

```bash
# Test dashboard stats endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-api-gateway-url.execute-api.us-west-1.amazonaws.com/admin/dashboard/stats

# Test users endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-api-gateway-url.execute-api.us-west-1.amazonaws.com/admin/users?page=1&limit=20
```

### Step 3: Start the Dashboard
```bash
npm install  # If not already done
npm run dev
```

### Step 4: Login
- Navigate to `http://localhost:5173` (or the port Vite assigns)
- Login with admin credentials from your backend
- If login succeeds, the dashboard will fetch real data from your API

### Step 5: Verify Real-Time Data
- Go to Dashboard page - should show real statistics
- Go to Users page - should show real users from DynamoDB
- Go to Transactions page - should show real transactions
- Go to Analytics page - should show real analytics

## Real-Time Updates (Optional)

Currently, the dashboard uses **polling** (refreshes on navigation). For true real-time updates, you have two options:

### Option 1: Add WebSockets (Recommended for real-time)
Implement AWS API Gateway WebSocket API:

**Backend Changes:**
1. Create WebSocket API in API Gateway
2. Lambda functions to handle WebSocket events
3. Push updates to connected clients when data changes

**Frontend Changes:**
- Install WebSocket library: `npm install socket.io-client`
- Create WebSocket connection in Dashboard component
- Listen for events: `transaction.created`, `user.updated`, etc.

**Example WebSocket Implementation:**
```javascript
// In Dashboard.jsx
import { useEffect } from 'react'
import io from 'socket.io-client'

useEffect(() => {
  const socket = io(websocketUrl)
  
  socket.on('dashboard.updated', (data) => {
    setStats(data)
  })
  
  socket.on('transaction.created', () => {
    fetchTransactions() // Refresh transactions
  })
  
  return () => socket.close()
}, [])
```

### Option 2: Add Auto-Refresh (Simpler)
Add polling intervals to refresh data:

**Frontend Changes:**
```javascript
// In Dashboard.jsx
useEffect(() => {
  fetchDashboardStats()
  
  // Refresh every 30 seconds
  const interval = setInterval(() => {
    fetchDashboardStats()
  }, 30000)
  
  return () => clearInterval(interval)
}, [])
```

## Troubleshooting

### Dashboard Still Shows Fake Data

**Problem:** `.env` file not loaded or API URL not recognized.

**Solution:**
1. Check `.env` file exists in project root
2. Restart dev server: Stop and run `npm run dev` again
3. Check browser console for API errors
4. Verify `VITE_API_BASE_URL` doesn't contain `localhost` or `demo`

### API Errors (401, 403, 404)

**Problem:** Backend endpoints not implemented or authentication issues.

**Solution:**
1. Verify API Gateway URL is correct
2. Check Lambda functions are deployed
3. Verify DynamoDB tables exist and have data
4. Test endpoints with curl/Postman
5. Check CloudWatch logs for errors

### CORS Errors

**Problem:** API Gateway not configured for CORS.

**Solution:**
Add CORS configuration to API Gateway:
- Allow origins: `http://localhost:5173` (dev), your production domain
- Allow methods: GET, POST, PUT, DELETE, OPTIONS
- Allow headers: Content-Type, Authorization

### Data Not Loading

**Problem:** DynamoDB tables empty or query issues.

**Solution:**
1. Verify DynamoDB tables have data (use AWS Console)
2. Check Lambda function queries are correct
3. Verify table names match in Lambda environment
4. Test queries with AWS CLI

## Security Checklist

- ✅ JWT tokens properly validated
- ✅ All endpoints require authentication
- ✅ Sensitive data is masked (card numbers, emails, etc.)
- ✅ CORS properly configured
- ✅ HTTPS enabled in production
- ✅ Rate limiting implemented
- ✅ Input validation on all endpoints
- ✅ Audit logging for admin actions

## Testing Checklist

- [ ] Login works with real credentials
- [ ] Dashboard shows real statistics
- [ ] Users page shows real users from DynamoDB
- [ ] Transactions page shows real transactions
- [ ] Analytics page shows real analytics
- [ ] Tickets page shows real tickets
- [ ] Audit logs show real logs
- [ ] Search and filters work
- [ ] Pagination works
- [ ] No console errors
- [ ] PCI DSS masking works correctly

## Next Steps

1. **Create `.env` file** with your production API URL
2. **Test backend endpoints** with curl/Postman
3. **Update API Gateway** to add missing endpoints if needed
4. **Deploy Lambda functions** for admin endpoints
5. **Populate DynamoDB** with test data if needed
6. **Test login** with real admin credentials
7. **Verify all pages** load real data
8. **(Optional) Add WebSocket** for real-time updates

## Support

If you encounter issues:
1. Check browser console for errors
2. Check CloudWatch logs for Lambda errors
3. Verify API Gateway logs
4. Test with curl/Postman first
5. Check DynamoDB data

## Resources

- [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [React Query for Data Fetching](https://tanstack.com/query/latest)
- [WebSocket API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html)

