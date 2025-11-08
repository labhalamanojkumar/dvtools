# Fix: Donation Checkout 500 Error

## Problem
The `/api/donations/create-checkout` endpoint is returning a 500 error because payment gateways are not configured.

## Quick Fix

Run this command to set up a test payment gateway:

```bash
node scripts/setup-test-payments.js
```

This will:
- Configure Stripe with test credentials
- Enable donations
- Set up minimum donation amount

## For Production

Add your real payment gateway credentials to `.env`:

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# PayPal (optional)
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_SANDBOX_MODE=false

# Razorpay (optional)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# DodoPay (optional)
DODOPAY_API_KEY=your_api_key
DODOPAY_MERCHANT_ID=your_merchant_id
DODOPAY_TEST_MODE=false
```

Then run:

```bash
node scripts/seed-payment-gateways.js
```

## Verify the Fix

1. Check if payment gateway is configured:
```bash
npx prisma studio
```
Navigate to `PaymentGatewayConfig` table and verify `isEnabled` is true

2. Test the donation endpoint in development

## What Was Wrong

The error occurred because:
1. No payment gateways were configured in the database
2. The API was trying to create a checkout session with an uninitialized payment service
3. Missing or invalid API keys for payment gateways

## Additional Improvements

I've added better error logging to help debug:
- Gateway configuration validation
- Detailed error messages
- Environment-specific error details
- Console logging for debugging

Check your terminal/logs for detailed error messages when testing.
