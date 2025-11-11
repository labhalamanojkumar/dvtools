# Blog Post Creation Fix

## Issues Fixed

### 1. Post Creation Failure (CRITICAL)
**Problem:** Posts weren't being created - clicking "Create Post" did nothing

**Root Cause:** 
The API route was trying to set `tags` and `categories` as direct array properties:
```typescript
const post = await prisma.post.create({
  data: {
    tags: data.tags || [],  // ❌ WRONG
    categories: data.categories || [],  // ❌ WRONG
  }
});
```

However, the Prisma schema uses many-to-many relationships with junction tables:
- `PostTag` junction table (postId + tagId)
- `PostCategory` junction table (postId + categoryId)

This caused a Prisma validation error that was caught silently, returning a 500 error.

**Solution:**
Rewrote the POST endpoint to properly handle many-to-many relationships:

1. Use Prisma transaction for atomicity
2. Create the post first (without relations)
3. For each category name:
   - Find or create the Category record
   - Create PostCategory junction entry
4. For each tag name:
   - Find or create the Tag record
   - Increment tag use count
   - Create PostTag junction entry
5. Return the complete post with all relations

```typescript
const post = await prisma.$transaction(async (tx) => {
  // Create post
  const newPost = await tx.post.create({ data: {...} });

  // Handle categories
  for (const categoryName of data.categories) {
    const category = await tx.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName, slug: ... },
    });
    
    await tx.postCategory.create({
      data: { postId: newPost.id, categoryId: category.id }
    });
  }

  // Handle tags (similar)
  // ...

  return await tx.post.findUnique({ where: { id: newPost.id }, include: {...} });
});
```

### 2. Image Preview Issue
**Status:** The preview functionality is correctly implemented:
- Uses `ReactMarkdown` with `remarkGfm` and `rehypeRaw` plugins
- Image URLs are correctly generated: `/uploads/blog/[filename]`
- Preview tab shows markdown content with images rendered

**Verification:**
- Image upload works (5MB limit, JPEG/PNG/GIF/WebP)
- Image markdown inserted into content: `![filename](url)`
- Preview tab uses proper rehype-raw plugin to render HTML/images
- Volume mount ensures images persist: `dvtools_uploads:/app/public/uploads`

## Files Modified

### `/app/api/admin/posts/route.ts`
- Complete rewrite of POST handler
- Added Prisma transaction for atomicity
- Proper junction table handling for tags/categories
- Better error messages with details
- Uses `upsert` to find or create tags/categories
- Increments tag use count on reuse

## Testing Checklist

1. **Post Creation:**
   - [ ] Create post with title and content
   - [ ] Add tags and categories
   - [ ] Post saves successfully
   - [ ] Redirects to posts list
   - [ ] Post appears in list

2. **Tags & Categories:**
   - [ ] New tags are created
   - [ ] Existing tags are reused
   - [ ] Tag use count increments
   - [ ] Categories are created/linked correctly
   - [ ] Junction tables populated

3. **Image Upload:**
   - [ ] Click upload button
   - [ ] Select image (< 5MB)
   - [ ] Image uploads successfully
   - [ ] Markdown inserted into content
   - [ ] Image appears in preview tab
   - [ ] Image persists after container restart

4. **Post Status:**
   - [ ] Draft posts don't show publishedAt
   - [ ] Published posts have publishedAt timestamp
   - [ ] Post visible on frontend when published

## Database Schema Reference

```prisma
model Post {
  categories  PostCategory[]
  tags        PostTag[]
}

model Category {
  posts  PostCategory[]
}

model Tag {
  posts    PostTag[]
  useCount Int @default(0)
}

model PostCategory {
  postId     String
  categoryId String
  post       Post     @relation(...)
  category   Category @relation(...)
  @@id([postId, categoryId])
}

model PostTag {
  postId  String
  tagId   String
  post    Post @relation(...)
  tag     Tag  @relation(...)
  @@id([postId, tagId])
}
```

## Deployment

After testing:
1. Build Docker image: `docker build -t manojkumarlabhala/dvtools:v1.0.3 .`
2. Push to Docker Hub: `docker push manojkumarlabhala/dvtools:v1.0.3`
3. Update Coolify deployment to use v1.0.3
4. Verify database migrations are applied
5. Test post creation in production

## Notes

- **Transaction ensures atomicity:** If any step fails, entire post creation rolls back
- **Slug generation:** Auto-generated from title (lowercase, hyphenated)
- **Meta fields:** Auto-populated from title/excerpt if not provided
- **Author:** Automatically set from authenticated session user ID
- **Image storage:** `/app/public/uploads/blog/` with volume mount for persistence
