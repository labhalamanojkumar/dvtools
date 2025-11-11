# Quick Deployment Guide - Blog Fix v1.0.9

## Deploy Updated Image

```bash
# Pull the latest image
docker pull manojkumarlabhala/dvtools:v1.0.9

# Update your deployment
docker-compose -f docker-compose.coolify.yml up -d

# Or if using Coolify, update the image tag to v1.0.9 in your settings
```

## Verify Deployment

### 1. Check Container Logs
```bash
docker logs dvtools -f
```

Look for:
- ✅ "Prisma schema loaded successfully"
- ✅ "Database migrations applied"
- ✅ "Server running on port 3000"

### 2. Test Blog API
```bash
# List all published posts
curl https://dvtools.in/api/blog

# Get specific post by slug
curl https://dvtools.in/api/blog/{slug}
```

Expected: JSON response with posts from database

### 3. Test Admin Panel
1. Go to https://dvtools.in/admin/posts
2. Click "New Post"
3. Fill in:
   - Title: "Test Post - Blog Fix Verification"
   - Content: "This is a test post to verify the blog system is working correctly."
   - Tags: "test", "verification"
   - Categories: "Updates"
4. Upload a test image
5. Set Status to "PUBLISHED"
6. Click "Save"

### 4. Verify Post Appears
1. Go to https://dvtools.in/blog
2. Look for your test post
3. Click on it
4. Verify:
   - ✅ Post loads without 404 error
   - ✅ Content displays correctly
   - ✅ Image displays correctly
   - ✅ Tags and categories show
   - ✅ Author info appears

### 5. Check Image Upload
1. In admin post editor, click image upload
2. Select an image (< 5MB, JPEG/PNG/GIF/WebP)
3. Verify preview shows
4. Insert image into content
5. Save and view post
6. Confirm image loads on published post

## Troubleshooting

### Posts Still Show 404
**Cause:** Cache or old build  
**Fix:** 
```bash
docker-compose down
docker system prune -f
docker pull manojkumarlabhala/dvtools:v1.0.9
docker-compose up -d
```

### Images Not Loading
**Cause:** Volume mount issue  
**Fix:** Check docker-compose.coolify.yml has:
```yaml
volumes:
  - dvtools_uploads:/app/public/uploads
```

### Database Connection Errors
**Cause:** SSL certificate or connection string  
**Fix:** Verify DATABASE_URL in .env includes:
```
?sslaccept=accept_invalid_certs
```

### Old Mock Posts Showing
**Expected Behavior:** The old hardcoded demo posts may still appear for specific tool routes (like `/blog/json-formatter`). These are separate from admin-created posts and won't interfere.

**Admin Posts Path:** `/blog/{your-slug}` where slug is generated from your post title.

## Post-Deployment Checklist

- [ ] Container started successfully
- [ ] No errors in logs
- [ ] Database migrations ran
- [ ] Admin panel accessible
- [ ] Can create new blog post
- [ ] Can upload images
- [ ] Published post appears in /blog
- [ ] Post opens without 404
- [ ] Images display in post
- [ ] View counter works
- [ ] Tags/categories display

## Rollback (if needed)

```bash
# Revert to previous version
docker pull manojkumarlabhala/dvtools:v1.0.8
docker-compose -f docker-compose.coolify.yml up -d
```

## Support

If issues persist:
1. Check container logs: `docker logs dvtools`
2. Verify environment variables are set
3. Ensure database is accessible
4. Check volume mounts are configured
5. Review BLOG_SYSTEM_FIX_COMPLETE.md for details

---

**Version:** v1.0.9  
**Release Date:** November 11, 2025  
**Key Fix:** Blog posts now fetch from database instead of mock data
