# Quick Deployment Guide - Blog Fix v1.0.3

## What Was Fixed
✅ **Critical Bug:** Blog posts can now be created successfully  
✅ **Root Cause:** API was trying to set many-to-many relationships incorrectly  
✅ **Solution:** Rewrote API with Prisma transactions and proper junction tables  
✅ **Image Preview:** Already working correctly with ReactMarkdown

## Deploy to Production

### Step 1: Pull New Image
```bash
docker pull manojkumarlabhala/dvtools:v1.0.3
```

### Step 2: Update docker-compose.coolify.yml
```yaml
services:
  app:
    image: manojkumarlabhala/dvtools:v1.0.3  # Update this line
```

### Step 3: Restart Container
```bash
docker-compose -f docker-compose.coolify.yml down
docker-compose -f docker-compose.coolify.yml up -d
```

### Step 4: Verify Deployment
```bash
docker logs dvtools-app -f
```

## Test Post Creation

1. **Login as Admin**
   - Go to: `https://your-domain.com/admin/posts`

2. **Create New Post**
   - Click "Create New Post" or go to `/admin/posts/new`
   - Fill in:
     - Title: "Test Post" (slug auto-generates)
     - Excerpt: "This is a test"
     - Content: "# Hello World"
   - Add tags: "test, demo"
   - Add categories: "General"
   - Click "Create Post"

3. **Expected Result:**
   - ✅ Success toast: "Post created successfully"
   - ✅ Redirects to `/admin/posts`
   - ✅ New post appears in list
   - ✅ Tags and categories saved

4. **Test Image Upload:**
   - Create another post
   - Click upload icon
   - Select image (< 5MB, JPEG/PNG/GIF/WebP)
   - ✅ Markdown inserted: `![filename](url)`
   - Click "Preview" tab
   - ✅ Image displays

## Technical Details

### The Fix
```typescript
// OLD (Broken)
const post = await prisma.post.create({
  data: {
    tags: data.tags || [],  // ❌ Wrong
    categories: data.categories || [],  // ❌ Wrong
  }
});

// NEW (Working)
const post = await prisma.$transaction(async (tx) => {
  const newPost = await tx.post.create({ data: {...} });
  
  // Create junction table entries
  for (const tag of data.tags) {
    const tagRecord = await tx.tag.upsert({ where: { name: tag }, ... });
    await tx.postTag.create({ data: { postId: newPost.id, tagId: tagRecord.id } });
  }
  
  // Same for categories...
  return newPost;
});
```

### Database Structure
```
Post ←→ PostTag ←→ Tag
Post ←→ PostCategory ←→ Category
```

### Volume Mounts
```yaml
volumes:
  dvtools_uploads:/app/public/uploads  # Images persist here
```

## Troubleshooting

### Post creation still fails?
```bash
# Check logs
docker logs dvtools-app -f

# Check database connection
docker exec dvtools-app npx prisma db pull

# Run migrations
docker exec dvtools-app npx prisma migrate deploy
```

### Images don't show?
```bash
# Check volume
docker volume inspect dvtools_uploads

# Check files
docker exec dvtools-app ls -la /app/public/uploads/blog/

# Check permissions
docker exec dvtools-app chown -R nextjs:nodejs /app/public/uploads
```

### 403 Unauthorized?
- Verify user has ADMIN or SUPERADMIN role
- Check NextAuth session
- Verify DATABASE_URL and NEXTAUTH_SECRET in environment

## Environment Variables
```env
DATABASE_URL="mysql://user:pass@host:3306/dbname"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"
```

## Success Criteria

After deployment, verify:
- [ ] `/admin/posts/new` accessible
- [ ] Can create post with title and content
- [ ] Tags and categories save correctly
- [ ] Images upload successfully
- [ ] Images appear in preview
- [ ] Post appears in `/admin/posts` list
- [ ] Post visible on frontend when published
- [ ] No TypeScript errors
- [ ] No runtime errors in logs

## Support

If issues persist:
1. Check `BLOG_POST_CREATION_FIX.md` for technical details
2. Check `BLOG_FEATURES_COMPLETE_SUMMARY.md` for complete overview
3. Review database schema in `prisma/schema.prisma`
4. Check API logs for error details (now includes error messages)

## Version History

- **v1.0.0:** Initial deployment
- **v1.0.1:** Fixed database and image persistence
- **v1.0.2:** Fixed routing (404 errors)
- **v1.0.3:** ✅ Fixed post creation (junction tables)

---

**Status:** ✅ Ready for Production  
**Docker Image:** `manojkumarlabhala/dvtools:v1.0.3`  
**Build Date:** 2025  
**All Features:** Fully Functional
