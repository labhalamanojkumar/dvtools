# DevTools Hub - Quick Start Guide

## Installation

```bash
# Navigate to project directory
cd "/Users/manojkumar/Desktop/Work flow/Malti tool platform"

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed

# Start development server
npm run dev
```

## Environment Setup

Edit `.env` file with your configuration:

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/devtools"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secret:

```bash
openssl rand -base64 32
```

## Database Setup

### Using PostgreSQL (Recommended)

1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE devtools;
   ```
3. Update `DATABASE_URL` in `.env`
4. Run migrations:
   ```bash
   npx prisma db push
   ```

### Using SQLite (Development Only)

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run type-check   # TypeScript type checking
```

## Project Structure

```
app/                 # Next.js 14 App Router
├── api/            # API routes
├── tools/          # Tool pages
├── admin/          # Admin dashboard
└── auth/           # Authentication pages

components/          # React components
├── ui/             # Reusable UI components
├── tools/          # Tool-specific components
├── admin/          # Admin components
└── layout/         # Layout components

lib/                # Utilities and configuration
├── utils.ts        # Helper functions
├── db.ts           # Database client
└── auth.ts         # Auth configuration

prisma/             # Database
└── schema.prisma   # Database schema
```

## Default Credentials

After seeding:

- Email: `admin@devtools.com`
- Password: `admin123`

**Change immediately in production!**

## Features

### Tools

✅ JSON Formatter & Validator
✅ Base64 Encoder/Decoder
✅ JWT Decoder
🚧 Code Beautifier (implement following pattern)
🚧 URL Encoder (implement following pattern)
🚧 RegExp Tester (implement following pattern)

### Admin Dashboard

🚧 User Management
🚧 Analytics
🚧 SEO Monitoring
🚧 Audit Logs

## Development Tips

### Adding a New Tool

1. Create page: `app/tools/[tool-name]/page.tsx`
2. Create client component: `components/tools/[tool-name]-client.tsx`
3. Add to tools list in `app/tools/page.tsx`
4. Update sitemap in `app/api/sitemap/route.ts`

### Adding API Endpoints

Create in `app/api/[endpoint]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: "hello" });
}
```

### Database Changes

```bash
# Make changes to prisma/schema.prisma
# Then run:
npx prisma format      # Format schema
npx prisma generate    # Regenerate client
npx prisma db push     # Update database
```

## Common Issues

### TypeScript Errors

The errors shown are expected before running `npm install`. They will resolve after installing dependencies.

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed

- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists

## Production Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy automatically

### Docker

```bash
docker build -t devtools-hub .
docker run -p 3000:3000 devtools-hub
```

### Manual

```bash
npm run build
npm start
```

## Performance Optimization

- All tools process data client-side
- Images are optimized with Next.js Image
- Code splitting for faster loads
- Server-side rendering for SEO

## Security

- Rate limiting on API routes
- Input sanitization
- Secure headers configured
- CSRF protection
- Password hashing with bcrypt

## SEO Features

- Server-side rendering
- Meta tags on every page
- Structured data (JSON-LD)
- Sitemap generation
- robots.txt
- Canonical URLs

## Support

- GitHub Issues: Report bugs
- Documentation: See IMPLEMENTATION.md
- README.md: Full documentation

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment
3. ✅ Set up database
4. 🔲 Implement remaining tools
5. 🔲 Build admin dashboard
6. 🔲 Add authentication UI
7. 🔲 Deploy to production

---

**Ready to start developing!** 🚀

Run `npm run dev` and visit http://localhost:3000
