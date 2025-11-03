# BreakFree Admin Dashboard

A PCI DSS compliant admin dashboard for BreakFree financial application.

> **🚨 Having login issues?** → Read: [FINAL_SOLUTION.md](./FINAL_SOLUTION.md) | [DEBUGGING_INFO.md](./DEBUGGING_INFO.md)  
> **🔗 New to this project?** Start here: [QUICK_START.md](./QUICK_START.md) | [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

## Features

- **Dashboard Analytics**: Real-time statistics and visualizations
- **User Management**: View and manage user accounts (with privacy protection)
- **Transaction Monitoring**: Monitor all financial transactions (PCI DSS compliant)
- **Support Tickets**: Manage customer support tickets
- **Reports**: Generate and download analytics reports
- **Audit Logs**: Track all administrative actions
- **PCI DSS Compliance**: All sensitive data is masked and secure

## Security Features

### PCI DSS Compliance

- ✅ No storage of sensitive authentication data (CVV/CVC)
- ✅ Card numbers always masked (only last 4 digits shown)
- ✅ Account numbers masked (only last 4 digits shown)
- ✅ Email addresses masked for privacy
- ✅ Phone numbers masked (only last 4 digits shown)
- ✅ All admin actions logged for audit trail
- ✅ Session timeout after 15 minutes of inactivity
- ✅ Encrypted data transmission
- ✅ Role-based access control

### Authentication

- JWT-based authentication
- 15-minute session timeout
- Secure password handling
- Audit logging for all login attempts

## Technology Stack

- **Frontend**: React 18 with Vite
- **UI Library**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: AWS Lambda + DynamoDB
- **Authentication**: JWT
- **Deployment**: AWS (CloudFront + S3 for frontend, Lambda for backend)

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- AWS CLI configured
- AWS account with appropriate permissions

### Frontend Setup

1. Navigate to the admin dashboard directory:
```bash
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your AWS configuration:
```env
VITE_AWS_REGION=us-west-1
VITE_AWS_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_AWS_COGNITO_USER_POOL_CLIENT_ID=your-client-id
VITE_API_BASE_URL=your-api-base-url
```

5. Start the development server:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
export ADMIN_JWT_SECRET=your-secret-key-here
```

4. Deploy the admin backend:
```bash
serverless deploy --config admin-serverless.yml
```

## Deployment

### Deploy Frontend to AWS

1. Build the production bundle:
```bash
cd admin-dashboard
npm run build
```

2. Create an S3 bucket for hosting:
```bash
aws s3 mb s3://breakfree-admin-dashboard
```

3. Enable static website hosting:
```bash
aws s3 website s3://breakfree-admin-dashboard --index-document index.html
```

4. Upload the build files:
```bash
aws s3 sync dist/ s3://breakfree-admin-dashboard
```

5. (Optional) Set up CloudFront distribution for HTTPS and better performance

### Deploy Backend to AWS

1. Deploy the admin Lambda functions:
```bash
cd backend
serverless deploy --config admin-serverless.yml
```

2. Note the API endpoint URL from the deployment output

3. Update the frontend `.env` file with the API URL

4. Rebuild and redeploy the frontend

## Initial Admin User Setup

To create the first admin user, you'll need to manually add a record to the AdminUsers DynamoDB table:

```bash
# Generate password hash
node -e "const crypto = require('crypto'); const salt = crypto.randomBytes(16).toString('hex'); const password = 'YourSecurePassword'; const hash = crypto.createHash('sha256').update(password + salt).digest('hex'); console.log('Salt:', salt, '\nHash:', hash);"
```

Then, add the admin user to DynamoDB:

```json
{
  "email": "admin@breakfree.com",
  "adminId": "admin-001",
  "name": "Admin User",
  "role": "admin",
  "passwordHash": "generated-hash-from-above",
  "salt": "generated-salt-from-above",
  "status": "active",
  "createdAt": 1696963200000,
  "updatedAt": 1696963200000
}
```

**Important**: In production, use bcrypt instead of SHA256 for password hashing.

## Usage

### Login

1. Navigate to the admin dashboard URL
2. Enter your admin credentials
3. You'll be logged in for 15 minutes

### Dashboard

The main dashboard shows:
- Total users and active users
- Total transactions and revenue
- Revenue trends
- Transaction type distribution
- Daily active users

### Users Management

- View all users with masked personal information
- Filter by status (active/inactive/suspended)
- Search by name or user ID
- View individual user details

### Transactions

- View all transactions with masked payment information
- Filter by type and status
- Search transactions
- Export transaction reports

### Support Tickets

- View and manage support tickets
- Update ticket status
- Assign tickets to admins
- Filter by status and priority

### Reports

- Generate custom reports
- Download previous reports
- Choose date ranges
- Multiple report types available

### Audit Logs

- View all admin actions
- Filter by action type
- Search by admin email
- Track security events

## PCI DSS Compliance Notes

### What Data is Masked

1. **Card Numbers**: Only last 4 digits shown as `**** **** **** 1234`
2. **Account Numbers**: Only last 4 digits shown as `****1234`
3. **Email Addresses**: Partially masked as `j***e@example.com`
4. **Phone Numbers**: Only last 4 digits shown as `***-***-1234`

### What Data is NOT Stored

- Full credit card numbers
- CVV/CVC codes
- PIN numbers
- Sensitive authentication data

### Audit Trail

All administrative actions are logged including:
- Login/logout events
- User data access
- Transaction views
- Report generation
- Settings changes

Logs are retained for 90 days as per PCI DSS requirements.

## Security Best Practices

1. **Password Management**
   - Use strong passwords (min 12 characters)
   - Enable 2FA when available
   - Rotate passwords regularly

2. **Session Management**
   - Sessions automatically expire after 15 minutes
   - Always log out when done
   - Don't share admin credentials

3. **Data Access**
   - Only access data when necessary
   - Don't take screenshots of sensitive data
   - Don't share user information externally

4. **Network Security**
   - Use HTTPS only
   - Connect from secure networks
   - Use VPN when accessing remotely

## Troubleshooting

### Cannot Login

- Check your credentials
- Ensure your admin account is active
- Check network connectivity
- Verify API endpoint is correct

### Data Not Loading

- Check browser console for errors
- Verify API endpoint configuration
- Check AWS Lambda function logs
- Ensure DynamoDB tables exist

### Session Expired

- Login again
- Check session timeout settings
- Verify JWT secret is configured correctly

## Development

### Run in Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Support

For issues or questions:
- Email: admin@breakfree.com
- Documentation: [Internal Wiki]
- Emergency: [On-call rotation]

## License

Proprietary - Internal Use Only

## Compliance

This dashboard is designed to be PCI DSS Level 1 compliant. Regular security audits and penetration testing should be performed to maintain compliance.

**Last Security Audit**: [Date]
**Next Audit Due**: [Date]
**Compliance Officer**: [Name]


