# MySQL SSL Connection & Schema Fixes - v1.0.5

## Issues Fixed

### 1. ✅ Prisma Schema Validation Errors
**Problem:** Schema had cyclic referential action errors on self-relations

**Fixed Relations:**
- `Category.parent` → Added `onUpdate: NoAction` 
- `PostComment.parent` → Added `onUpdate: NoAction`

**Error Before:**
```
Error: A self-relation must have `onDelete` and `onUpdate` referential actions 
set to `NoAction` in one of the @relation attributes.
```

**Solution:**
```prisma
// Category self-relation
parent Category? @relation("CategoryParent", fields: [parentId], references: [id], 
  onDelete: SetNull, onUpdate: NoAction)

// PostComment self-relation  
parent PostComment? @relation("CommentReplies", fields: [parentId], references: [id], 
  onDelete: Cascade, onUpdate: NoAction)
```

### 2. ✅ MySQL SSL Connection
**Problem:** MySQL server requires SSL (`--require_secure_transport=ON`)

**Error:**
```
Connections using insecure transport are prohibited while --require_secure_transport=ON.
```

**Solution:**
- Updated DATABASE_URL with `?sslaccept=accept_invalid_certs`
- Added dotenv loading to `prisma.config.ts`
- Docker entrypoint automatically adds SSL parameters if missing

**Connection String:**
```env
DATABASE_URL="mysql://user:pass@host:port/db?sslaccept=accept_invalid_certs"
```

### 3. ✅ Windows Development Environment
**Problem:** Windows has SSL/TLS handshake issues with MySQL SSL

**Workaround:**
- Build completes successfully (app code works)
- Migrations must run in Docker (Linux handles SSL correctly)
- Docker entrypoint applies migrations on container startup

## What's in v1.0.5

### Schema Fixes
- ✅ Fixed Category self-relation (`onUpdate: NoAction`)
- ✅ Fixed PostComment self-relation (`onUpdate: NoAction`)
- ✅ All Prisma validation errors resolved
- ✅ Schema generates correctly

### Database Connection
- ✅ MySQL SSL support with `sslaccept=accept_invalid_certs`
- ✅ Environment variable loading in prisma.config.ts
- ✅ Automatic SSL parameter injection in Docker entrypoint

### Blog Post Creation (from v1.0.4)
- ✅ Proper junction table handling (PostTag, PostCategory)
- ✅ Atomic transactions for post creation
- ✅ Find-or-create logic for tags and categories
- ✅ Tag use count tracking

## Deployment

### Pull New Image
```bash
docker pull manojkumarlabhala/dvtools:v1.0.5
# OR
docker pull manojkumarlabhala/dvtools:latest
```

### Update docker-compose.coolify.yml
```yaml
services:
  dvtools:
    image: manojkumarlabhala/dvtools:v1.0.5  # Update version
    environment:
      - DATABASE_URL=${DATABASE_URL}  # SSL handled automatically
      - RUN_MIGRATIONS=true  # Ensure migrations run
```

### Environment Variables
```env
# MySQL with SSL (required)
DATABASE_URL="mysql://mysql:k9GOu4qSJvKuR8NEFumrg0SX7tgxnmtsJ5QRWmgmkQWQSsLF2oORNWX4y6kVnpPi@161.97.172.172:1120/default?sslaccept=accept_invalid_certs"

# OR let Docker add SSL automatically
DATABASE_URL="mysql://mysql:k9GOu4qSJvKuR8NEFumrg0SX7tgxnmtsJ5QRWmgmkQWQSsLF2oORNWX4y6kVnpPi@161.97.172.172:1120/default"

# Other required vars
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret"
REDIS_URL="rediss://..."
```

### Deploy
```bash
# Using docker-compose
docker-compose -f docker-compose.coolify.yml down
docker-compose -f docker-compose.coolify.yml up -d

# Check logs
docker logs dvtools-app -f
```

### Expected Output
```
🚀 Starting DVtools deployment...
📡 SSL enabled for database connection (accepting self-signed certificates)
📊 Running database migrations...
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "default" at "161.97.172.172:1120"
✅ Database migrations applied successfully
🌱 Generating Prisma client...
✅ Prisma client generated
✅ Database configuration ready!
🎉 Starting Next.js application...
```

## Testing Blog Post Creation

Once deployed, test the blog features:

### 1. Create New Post
```
1. Go to /admin/posts/new
2. Fill in title, content, excerpt
3. Add tags: "test, demo"
4. Add categories: "General"
5. Click "Create Post"
```

**Expected Result:**
- ✅ Post created successfully
- ✅ Tags created in `tags` table
- ✅ Categories created in `categories` table  
- ✅ Junction entries in `post_tags` and `post_categories`
- ✅ Redirects to /admin/posts
- ✅ Post appears in list

### 2. Upload Image
```
1. Create post
2. Click upload icon
3. Select image (< 5MB, JPEG/PNG/GIF/WebP)
4. Image uploads to /uploads/blog/
5. Markdown inserted: ![filename](url)
6. Preview tab shows image
```

**Expected Result:**
- ✅ Image uploaded
- ✅ File persists (volume mount)
- ✅ Image visible in preview

### 3. Publish Post
```
1. Set status to "PUBLISHED"
2. Save post
3. Visit /blog or /news
```

**Expected Result:**
- ✅ Post visible on frontend
- ✅ publishedAt timestamp set
- ✅ Images display correctly

## Database Schema

### Self-Relations Fixed
```prisma
model Category {
  parentId  String?
  parent    Category?   @relation("CategoryParent", 
    fields: [parentId], references: [id], 
    onDelete: SetNull, onUpdate: NoAction)  // ✅ Fixed
  children  Category[]  @relation("CategoryParent")
}

model PostComment {
  parentId  String?
  parent    PostComment? @relation("CommentReplies", 
    fields: [parentId], references: [id], 
    onDelete: Cascade, onUpdate: NoAction)  // ✅ Fixed
  replies   PostComment[] @relation("CommentReplies")
}
```

### Junction Tables (from v1.0.4)
```prisma
model PostTag {
  postId  String
  tagId   String
  post    Post  @relation(...)
  tag     Tag   @relation(...)
  @@id([postId, tagId])
}

model PostCategory {
  postId      String
  categoryId  String
  post        Post      @relation(...)
  category    Category  @relation(...)
  @@id([postId, categoryId])
}
```

## Troubleshooting

### Migration Fails in Docker
```bash
# Check logs
docker logs dvtools-app -f

# Manual migration
docker exec dvtools-app npx prisma migrate deploy

# Verify connection
docker exec dvtools-app npx prisma db pull
```

### SSL Connection Issues
```bash
# Check DATABASE_URL has SSL parameter
docker exec dvtools-app printenv DATABASE_URL

# Should show: ?sslaccept=accept_invalid_certs
```

### Posts Not Creating
```bash
# Check API errors
docker logs dvtools-app -f | grep "Error creating post"

# Verify schema applied
docker exec dvtools-app npx prisma db pull

# Check junction tables exist
docker exec dvtools-app npx prisma db execute --stdin <<< "SHOW TABLES;"
```

## Version History

- **v1.0.0:** Initial deployment
- **v1.0.1:** Database and image persistence fixes
- **v1.0.2:** Routing fixes (404 errors)  
- **v1.0.3:** Initial blog post creation fix
- **v1.0.4:** ✅ Complete blog post creation with junction tables
- **v1.0.5:** ✅ **Current** - Prisma schema fixes + MySQL SSL support

## Files Modified

1. **prisma/schema.prisma**
   - Fixed `Category.parent` with `onUpdate: NoAction`
   - Fixed `PostComment.parent` with `onUpdate: NoAction`

2. **prisma.config.ts**
   - Added dotenv import and config loading
   - Ensures environment variables load before schema validation

3. **.env**
   - Updated DATABASE_URL with SSL parameter
   - Documented Windows development limitations

4. **entrypoint.sh** (unchanged - already handles SSL)
   - Automatically adds SSL parameters if missing
   - Runs migrations with proper SSL support

## Success Criteria

After deploying v1.0.5:

- [ ] Container starts without errors
- [ ] Migrations apply successfully  
- [ ] Database connection established with SSL
- [ ] No Prisma validation errors
- [ ] Posts can be created with tags/categories
- [ ] Images upload and display
- [ ] Self-relations work (categories, comment replies)
- [ ] No "insecure transport" errors

## Next Steps

1. Deploy v1.0.5 to production
2. Test blog post creation end-to-end
3. Verify all database features working
4. Monitor logs for any SSL/connection issues
5. Test category hierarchies (parent/child)
6. Test comment threading (parent/replies)

---

**Status:** ✅ Ready for Production  
**Docker Image:** `manojkumarlabhala/dvtools:v1.0.5`  
**Build Date:** November 11, 2025  
**Key Fixes:** Prisma schema validation + MySQL SSL connection
