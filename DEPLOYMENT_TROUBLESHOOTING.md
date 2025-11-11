# Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. News Articles Not Showing After Deployment

#### Problem
- News articles created in admin panel don't appear on `/news` page
- Articles show in admin but not on public news feed
- "No news articles yet" message displayed

#### Root Causes

**A. Database Connection Issue**
```bash
# WRONG: Using SQLite in production
DATABASE_URL="file:./prisma/dev.db"

# CORRECT: Use MySQL or PostgreSQL
DATABASE_URL="mysql://user:password@host:3306/database"
```

**Solution:**
1. In Coolify environment variables, set correct `DATABASE_URL`
2. Use Coolify's MySQL service or external database
3. Never use SQLite in Docker containers

**B. Posts Not Published**
Articles must have:
- `status: "PUBLISHED"`
- `publishedAt` <= current date/time

**Solution:**
```sql
-- Check post status
SELECT id, title, status, publishedAt FROM posts;

-- Manually publish posts
UPDATE posts 
SET status = 'PUBLISHED', publishedAt = NOW() 
WHERE status = 'DRAFT';
```

**C. Database Migration Not Run**
Prisma schema not applied to production database.

**Solution:**
```bash
# In Coolify terminal or SSH
npx prisma db push
# or
npx prisma migrate deploy
```

---

### 2. Images Not Previewing / Upload Fails

#### Problem
- Images upload successfully but don't display
- Image URLs broken after container restart
- 404 errors on image paths

#### Root Causes

**A. Missing Volume Mount**
Images stored in container filesystem are lost on restart.

**Solution:**
Ensure `docker-compose.coolify.yml` has:
```yaml
volumes:
  - dvtools_uploads:/app/public/uploads
```

**B. Wrong Image Path in Production**
Development uses `public/uploads/blog/` but Docker needs proper mounting.

**Solution:**
Already fixed in Dockerfile:
```dockerfile
RUN mkdir -p /app/public/uploads/blog
```

**C. Permissions Issue**
Container user `nextjs` can't write to uploads directory.

**Solution:**
```dockerfile
RUN chown -R nextjs:nodejs /app/public/uploads
```

---

### 3. Database Connection Errors

#### Problem
```
Error: P1001: Can't reach database server
Error: Connection refused
```

#### Solutions

**For Coolify MySQL:**
```env
DATABASE_URL="mysql://mysql:password@mysql:3306/dvtools"
```

**For External Database:**
```env
DATABASE_URL="mysql://user:pass@external-host:3306/dbname"
```

**For PostgreSQL:**
```env
DATABASE_URL="postgresql://user:pass@postgres:5432/dvtools"
```

**Verify Connection:**
```bash
# In Coolify terminal
npx prisma db push
# Should complete without errors
```

---

### 4. Environment Variables Not Loading

#### Problem
- App uses default values instead of Coolify environment variables
- Features not working as configured

#### Solution

**Coolify Environment Variable Setup:**
1. Go to Application → Environment Variables
2. Add all variables from `.env.production.template`
3. Click "Save" and "Restart"

**Required Variables:**
```env
DATABASE_URL=mysql://...
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret
APP_URL=https://your-domain.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
```

---

### 5. Blog Editor Issues

#### Problem
- Image upload button not working
- Font styles not applying
- Preview not showing content

#### Solutions

**A. Image Upload Not Working**
```bash
# Check uploads directory exists
ls -la /app/public/uploads/blog/

# Check permissions
ls -la /app/public/uploads/
# Should show: drwxr-xr-x nextjs nodejs

# If wrong, fix:
chown -R nextjs:nodejs /app/public/uploads
chmod -R 755 /app/public/uploads
```

**B. Preview Not Rendering**
Ensure `rehype-raw` is installed:
```json
{
  "dependencies": {
    "rehype-raw": "^7.0.0"
  }
}
```

**C. Markdown Not Processing HTML**
In `blog-editor.tsx`:
```tsx
<ReactMarkdown rehypePlugins={[rehypeRaw]}>
  {formData.content}
</ReactMarkdown>
```

---

### 6. Posts Created But Not Visible

#### Checklist

1. **Check Post Status**
```sql
SELECT id, title, status, publishedAt FROM posts ORDER BY createdAt DESC;
```
Should show `PUBLISHED`, not `DRAFT`

2. **Check Published Date**
```sql
SELECT id, title, publishedAt, NOW() as current_time 
FROM posts 
WHERE status = 'PUBLISHED';
```
`publishedAt` must be <= `NOW()`

3. **Check Database Connection**
```bash
# In app logs
docker logs dvtools-app | grep -i "prisma"
# Should NOT show connection errors
```

4. **Verify Query in Code**
File: `app/news/page.tsx`
```typescript
const posts = await prisma.post.findMany({
  where: {
    status: "PUBLISHED",
    publishedAt: { lte: new Date() },
  },
  // ...
});
```

---

## Quick Diagnostic Commands

### Check Database Connection
```bash
docker exec -it dvtools-app sh
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM posts;"
```

### Check Posts Count
```bash
docker exec -it dvtools-app npx prisma db execute --stdin <<< "SELECT status, COUNT(*) FROM posts GROUP BY status;"
```

### Check Uploads Directory
```bash
docker exec -it dvtools-app ls -la /app/public/uploads/blog/
```

### View Recent Logs
```bash
docker logs dvtools-app --tail 100
```

### Restart Application
```bash
# In Coolify
Click "Restart" button

# Or via SSH
docker restart dvtools-app
```

---

## Post-Deployment Verification

### 1. Create Test Post
1. Login to `/admin`
2. Go to "Posts"
3. Click "New Post"
4. Fill in:
   - Title: "Test Article"
   - Content: "This is a test"
   - Status: **PUBLISHED**
   - Published At: **Current date/time**
5. Click "Create Post"

### 2. Verify on News Page
1. Visit `/news`
2. Should see "Test Article" in list
3. Click on it to view full post

### 3. Test Image Upload
1. Edit the test post
2. Click Upload Image button
3. Select image file (< 5MB)
4. Wait for upload
5. Check preview tab - image should display
6. Save post
7. View on `/news/test-article` - image should display

---

## Database Schema Check

### Verify Post Model
```bash
docker exec -it dvtools-app npx prisma db execute --stdin <<< "DESCRIBE posts;"
```

Should have columns:
- `id`, `title`, `slug`, `content`
- `status` (enum: DRAFT, PUBLISHED, etc.)
- `publishedAt` (datetime, nullable)
- `authorId`, `createdAt`, `updatedAt`

### Create Admin User (if needed)
```bash
docker exec -it dvtools-app node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dvtools.in',
      name: 'Admin User',
      password: hashedPassword,
      role: 'SUPERADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('Admin created:', admin.email);
}

createAdmin().finally(() => prisma.\$disconnect());
"
```

---

## Environment Variable Checklist

For production deployment in Coolify:

### Critical Variables
- [ ] `DATABASE_URL` - MySQL/PostgreSQL (NOT SQLite)
- [ ] `NEXTAUTH_URL` - Your domain (https://...)
- [ ] `NEXTAUTH_SECRET` - Random secure string (min 32 chars)
- [ ] `APP_URL` - Same as NEXTAUTH_URL
- [ ] `ADMIN_EMAIL` - Admin login email
- [ ] `ADMIN_PASSWORD` - Admin login password

### Optional Variables
- [ ] `REDIS_URL` - For caching
- [ ] `SMTP_*` - For email notifications
- [ ] Payment gateway keys (Stripe, PayPal, etc.)

---

## Final Checklist Before Going Live

1. **Database**
   - [ ] Using MySQL or PostgreSQL (not SQLite)
   - [ ] Connection string tested
   - [ ] Migrations applied (`npx prisma db push`)
   - [ ] Admin user created

2. **Storage**
   - [ ] Upload volume mounted (`dvtools_uploads:/app/public/uploads`)
   - [ ] Directory permissions correct
   - [ ] Test image upload works

3. **Environment**
   - [ ] All required variables set in Coolify
   - [ ] NEXTAUTH_SECRET is secure (32+ chars)
   - [ ] URLs match your domain

4. **Content**
   - [ ] At least one post with status=PUBLISHED
   - [ ] publishedAt date is in the past
   - [ ] Post visible on `/news` page

5. **Testing**
   - [ ] Can login to `/admin`
   - [ ] Can create new post
   - [ ] Can upload image
   - [ ] Post visible on public page
   - [ ] Image displays correctly

---

## Support

If issues persist after following this guide:

1. **Check Application Logs:**
   ```bash
   docker logs dvtools-app --tail 200
   ```

2. **Check Database Logs:**
   ```bash
   docker logs dvtools-mysql --tail 100
   ```

3. **Verify Coolify Configuration:**
   - Application → Configuration → Build Pack
   - Should be "Docker Compose"
   - File: `docker-compose.coolify.yml`

4. **Test Locally First:**
   ```bash
   # Build Docker image locally
   docker build -t dvtools-test .
   
   # Run with same environment variables
   docker run -p 3000:3000 \
     -e DATABASE_URL="mysql://..." \
     -e NEXTAUTH_SECRET="..." \
     dvtools-test
   ```

---

## Quick Fixes

### Reset Everything
```bash
# Stop container
docker stop dvtools-app

# Remove volumes (WARNING: Deletes all data)
docker volume rm dvtools_data dvtools_logs dvtools_uploads

# Rebuild and restart
docker-compose -f docker-compose.coolify.yml up -d --build
```

### Re-run Migrations
```bash
docker exec -it dvtools-app npx prisma db push --force-reset
docker restart dvtools-app
```

### Clear Next.js Cache
```bash
docker exec -it dvtools-app rm -rf .next/cache
docker restart dvtools-app
```
