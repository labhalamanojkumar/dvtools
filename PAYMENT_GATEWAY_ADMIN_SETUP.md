# Payment Gateway Admin Configuration Guide

## Overview

All payment gateways are now configured through the **Admin Panel** at `/admin/payment-gateways`. No environment variables are required - all credentials are managed through the database.

## ✅ What's Been Fixed

1. **Admin-Based Configuration**: All payment gateways (Stripe, PayPal, DodoPay, Razorpay) are now configured through `/admin/payment-gateways`
2. **Enhanced Error Messages**: Donation endpoint now provides clear guidance when gateways aren't configured
3. **Better Validation**: Checks for gateway existence, enabled status, and credentials before processing
4. **Detailed Logging**: Console logs show exact configuration status during donation flow

## 🚀 How to Configure Payment Gateways

### Step 1: Access Admin Panel

1. Go to `/admin/payment-gateways` (requires SUPERADMIN role)
2. You'll see 4 payment gateway cards: Stripe, PayPal, DodoPay, Razorpay

### Step 2: Configure Each Gateway

#### Stripe Configuration
```
1. Enable toggle: ON
2. Display Name: "Stripe" (or custom name)
3. Supported Currencies: "INR,USD,EUR,GBP,CAD"
4. Description: "Accept credit card payments worldwide"
5. Publishable Key: pk_test_... or pk_live_...
6. Secret Key: sk_test_... or sk_live_...
7. Webhook Secret: whsec_... (optional)
8. Click "Save Stripe Configuration"
```

#### PayPal Configuration
```
1. Enable toggle: ON
2. Sandbox Mode: ON (for testing) or OFF (for production)
3. Display Name: "PayPal"
4. Supported Currencies: "USD,EUR,GBP,CAD,AUD,INR"
5. Description: "Accept PayPal payments"
6. Client ID: Your PayPal Client ID
7. Client Secret: Your PayPal Secret
8. Click "Save PayPal Configuration"
```

#### DodoPay Configuration
```
1. Enable toggle: ON
2. Test Mode: ON (for testing) or OFF (for production)
3. Display Name: "DodoPay"
4. Supported Currencies: "USD,EUR,INR"
5. Description: "Fast and secure payments"
6. Merchant ID: Your DodoPay Merchant ID
7. API Key: Your DodoPay API Key
8. Click "Save DodoPay Configuration"
```

#### Razorpay Configuration
```
1. Enable toggle: ON
2. Display Name: "Razorpay"
3. Supported Currencies: "INR,USD,EUR"
4. Description: "Accept payments in India and globally"
5. Key ID: rzp_test_... or rzp_live_...
6. Key Secret: Your Razorpay Key Secret
7. Click "Save Razorpay Configuration"
```

## 🔧 Donation Flow (After Configuration)

When a user tries to make a donation:

1. **Request Validation**: Amount, email, gateway checked
2. **Gateway Configuration Check**: 
   - ✅ Gateway exists in database
   - ✅ Gateway is enabled
   - ✅ Gateway has API credentials
3. **Payment Service Initialization**: Gateway service initialized with admin-configured credentials
4. **Checkout Session Creation**: Payment session created
5. **Database Record**: Donation saved with PENDING status

## ⚠️ Error Messages You Might See

### "Payment gateway is not configured"
- **Cause**: Gateway doesn't exist in database
- **Fix**: Go to `/admin/payment-gateways` and configure the gateway

### "Payment gateway is currently disabled"
- **Cause**: Gateway exists but toggle is OFF
- **Fix**: Go to admin panel and enable the gateway

### "Payment gateway is not properly configured"
- **Cause**: Gateway enabled but missing API keys
- **Fix**: Add your API credentials in admin panel

### "Failed to initialize payment gateway"
- **Cause**: API credentials are invalid
- **Fix**: Verify credentials are correct (test vs live keys)

## 📊 Features Available

### Payment Gateway Status
- View which gateways are enabled/disabled
- See configuration summary
- Quick enable/disable toggle

### Payment Pages
- Create direct donation links
- Link pages to campaigns
- Track donations and views per page
- Custom messages and branding

### Security Features
- Passwords/secrets are masked in UI
- Environment-specific settings (sandbox/test mode)
- Webhook secret support
- Secure credential storage

## 🧪 Testing Locally

### Quick Test Setup (Development Only)

If you want to test donations locally without real API keys:

```bash
# Option 1: Configure through admin panel with test credentials
1. Go to /admin/payment-gateways
2. Enable Stripe
3. Use test keys: pk_test_dummy and sk_test_dummy
4. Save configuration

# Option 2: Run the test script (creates dummy Stripe config)
node scripts/setup-test-payments.js
```

**Note**: Test credentials won't create real payment sessions but will allow testing the flow.

## 🔑 Getting Real API Keys

### Stripe
1. Sign up at https://stripe.com
2. Go to Dashboard → Developers → API keys
3. Copy Publishable key (pk_test_...) and Secret key (sk_test_...)
4. For webhooks: Dashboard → Developers → Webhooks → Add endpoint
5. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`

### PayPal
1. Sign up at https://developer.paypal.com
2. Create a REST API app
3. Copy Client ID and Secret from app settings
4. Enable sandbox mode for testing

### Razorpay
1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Generate keys (rzp_test_... for testing)
4. Copy Key ID and Key Secret

### DodoPay
1. Sign up at https://dodopayments.com
2. Get Merchant ID and API Key from dashboard
3. Enable test mode for development

## ✅ Verification Checklist

Before accepting donations:

- [ ] At least one payment gateway is configured
- [ ] Gateway is enabled (toggle ON)
- [ ] API credentials are added
- [ ] Correct mode selected (test/sandbox for development)
- [ ] Try creating a test donation to verify
- [ ] Check console logs for detailed status
- [ ] Verify donations appear in `/admin/donations`

## 🐛 Debugging

Check console logs for detailed information:
```
🚀 Starting donation checkout process...
📦 Request data: {...}
💳 Fetching gateway configuration from database...
💳 Gateway config status: {...}
🔧 Initializing payment service for gateway: STRIPE
✅ Payment service initialized successfully
🌐 Base URL: http://localhost:3000
🛒 Creating checkout session...
✅ Checkout session created: {...}
💾 Creating donation record in database...
✅ Donation record created: {...}
```

If you see ❌ errors, they will show exactly what failed.

## 📝 Environment Variables (Optional)

You don't need environment variables anymore! But for deployment URLs:

```env
# Optional: Set your public URL for callback URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🎯 Summary

**Before**: Required complex .env setup with multiple API keys
**Now**: Simple admin UI at `/admin/payment-gateways` - configure everything visually!

All payment gateway keys are stored securely in the database and managed through the admin panel.
