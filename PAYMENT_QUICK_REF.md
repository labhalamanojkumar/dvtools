# 🎯 Payment Gateway Quick Reference

## Run This First!

```bash
# Fix the donation checkout route
bash fix-donation-route.sh
```

## Configure Payment Gateway

### Option 1: Use Admin Panel (Recommended)
```
1. Go to: http://localhost:3000/admin/payment-gateways
2. Enable your gateway (Stripe, PayPal, etc.)
3. Add API keys
4. Click Save
5. Done! ✅
```

### Option 2: Run Test Script (Development Only)
```bash
node scripts/setup-test-payments.js
```

## Test Donation Flow

```
1. Visit: http://localhost:3000/donate
2. Select amount
3. Choose payment method
4. Enter email
5. Click donate button
6. Check console for logs
```

## Expected Console Output (Success)

```
🚀 Starting donation checkout process...
📦 Request data: { amount: 100, currency: 'INR', gateway: 'STRIPE' }
💳 Fetching gateway configuration from database...
💳 Gateway config status: { configFound: true, isEnabled: true, hasSecretKey: true }
🔧 Initializing payment service for gateway: STRIPE
✅ Payment service initialized successfully
🌐 Base URL: http://localhost:3000
🛒 Creating checkout session...
✅ Checkout session created: { sessionId: 'cs_test_...', gateway: 'STRIPE' }
💾 Creating donation record in database...
✅ Donation record created: { id: '...', status: 'PENDING' }
```

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "Payment gateway is not configured" | Go to `/admin/payment-gateways` and configure it |
| "Payment gateway is currently disabled" | Enable toggle in admin panel |
| "Payment gateway is not properly configured" | Add API keys in admin panel |
| "Failed to initialize payment gateway" | Check API keys are valid |
| Syntax error in route.ts | Run `bash fix-donation-route.sh` |

## Stripe Test Credentials

```
Publishable Key: pk_test_51234567890abcdef
Secret Key: sk_test_51234567890abcdef
Test Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

## Quick Links

- **Admin Panel**: http://localhost:3000/admin/payment-gateways
- **Donate Page**: http://localhost:3000/donate
- **Admin Donations**: http://localhost:3000/admin/donations

## Gateway Configuration URLs

- **Stripe**: https://dashboard.stripe.com/test/apikeys
- **PayPal**: https://developer.paypal.com/developer/applications
- **Razorpay**: https://dashboard.razorpay.com/app/keys
- **DodoPay**: https://dodopayments.com/dashboard

## File Locations

```
Config UI:    /app/admin/payment-gateways/page.tsx
Config API:   /app/api/admin/payment-gateways/route.ts
Checkout API: /app/api/donations/create-checkout/route.ts
Payment Core: /lib/payment-service.ts
Test Script:  /scripts/setup-test-payments.js
Fix Script:   /fix-donation-route.sh
```

## Checklist

- [ ] Run `bash fix-donation-route.sh`
- [ ] Configure gateway at `/admin/payment-gateways`
- [ ] Enable gateway toggle
- [ ] Add API keys
- [ ] Save configuration
- [ ] Test donation
- [ ] Check console logs
- [ ] Verify in `/admin/donations`

---

**Need Help?** Check `PAYMENT_GATEWAY_ADMIN_SETUP.md` for detailed guide.
