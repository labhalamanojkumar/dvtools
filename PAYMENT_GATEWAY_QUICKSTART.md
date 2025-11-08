# Payment Gateway System - Quick Reference

## 🚀 Setup Commands (Run in order)

```bash
# 1. Navigate to project directory
cd "/Users/manojkumar/Desktop/Work flow/Malti tool platform"

# 2. Run database migration
npx prisma migrate dev --name add_payment_gateways

# 3. Generate Prisma client
npx prisma generate

# 4. Install Stripe SDK (required)
npm install stripe

# 5. Restart development server
npm run dev
```

## 🔑 Admin Access

**Dashboard URL**: `http://localhost:3000/admin/payment-gateways`

**Requirements**:
- Must be logged in
- Must have role: `SUPERADMIN`

## 💳 Supported Payment Gateways

| Gateway | Key Type | Example | Test Mode |
|---------|----------|---------|-----------|
| **Stripe** | Publishable: `pk_test_...`<br>Secret: `sk_test_...` | Credit Cards | ✅ |
| **PayPal** | Client ID: `A...`<br>Secret: `EL...` | PayPal Account | ✅ Sandbox |
| **DodoPay** | Merchant ID<br>API Key | Various | ✅ Test Mode |
| **Razorpay** | Key ID: `rzp_test_...`<br>Secret | Cards, UPI | ✅ |

## 🧪 Test Credentials

### Stripe Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

### PayPal Sandbox
- Create test accounts at: https://developer.paypal.com/dashboard/accounts
- Use sandbox credentials for testing

### Razorpay Test Cards
```
Success: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
```

## 📋 Configuration Checklist

### For Each Gateway:
- [ ] Enable the gateway
- [ ] Enter display name
- [ ] Add description
- [ ] Enter public/client key
- [ ] Enter secret key
- [ ] Add merchant ID (if applicable)
- [ ] Set supported currencies
- [ ] Enable test/sandbox mode (for testing)
- [ ] Click "Save Configuration"

## 🔍 Testing Donation Flow

1. Visit: `http://localhost:3000/donate`
2. Select donation tier (or custom amount)
3. Choose payment method from available gateways
4. Enter email address (required)
5. Click "Complete Donation"
6. Use test credentials on checkout page
7. Verify success page appears
8. Check donation in admin: `/admin/donations`

## 📁 Key Files Reference

| File | Purpose |
|------|---------|
| `lib/payment-service.ts` | Unified payment processing |
| `app/api/admin/payment-gateways/route.ts` | Admin API |
| `app/api/payment-gateways/route.ts` | Public API |
| `app/admin/payment-gateways/page.tsx` | Admin Dashboard |
| `app/donate/page.tsx` | Donation page with gateway selector |
| `prisma/schema.prisma` | Database schema |

## 🚨 Troubleshooting

### Gateway not showing on donation page?
```bash
# Check if gateway is enabled in admin dashboard
# Verify credentials are saved
# Check browser console for errors
```

### Migration errors?
```bash
# Reset database (CAUTION: Deletes data)
npx prisma migrate reset

# Or manually run migration
npx prisma migrate dev
```

### Prisma Client errors?
```bash
# Regenerate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

### TypeScript errors about Payment Gateway?
```bash
# Prisma migration not run yet - expected
# Run migration first:
npx prisma migrate dev
npx prisma generate
```

## 🔒 Security Reminders

✅ Never commit API keys to git
✅ Use test keys for development
✅ Switch to live keys only in production
✅ Keep credentials in secure location
✅ Regularly rotate API keys
✅ Only share keys with authorized personnel

## 📖 Documentation

- **Full Setup Guide**: `PAYMENT_GATEWAY_GUIDE.md`
- **Implementation Summary**: `PAYMENT_GATEWAY_IMPLEMENTATION.md`
- **Stripe Docs**: https://stripe.com/docs
- **PayPal Docs**: https://developer.paypal.com
- **Razorpay Docs**: https://razorpay.com/docs

## 🆘 Need Help?

1. Check `PAYMENT_GATEWAY_GUIDE.md` for detailed instructions
2. Review payment gateway documentation
3. Use contact form: `/contact`
4. Check server logs for errors

## 🎯 Production Checklist

Before going live:
- [ ] All test transactions successful
- [ ] Replace test keys with live keys
- [ ] Disable sandbox/test modes
- [ ] Gateway accounts fully verified
- [ ] SSL/HTTPS configured
- [ ] Error monitoring set up
- [ ] Support team trained
- [ ] Backup procedures in place
- [ ] Test live transaction with small amount
- [ ] Monitor first few transactions closely

---

**Quick Start**: Run migration → Install Stripe → Configure gateway → Test donation

**Status**: ✅ Implementation Complete
**Date**: November 1, 2025
