# Payment Gateway Integration Guide

## Overview

This guide covers the setup and configuration of multiple payment gateways for accepting donations on the Malti Tool Platform. The system supports **Stripe**, **PayPal**, **DodoPay**, and **Razorpay**.

## Features

✅ **Multi-Gateway Support** - Accept payments through multiple providers
✅ **Unified Payment Service** - Abstract layer for consistent payment handling
✅ **Admin Dashboard** - Configure all gateways from one interface
✅ **Gateway Selection** - Users can choose their preferred payment method
✅ **Secure Configuration** - Encrypted credentials and masked keys
✅ **Flexible Integration** - Easy to add more gateways in the future

---

## Prerequisites

Before setting up payment gateways, ensure you have:

1. **Database Migration Complete** - Run Prisma migrations
2. **SUPERADMIN Account** - Access to admin dashboard
3. **Payment Gateway Accounts** - Sign up for desired providers
4. **Environment Variables** - Set up `.env` file
5. **Dependencies Installed** - Required npm packages

---

## Installation

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add_payment_gateways
npx prisma generate
```

This creates the following tables:
- `PaymentGatewayConfig` - Stores payment gateway configurations
- `Donation` (updated) - Now supports multiple gateways

### 2. Install Required Dependencies

```bash
npm install stripe
# Add other payment SDKs as needed
```

### 3. Restart Development Server

```bash
npm run dev
```

---

## Payment Gateway Setup

### Stripe Setup

**1. Create Stripe Account**
- Visit: https://stripe.com
- Sign up for a free account
- Complete account verification

**2. Get API Keys**
- Navigate to: Dashboard → Developers → API keys
- Copy **Publishable key** (starts with `pk_test_...`)
- Copy **Secret key** (starts with `sk_test_...`)

**3. Configure in Admin Dashboard**
- Go to: `/admin/payment-gateways`
- Enable Stripe
- Enter:
  - **Display Name**: Stripe
  - **Description**: Accept credit card payments worldwide
  - **Publishable Key**: `pk_test_xxxxx`
  - **Secret Key**: `sk_test_xxxxx`
  - **Supported Currencies**: USD,EUR,GBP,CAD
- Click **Save Stripe Configuration**

**4. Test Mode**
Use test credit card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Any future expiry date and 3-digit CVC

**5. Go Live**
- Complete Stripe account verification
- Replace test keys with live keys (`pk_live_...`, `sk_live_...`)

---

### PayPal Setup

**1. Create PayPal Developer Account**
- Visit: https://developer.paypal.com
- Sign up or log in with your PayPal account
- Go to Dashboard

**2. Create REST API App**
- Click **My Apps & Credentials**
- Click **Create App**
- Enter app name (e.g., "Malti Tool Platform")
- Select **Merchant** as app type
- Click **Create App**

**3. Get API Credentials**
- Copy **Client ID**
- Click **Show** next to **Secret** and copy it

**4. Configure in Admin Dashboard**
- Go to: `/admin/payment-gateways`
- Enable PayPal
- Enable **Use Sandbox Mode** for testing
- Enter:
  - **Display Name**: PayPal
  - **Description**: Accept PayPal payments
  - **Client ID**: `Axxxxx...`
  - **Client Secret**: `ELxxxxx...`
  - **Supported Currencies**: USD,EUR,GBP,CAD,AUD
- Click **Save PayPal Configuration**

**5. Test Mode**
- Use PayPal sandbox accounts from: https://developer.paypal.com/dashboard/accounts
- Create test buyer and seller accounts
- Use sandbox credentials for testing

**6. Go Live**
- Disable **Use Sandbox Mode** in admin dashboard
- Switch to live credentials from **Live** tab in PayPal dashboard

---

### DodoPay Setup

**1. Create DodoPay Account**
- Visit: https://dodopayments.com
- Sign up for an account
- Complete KYC verification

**2. Get API Credentials**
- Go to: Dashboard → Settings → API
- Copy **Merchant ID**
- Generate and copy **API Key**

**3. Configure in Admin Dashboard**
- Go to: `/admin/payment-gateways`
- Enable DodoPay
- Enable **Use Test Mode** for testing
- Enter:
  - **Display Name**: DodoPay
  - **Description**: Fast and secure payments
  - **Merchant ID**: `merchant_xxxxx`
  - **API Key**: `sk_xxxxx...`
  - **Supported Currencies**: USD,EUR
- Click **Save DodoPay Configuration**

**4. Test Mode**
- Use test API keys provided by DodoPay
- Test transactions won't charge real money

**5. Go Live**
- Disable **Use Test Mode**
- Replace with production API keys

---

### Razorpay Setup

**1. Create Razorpay Account**
- Visit: https://razorpay.com
- Sign up for an account (primarily for India-based businesses)
- Complete KYC verification

**2. Get API Keys**
- Go to: Settings → API Keys
- Click **Generate Key**
- Copy **Key ID** (starts with `rzp_test_...`)
- Copy **Key Secret**

**3. Configure in Admin Dashboard**
- Go to: `/admin/payment-gateways`
- Enable Razorpay
- Enter:
  - **Display Name**: Razorpay
  - **Description**: Accept payments in India and globally
  - **Key ID**: `rzp_test_xxxxx`
  - **Key Secret**: `xxxxxxx`
  - **Supported Currencies**: INR,USD,EUR
- Click **Save Razorpay Configuration**

**4. Test Mode**
Use test card numbers:
- **Success**: `4111 1111 1111 1111`
- Any future expiry and CVV

**5. Go Live**
- Complete Razorpay activation
- Generate live API keys
- Replace test keys with live keys (`rzp_live_...`)

---

## Usage

### For Users (Donation Flow)

1. **Visit Donation Page**: `/donate`
2. **Select Tier or Custom Amount**
3. **Choose Payment Method** from available gateways
4. **Enter Email Address** (required)
5. **Click "Complete Donation"**
6. **Redirected to Payment Gateway** for secure checkout
7. **Complete Payment** using selected method
8. **Redirected Back** to success page
9. **Receive Email Receipt**

### For Administrators

#### Manage Payment Gateways
1. Log in as **SUPERADMIN**
2. Navigate to: `/admin/payment-gateways`
3. Enable/disable gateways as needed
4. Update credentials and settings
5. Save configurations

#### View Donations
1. Navigate to: `/admin/donations`
2. View donations tab
3. See all transactions with:
   - Payment gateway used
   - Amount and status
   - Donor information
   - Transaction IDs

---

## API Endpoints

### Public Endpoints

#### Get Enabled Payment Gateways
```
GET /api/payment-gateways
```
Returns list of enabled payment gateways with public information.

**Response:**
```json
{
  "gateways": [
    {
      "gateway": "STRIPE",
      "displayName": "Stripe",
      "description": "Accept credit card payments",
      "publicKey": "pk_test_xxxxx",
      "supportedCurrencies": "USD,EUR,GBP"
    }
  ]
}
```

#### Create Checkout Session
```
POST /api/donations/create-checkout
```
Creates a payment checkout session with selected gateway.

**Request Body:**
```json
{
  "amount": 15,
  "name": "John Doe",
  "email": "john@example.com",
  "tierId": "supporter",
  "gateway": "STRIPE",
  "message": "Keep up the great work!"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://checkout.stripe.com/xxxxx",
  "sessionId": "cs_test_xxxxx",
  "gateway": "STRIPE",
  "donationId": "clxxxxx"
}
```

#### Verify Payment
```
GET /api/donations/verify?session_id=xxx&gateway=STRIPE
```
Verifies payment completion after redirect.

**Response:**
```json
{
  "success": true,
  "amount": 15,
  "donorName": "John Doe",
  "donorEmail": "john@example.com",
  "gateway": "STRIPE"
}
```

### Admin Endpoints (SUPERADMIN Only)

#### Get All Gateway Configurations
```
GET /api/admin/payment-gateways
```
Returns all payment gateway configurations (with masked secrets).

#### Create/Update Gateway Configuration
```
POST /api/admin/payment-gateways
```
**Request Body:**
```json
{
  "gateway": "STRIPE",
  "isEnabled": true,
  "displayName": "Stripe",
  "description": "Accept credit cards",
  "publicKey": "pk_test_xxxxx",
  "secretKey": "sk_test_xxxxx",
  "supportedCurrencies": "USD,EUR,GBP"
}
```

#### Delete Gateway Configuration
```
DELETE /api/admin/payment-gateways?gateway=STRIPE
```

---

## Database Schema

### PaymentGatewayConfig Table

```prisma
model PaymentGatewayConfig {
  id                String         @id @default(cuid())
  gateway           PaymentGateway @unique
  isEnabled         Boolean        @default(false)
  displayName       String
  description       String?
  publicKey         String?        @db.Text
  secretKey         String?        @db.Text
  merchantId        String?
  webhookSecret     String?        @db.Text
  additionalConfig  Json?
  displayOrder      Int            @default(0)
  supportedCurrencies String?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  updatedBy         String?
}
```

### Donation Table (Updated)

```prisma
model Donation {
  id                String         @id @default(cuid())
  amount            Float
  donorName         String
  donorEmail        String
  tierId            String
  status            DonationStatus @default(PENDING)
  paymentGateway    PaymentGateway // NEW
  gatewaySessionId  String?        @unique // NEW
  gatewayPaymentId  String?        // NEW
  gatewayOrderId    String?        // NEW
  message           String?        @db.Text
  isPublic          Boolean        @default(true)
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}
```

---

## Security Best Practices

### Credential Storage
- ✅ **Never expose secret keys** in client-side code
- ✅ **Mask sensitive data** in API responses
- ✅ **Use environment variables** for local development
- ✅ **Encrypt credentials** in database (recommended)

### API Security
- ✅ **Authenticate admin endpoints** with role check
- ✅ **Validate all inputs** before processing
- ✅ **Use HTTPS** in production
- ✅ **Implement rate limiting** on payment endpoints

### Payment Security
- ✅ **Never store credit card data** (use tokenization)
- ✅ **Verify payments** on server-side
- ✅ **Use webhooks** for reliable payment confirmation
- ✅ **Log all transactions** for audit trail

---

## Webhook Configuration (Future Enhancement)

### Stripe Webhooks
**Endpoint**: `/api/webhooks/stripe`
**Events to Listen**:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.failed`

### PayPal Webhooks
**Endpoint**: `/api/webhooks/paypal`
**Events to Listen**:
- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.CAPTURE.DENIED`

### DodoPay Webhooks
**Endpoint**: `/api/webhooks/dodopay`
**Events to Listen**:
- `payment.succeeded`
- `payment.failed`

### Razorpay Webhooks
**Endpoint**: `/api/webhooks/razorpay`
**Events to Listen**:
- `payment.captured`
- `payment.failed`

---

## Troubleshooting

### Gateway Not Appearing on Donation Page
- ✅ Check if gateway is **enabled** in admin dashboard
- ✅ Verify **credentials are saved** correctly
- ✅ Check browser console for API errors
- ✅ Ensure database migration ran successfully

### Payment Fails During Checkout
- ✅ Verify **API keys are correct**
- ✅ Check if using **test mode** with test cards
- ✅ Ensure **amount meets minimum** requirements
- ✅ Check payment gateway dashboard for errors

### Verification Fails After Payment
- ✅ Verify **session ID is correct** in URL
- ✅ Check **gateway parameter** matches payment method
- ✅ Ensure database **donation record** was created
- ✅ Check server logs for detailed errors

### Admin Dashboard Not Loading
- ✅ Verify user has **SUPERADMIN role**
- ✅ Check if **Prisma Client** is regenerated
- ✅ Ensure **API endpoints** are accessible
- ✅ Check browser console for errors

---

## Testing Checklist

### Before Going Live

- [ ] Test each payment gateway in test/sandbox mode
- [ ] Verify successful payment flow for all gateways
- [ ] Test payment verification after redirect
- [ ] Check donation records are created in database
- [ ] Test admin dashboard gateway management
- [ ] Verify email receipts are sent (if configured)
- [ ] Test error handling for failed payments
- [ ] Verify currency support for each gateway
- [ ] Test custom amount donations
- [ ] Check security: masked keys, role-based access

### Production Deployment

- [ ] Replace all test keys with live/production keys
- [ ] Disable test/sandbox modes
- [ ] Set up webhook endpoints (recommended)
- [ ] Configure proper SSL/HTTPS
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Create backup plan for payment data
- [ ] Document all gateway configurations
- [ ] Train support team on payment issues
- [ ] Set up payment reconciliation process
- [ ] Monitor first few transactions closely

---

## Support

For issues or questions:

1. **Check Documentation** - Review this guide thoroughly
2. **Payment Gateway Docs** - Consult provider documentation
3. **Contact Support** - Use `/contact` form
4. **GitHub Issues** - Report bugs on repository

---

## Future Enhancements

- [ ] Add more payment gateways (Square, Adyen, etc.)
- [ ] Implement webhook handlers for all gateways
- [ ] Add recurring donation support
- [ ] Create donation analytics dashboard
- [ ] Add refund processing from admin panel
- [ ] Implement invoice generation
- [ ] Add tax receipt generation
- [ ] Support for cryptocurrency payments
- [ ] Multi-currency conversion support
- [ ] Payment reminder emails for failed transactions

---

**Last Updated**: November 1, 2025
**Version**: 1.0.0
