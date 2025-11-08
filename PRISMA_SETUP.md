# Prisma Client Setup Required

## ⚠️ IMPORTANT: Run These Commands First

Before the blog/news management and profile features will work, you need to update the database schema and regenerate the Prisma client.

### Commands to Run:

Open a **NEW terminal** (separate from your dev server) and run:

```bash
cd "/Users/manojkumar/Desktop/Work flow/Dvtools"

# Push schema changes to database
npx prisma db push

# Generate Prisma client with new types
npx prisma generate
```

This will:
- ✅ Add new fields to User model (bio, website, location, twitter, github, linkedin)
- ✅ Generate TypeScript types for the Post model
- ✅ Fix all "Property 'post' does not exist" errors
- ✅ Fix all "Property 'bio' does not exist" errors
- ✅ Enable the admin posts API to work properly
- ✅ Enable the profile API to work properly

### After Running the Commands:

The following features will be fully functional:

**Profile Page (/profile):**
- ✅ Edit profile information (name, bio, location)
- ✅ Social links (Twitter, GitHub, LinkedIn)
- ✅ Website URL
- ✅ Real-time profile updates

**Blog/News Management (/admin/posts):**
- ✅ Rich text editor with markdown support
- ✅ Post creation and editing
- ✅ Category and tag management
- ✅ SEO meta fields
- ✅ Post status management (Draft, Published, Scheduled, Archived)
- ✅ Featured and pinned posts
- ✅ Comment management

**Settings Page (/settings):**
- ✅ API key management
- ✅ Export data functionality
- ✅ Account settings

**Dashboard (/dashboard):**
- ✅ Real usage statistics from database
- ✅ Recent activity tracking
- ✅ API call monitoring

### If You See Errors:

If you get database errors, the migrations should handle them automatically. If issues persist:

1. Check your `.env` file has the correct `DATABASE_URL`
2. Make sure your database is running
3. Try running:
```bash
npx prisma migrate reset
npx prisma db push
npx prisma generate
npm run dev
```

**Note:** `prisma migrate reset` will clear all data and re-seed the database.
