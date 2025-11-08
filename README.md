# DvTools - Professional Multi-Tool Web Platform

A comprehensive, production-ready multi-tool web platform built with Next.js 14, TypeScript, and Tailwind CSS. This platform provides developers with professional-grade tools for JSON formatting, Base64 encoding, JWT decoding, code beautification, URL encoding, and regular expression testing.

## 🚀 Features

### Core Tools

- **JSON Formatter & Validator** - Pretty-print, minify, validate with schema support
- **Base64 Encoder/Decoder** - Text and file support with MIME detection
- **Code Beautifier** - Format HTML, CSS, JavaScript with customizable options
- **URL Encoder/Decoder** - Full URL support with query string visualization
- **JWT Decoder** - Decode and validate JWT tokens with signature verification
- **RegExp Tester** - Test patterns with real-time match highlighting

### Platform Features

- ✅ **SEO Optimized** - Server-side rendering, meta tags, structured data
- ✅ **Performance** - Code splitting, image optimization, lazy loading
- ✅ **Accessibility** - WCAG AA compliant, keyboard navigation, ARIA labels
- ✅ **Security** - CSP headers, rate limiting, input sanitization
- ✅ **Dark Mode** - System preference detection with manual override
- ✅ **Responsive** - Mobile-first design, works on all devices
- ✅ **Privacy-Focused** - Client-side processing, no data tracking

### Superadmin Dashboard

- 📊 **Real-time Analytics** - Usage metrics, active users, tool statistics
- 👥 **User Management** - View, edit, suspend, and manage user accounts
- 🔐 **Role-Based Access** - Granular permissions (User, Admin, Superadmin)
- 📝 **Audit Logs** - Complete history of admin actions
- 🔍 **SEO Monitoring** - Lighthouse scores, Core Web Vitals tracking
- 📈 **Reports** - Export data as CSV/PDF, scheduled email reports

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library
- **Recharts** - Data visualization

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **NextAuth.js** - Authentication
- **Redis** - Caching and rate limiting

### Tools & Libraries

- **Ajv** - JSON schema validation
- **js-beautify** - Code formatting
- **jose** - JWT operations
- **Zod** - Runtime type validation
- **React Hook Form** - Form management

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### 🚀 Quick Start (Best Practice - Local Development)

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd dvtools
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start local development environment:**
   \`\`\`bash
   npm run dev:setup
   \`\`\`

   This will:
   - Start MySQL database on localhost:3306
   - Start Redis on localhost:6379
   - Set up the database schema
   - Seed initial data
   - Start the development server on localhost:3000

4. **Access the application:**
   - **Application:** http://localhost:3000
   - **Admin Panel:** http://localhost:3000/admin (admin@dvtools.local / Admin@123)

### 🛠️ Manual Setup (Alternative)

If you prefer manual setup:

1. **Configure environment variables:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

   Edit `.env` with your database credentials.

2. **Set up the database:**
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   npm run seed
   \`\`\`

3. **Run development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

### 🐳 Docker Commands

\`\`\`bash
# Start all services
npm run dev:local

# Stop all services
npm run dev:stop

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Reset database
docker-compose -f docker-compose.dev.yml down -v
npm run dev:setup
\`\`\`

### 🐛 Hydration Error Fix

If you encounter hydration errors (especially "Text content does not match server-rendered HTML"), follow these steps:

#### Quick Fix (Browser Console)
```javascript
// Run this in your browser's Developer Tools console
async function fixHydration() {
  const regs = await navigator.serviceWorker.getRegistrations();
  regs.forEach(reg => reg.unregister());
  const names = await caches.keys();
  names.forEach(name => caches.delete(name));
  localStorage.clear();
  sessionStorage.clear();
  console.log('Cache cleared! Refresh the page.');
}
fixHydration();
```

#### Complete Fix
```bash
# 1. Stop the development server
# 2. Clear Next.js cache
npm run dev:reset

# 3. Clear browser cache or use incognito mode
# 4. Restart development server
npm run dev
```

**Why this happens:** Service worker caches old HTML content, causing server/client mismatches.

## 📂 Project Structure

\`\`\`
malti-tool-platform/
├── app/ # Next.js app directory
│ ├── (tools)/ # Tool pages group
│ │ └── tools/ # Individual tool routes
│ ├── admin/ # Admin dashboard
│ ├── api/ # API routes
│ ├── blog/ # Blog pages
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Homepage
│ └── globals.css # Global styles
├── components/ # React components
│ ├── layout/ # Layout components
│ ├── tools/ # Tool-specific components
│ ├── admin/ # Admin components
│ └── ui/ # Reusable UI components
├── lib/ # Utility libraries
│ ├── utils.ts # Helper functions
│ ├── db.ts # Database client
│ └── auth.ts # Auth configuration
├── prisma/ # Database schema
│ └── schema.prisma # Prisma schema
├── public/ # Static assets
├── types/ # TypeScript types
├── hooks/ # Custom React hooks
├── services/ # Business logic
└── middleware.ts # Next.js middleware
\`\`\`

## 🎨 Design System

The platform uses a custom design system built on Tailwind CSS with:

- **Color Palette** - Primary, secondary, accent, and semantic colors
- **Typography** - Consistent font sizes and weights
- **Spacing** - 4px base unit scale
- **Components** - Reusable UI components (buttons, cards, inputs)
- **Dark Mode** - Full theme support

## 🔒 Security Features

- **Content Security Policy** - Strict CSP headers
- **Rate Limiting** - API and tool usage limits
- **Input Sanitization** - XSS prevention
- **CSRF Protection** - Token-based validation
- **Secure Headers** - HSTS, X-Frame-Options, etc.
- **Password Hashing** - bcrypt with salt
- **2FA Support** - Two-factor authentication for admins

## 📊 SEO Optimization

### On-Page SEO

- ✅ Unique titles and meta descriptions for each page
- ✅ Semantic HTML with proper heading hierarchy
- ✅ Schema.org structured data (Article, FAQ, Breadcrumb)
- ✅ Canonical URLs
- ✅ Open Graph and Twitter Card meta tags
- ✅ XML sitemap generation
- ✅ robots.txt configuration

### Technical SEO

- ✅ Server-side rendering (SSR)
- ✅ Fast page load times (< 2s LCP)
- ✅ Mobile-first responsive design
- ✅ Core Web Vitals optimization
- ✅ Image optimization with WebP/AVIF
- ✅ Lazy loading for images and components

## 🧪 Testing

Run tests:
\`\`\`bash

# Unit tests

npm test

# E2E tests

npm run test:e2e

# Type checking

npm run type-check
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Docker

\`\`\`bash
docker build -t devtools-hub .
docker run -p 3000:3000 devtools-hub
\`\`\`

### Manual

\`\`\`bash
npm run build
npm start
\`\`\`

## 📖 API Documentation

### Tool Endpoints

- `POST /api/tools/json` - JSON formatting
- `POST /api/tools/base64` - Base64 encoding/decoding
- `POST /api/tools/jwt` - JWT decoding
- `POST /api/tools/regexp` - RegExp testing

### Admin Endpoints

- `GET /api/admin/users` - List users
- `GET /api/admin/analytics` - Usage analytics
- `GET /api/admin/audit-logs` - Audit logs
- `POST /api/admin/users/:id/suspend` - Suspend user

See `/docs/api` for complete API reference.

## 🎯 Performance Metrics

Target metrics (Lighthouse):

- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 100

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## ‍💻 Development Roadmap

### Phase 1: Core Setup ✅

- [x] Project initialization
- [x] Design system
- [x] Core components
- [x] Database schema

### Phase 2: Tools Implementation 🚧

- [ ] JSON Formatter
- [ ] Base64 Encoder
- [ ] Code Beautifier
- [ ] URL Encoder
- [ ] JWT Decoder
- [ ] RegExp Tester

### Phase 3: Admin Dashboard 📋

- [ ] User management
- [ ] Analytics dashboard
- [ ] SEO monitoring
- [ ] Audit logs

### Phase 4: Enhancement 🎯

- [ ] API development
- [ ] Blog system
- [ ] Documentation
- [ ] CI/CD pipeline

## 🆘 Support

For issues and questions:

- GitHub Issues: [Create an issue](https://github.com/yourusername/devtools-hub/issues)
- Documentation: [Read the docs](/docs)
- Email: connect@dvtools.in

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Prisma](https://www.prisma.io/)

---

**Made with ❤️ for developers**
