# Blog Fix v1.0.12 - Event Handler Serialization Fix

## Date: January 2025

## Issue
After deploying v1.0.11, blog posts returned a Server Component serialization error:
```
Error: Event handlers cannot be passed to Client Component props.
<... onError={function} ...>
If you need interactivity, consider converting part of this to a Client Component.
```

## Root Cause
ReactMarkdown's img component was receiving event handlers (onError, onLoad, onClick) from its internal processing. When used in a Next.js Server Component, these function props cannot be serialized and cause runtime errors.

## Solution
Updated the img component in ReactMarkdown configuration to filter out event handlers before passing props to the img element:

```typescript
img: (props: any) => {
  // Filter out event handlers that can't be serialized in Server Components
  const { onError, onLoad, onClick, ...safeProps } = props as any;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...safeProps} />
  );
}
```

This destructures the props object, extracts the event handler functions (onError, onLoad, onClick), and only spreads the safe props to the actual img element.

## Changes Made

### File: `/app/blog/[slug]/page.tsx`
- **Lines 647-661**: Updated ReactMarkdown img component
- Added destructuring to filter event handlers: `const { onError, onLoad, onClick, ...safeProps } = props as any;`
- Added ESLint disable comment for next/no-img-element rule
- Spread only safeProps to img element

## Deployment

### 1. Pull Latest Image
```bash
docker pull manojkumarlabhala/dvtools:v1.0.12
```

### 2. Restart Services
```bash
docker-compose -f docker-compose.coolify.yml down
docker-compose -f docker-compose.coolify.yml up -d
```

### 3. Verify Deployment
- Access: https://dvtools.in/blog/welcome-to-dvtools-in-your-dev-toolkit-reimagined
- Expected: Blog post loads without errors
- Check: Images display correctly in content
- Verify: No console errors about event handlers

## Testing Checklist
- [ ] Blog post loads at correct URL
- [ ] No 404 errors
- [ ] No "undefined property" errors
- [ ] No event handler serialization errors
- [ ] Images display correctly
- [ ] Structured data renders in page source
- [ ] View count increments on page load
- [ ] Related posts section displays

## Technical Details
- **Docker Image**: manojkumarlabhala/dvtools:v1.0.12
- **Build Time**: 269.4s
- **Image Digest**: sha256:25486a376eade3cb7bd1fde17b0e46927ea04aa95a029a4bd49c73548e7b9fff
- **Next.js Version**: 14.2.33
- **Component Type**: Async Server Component
- **ReactMarkdown**: Custom component overrides with event handler filtering

## Version History
- **v1.0.9**: Fixed API routes to query database
- **v1.0.10**: Fixed page component to call APIs, added image rendering
- **v1.0.11**: Fixed structured data with safe null checks
- **v1.0.12**: Fixed ReactMarkdown img component event handler serialization

## Environment Configuration
Ensure these are set in production:
```env
NEXT_PUBLIC_BASE_URL=https://dvtools.in
DATABASE_URL=mysql://user:pass@host:port/db?sslaccept=accept_invalid_certs
```

## Troubleshooting

### If Blog Still Returns 404
1. Check database for post with exact slug: `welcome-to-dvtools-in-your-dev-toolkit-reimagined`
2. Verify post status is "PUBLISHED"
3. Check post type is "BLOG"
4. Verify API responds: `curl https://dvtools.in/api/blog/welcome-to-dvtools-in-your-dev-toolkit-reimagined`

### If Images Don't Load
1. Check Docker volume mount for `/app/public/uploads`
2. Verify image paths in database start with `/uploads/blog/`
3. Check file permissions in container: `docker exec <container> ls -la /app/public/uploads/blog/`

### If Still Getting Errors
1. Check container logs: `docker logs <container_name>`
2. Verify all environment variables are set
3. Test database connection from container
4. Check Prisma client is generated: `docker exec <container> npx prisma generate`

## Success Criteria
✅ Blog posts load without any errors
✅ Images display correctly in post content
✅ Structured data (JSON-LD) renders properly
✅ No Server Component serialization errors
✅ View counts increment on page access

## Notes
- Server Components cannot serialize function props
- ReactMarkdown internally generates event handlers that must be filtered
- The img component now only receives serializable props (src, alt, className, etc.)
- ESLint rule disabled because we need native img element for Server Component compatibility
