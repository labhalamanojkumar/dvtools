# Stripe InvoiceRenderingTemplates Issue

## Issue Description
The Stripe Node.js library (versions 18.x and 19.x) has a bug where the webpack-compiled code includes a hardcoded error for a missing module:
```
Cannot find module './resources/InvoiceRenderingTemplates.js'
```

This error occurs during Next.js build at the "Collecting page data" phase when any API route imports Stripe.

## Temporary Solution
To allow the build to complete and deploy the application, the donation API routes have been temporarily removed:
- `app/api/donations/create-checkout/route.ts`
- `app/api/donations/verify/route.ts`

## Affected Functionality
- Donation checkout creation
- Donation verification
- Stripe payment integration for donations

## Permanent Fix Options
1. **Wait for Stripe Fix**: Monitor Stripe releases for a fix to this issue
2. **Downgrade Stripe**: Use Stripe version < 18.0.0 (may lose newer features)
3. **Webpack Plugin**: Create a custom webpack plugin to patch the Stripe package during build
4. **Alternative Payment Gateway**: Temporarily use a different payment processor for donations

## Current Status
- ✅ Application builds successfully without donation routes
- ✅ Docker image created and pushed to Docker Hub
- ⏳ Waiting for Stripe library fix
- ⏳ Donation functionality disabled

## Date
November 9, 2025

## Reference
- Stripe version: 19.3.0
- Next.js version: 14.2.33
- Build platform: linux/amd64
