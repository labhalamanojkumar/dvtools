# Ad Vendor Verification Guide

## Overview

This guide explains how to set up and verify ad vendors in the DvTools platform. Ad vendor verification is essential for:

- **Monetization**: Enabling ad networks to serve ads on your site
- **Authorization**: Proving you own the domain to ad networks  
- **Compliance**: Meeting industry standards (ads.txt)
- **Trust**: Building credibility with advertisers

## Supported Verification Methods

### 1. HTML Meta Tag Verification

**How it works**: Add a verification meta tag to your site's `<head>` section.

**Supported Vendors**:
- Google AdSense: `google-site-verification`
- Media.net: `media-net-site-verification`
- Monetag: `monetag-site-verification`

**Setup Steps**:
1. Go to your ad vendor's dashboard (e.g., Google AdSense)
2. Find the "Site Verification" section
3. Choose "HTML tag" method
4. Copy the `content` value from the meta tag
5. In DvTools Admin → Ads → Add Vendor → Enter the verification code

**Example**:
```html
<!-- Google provides this: -->
<meta name="google-site-verification" content="abc123xyz789..." />

<!-- You enter in DvTools: -->
Verification Code: abc123xyz789...
```

### 2. ads.txt File

**How it works**: Declare authorized sellers in a public `ads.txt` file at your domain root.

**Industry Standard**: IAB Tech Lab specification for authorized digital sellers

**Setup Steps**:
1. Get your Publisher ID from the ad network
2. Go to DvTools Admin → Ads → Add Vendor
3. Fill in the ads.txt Entry field with proper format
4. The system automatically updates `/ads.txt` on your domain

**Format**:
```
domain, publisher_id, relationship_type, certification_authority_id
```

**Examples**:
```
# Google AdSense
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0

# Media.net
media.net, 12345, DIRECT

# Monetag (PropellerAds)
propellerads.com, 67890, DIRECT

# Amazon Associates
amazon-adsystem.com, 3456, DIRECT
```

**Relationship Types**:
- `DIRECT`: You have a direct relationship with the vendor
- `RESELLER`: The vendor resells your inventory

### 3. Verification File Upload

**How it works**: Some vendors require you to upload specific HTML/text files to your root directory.

**Supported Vendors**: Monetag, some custom ad networks

**Setup Steps**:
1. Download the verification file from your ad vendor
2. In DvTools Admin → Ads → Add Vendor
3. Enter verification file data as JSON:

```json
{
  "filename": "monetag-verify-123456.html",
  "content": "<html><body>Verification: 123456</body></html>",
  "contentType": "text/html"
}
```

4. The file will be served at `https://yourdomain.com/monetag-verify-123456.html`

### 4. DNS TXT Record (Manual)

**How it works**: Add a TXT record to your DNS configuration.

**Note**: This must be done in your domain registrar/DNS provider (Cloudflare, GoDaddy, etc.)

**Setup Steps**:
1. Log into your DNS provider
2. Add a new TXT record
3. Set the value provided by your ad vendor
4. Wait for DNS propagation (up to 48 hours)

## Adding a Vendor in DvTools

### Step-by-Step Instructions

1. **Navigate to Admin Panel**
   - Go to `/admin/ads`
   - Click "Add Vendor" button

2. **Fill Basic Information**
   - **Name**: Display name (e.g., "Google AdSense Main Account")
   - **Type**: Select vendor type from dropdown
   - **Description**: Notes about this vendor (optional)

3. **Enter API Credentials** (if applicable)
   - **API Key**: Client ID or API key from vendor
   - **API Secret**: Client secret (keep secure)
   - **Site ID**: Your site/property ID
   - **Publisher ID**: Your publisher account ID

4. **Configure Verification**
   
   **Verification Code**:
   ```
   Enter: abc123xyz789...
   ```
   
   **ads.txt Entry**:
   ```
   Enter: google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
   ```
   
   **Verification File** (optional):
   ```json
   {
     "filename": "verify-123.html",
     "content": "<html>Verification content</html>",
     "contentType": "text/html"
   }
   ```

5. **Activation**
   - Toggle "Active" switch ON
   - Mark as "Verified" once vendor confirms
   - Click "Create Vendor"

## Verification Process

### Google AdSense

1. **Sign up**: https://www.google.com/adsense/
2. **Get verification code**:
   - Dashboard → Sites → Add site
   - Choose "HTML tag" method
   - Copy the content value (without quotes)
3. **Add to DvTools**:
   - Type: GOOGLE_ADSENSE
   - Verification Code: `<paste code here>`
   - Publisher ID: `pub-XXXXXXXXXXXXXXXXX`
4. **ads.txt entry**:
   ```
   google.com, pub-XXXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```
5. **Verify**: Return to Google AdSense and click "Verify"

### Media.net

1. **Sign up**: https://www.media.net/
2. **Domain verification**:
   - Publisher Dashboard → Add Site
   - Copy verification code
3. **Add to DvTools**:
   - Type: MEDIANET
   - Verification Code: `<paste code>`
   - Publisher ID: Your Media.net ID
4. **ads.txt entry**:
   ```
   media.net, YOUR_ID, DIRECT
   ```

### Monetag (formerly PropellerAds)

1. **Sign up**: https://www.monetag.com/
2. **Site verification**:
   - May require uploading an HTML file
   - Or placing a meta tag
3. **Add to DvTools**:
   - Type: MONETAGE
   - Use Verification File if file upload required
4. **ads.txt entry**:
   ```
   propellerads.com, YOUR_ID, DIRECT
   ```

## Troubleshooting

### Verification Not Working

**Check these common issues**:

1. **Meta tag not loading**
   - View page source: Look for `<meta name="google-site-verification"...`
   - Ensure vendor is marked as "Active"
   - Clear your site cache
   - Regenerate ads.txt: POST to `/api/admin/ads/ads-txt`

2. **ads.txt not accessible**
   - Visit: `https://yourdomain.com/ads.txt`
   - Should return `200 OK` with `text/plain` content
   - Check file exists at `/public/ads.txt`
   - Regenerate: POST `/api/admin/ads/ads-txt`

3. **Verification file 404**
   - Verify JSON format in admin panel
   - Check filename matches exactly
   - Ensure contentType is correct
   - Test: `https://yourdomain.com/filename.html`

4. **DNS verification fails**
   - Allow 48 hours for DNS propagation
   - Use DNS checker: https://dnschecker.org/
   - Verify TXT record format exactly matches vendor requirements

### Getting Help

**Debug Steps**:

1. Check browser console for errors
2. View network tab: Look for 404s or 500s
3. Check server logs for `/ads.txt` or verification file requests
4. Verify vendor settings in admin panel

**API Endpoints**:
- `GET /ads.txt` - View current ads.txt
- `GET /api/admin/ads/ads-txt` - Regenerate ads.txt
- `GET /api/admin/ads/verification?file=filename` - Test verification file
- `GET /api/admin/ads/verification-tags` - View active meta tags

## Best Practices

### Security

1. **Keep API keys secure**: Never commit to version control
2. **Use environment variables**: Store sensitive data in `.env`
3. **Rotate credentials**: Change API keys regularly
4. **Monitor access**: Review ad network dashboards for unauthorized access

### Performance

1. **Cache ads.txt**: Set cache headers (5 minutes recommended)
2. **Lazy load verification**: Meta tags load async
3. **Minimize vendors**: Only add active, verified vendors

### Maintenance

1. **Regular audits**: Review vendor list monthly
2. **Update ads.txt**: When adding/removing vendors
3. **Monitor earnings**: Track which vendors perform best
4. **Stay compliant**: Follow ad network policies

## Common Vendor Requirements

| Vendor | Verification Method | ads.txt Required | Typical Timeline |
|--------|-------------------|-----------------|------------------|
| Google AdSense | Meta tag + ads.txt | Yes | 1-3 days |
| Media.net | Meta tag + ads.txt | Yes | 24-48 hours |
| Monetag | File upload or meta tag | Recommended | 24 hours |
| Amazon Associates | Meta tag | No | Instant |
| Custom Networks | Varies | Recommended | Varies |

## API Reference

### Create Vendor
```typescript
POST /api/admin/ads/vendors
{
  "name": "Google AdSense",
  "type": "GOOGLE_ADSENSE",
  "publisherId": "pub-1234567890123456",
  "verificationCode": "abc123xyz...",
  "adsTxtEntry": "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0",
  "isActive": true
}
```

### Update Vendor
```typescript
PUT /api/admin/ads/vendors?id=vendor_id
{
  "isVerified": true,
  "config": {
    "verificationCode": "new_code"
  }
}
```

### Regenerate ads.txt
```typescript
POST /api/admin/ads/ads-txt
```

## Support

For issues or questions:
- Check documentation: `/docs/ad-management`
- Admin panel: `/admin/ads`
- Contact: admin@dvtools.in

---

Last Updated: 2025-11-12
Version: 1.0.0
