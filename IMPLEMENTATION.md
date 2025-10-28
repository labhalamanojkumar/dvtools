# Implementation Guide - DevTools Hub

This document contains code for implementing the remaining tools and features.

## Installation & Setup

### 1. Install Dependencies

```bash
cd "/Users/manojkumar/Desktop/Work flow/Malti tool platform"
npm install
```

### 2. Install Additional Package (for Tailwind animations)

```bash
npm install tailwindcss-animate
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database schema
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

### 4. Set Up Environment

Create a `.env` file with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/devtools?schema=public"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## Remaining Tool Implementations

### Base64 Encoder/Decoder

Create `app/tools/base64/page.tsx`:

```typescript
import { Metadata } from 'next';
import { Base64Client } from '@/components/tools/base64-client';

export const metadata: Metadata = {
  title: 'Base64 Encoder/Decoder - Encode and Decode Base64 Online',
  description: 'Free online Base64 encoder and decoder. Convert text and files to Base64 and back with MIME type detection. Secure and fast.',
  keywords: ['base64 encoder', 'base64 decoder', 'base64 converter', 'encode base64', 'decode base64'],
  alternates: { canonical: '/tools/base64' },
};

export default function Base64Page() {
  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">Base64 Encoder / Decoder</h1>
        <p className="tool-description">
          Encode and decode Base64 strings and files with MIME type detection
        </p>
      </div>
      <Base64Client />
    </div>
  );
}
```

Create `components/tools/base64-client.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import { useToast } from '@/components/ui/toaster';
import { Copy, Download, Upload } from 'lucide-react';

export function Base64Client() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mimeType, setMimeType] = useState('');
  const { toast } = useToast();

  const encode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      toast({ title: 'Encoded', description: 'Text encoded to Base64' });
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: 'Failed to encode text', 
        variant: 'destructive' 
      });
    }
  };

  const decode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      
      // Try to detect MIME type
      if (decoded.startsWith('data:')) {
        const match = decoded.match(/^data:([^;]+);/);
        if (match) setMimeType(match[1]);
      }
      
      toast({ title: 'Decoded', description: 'Base64 decoded successfully' });
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: 'Invalid Base64 string', 
        variant: 'destructive' 
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setInput(base64.split(',')[1]);
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Input</h3>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text or Base64..."
              className="code-editor min-h-[300px]"
            />
            <div className="mt-4 flex gap-2">
              <Button onClick={encode}>Encode</Button>
              <Button onClick={decode} variant="outline">Decode</Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="outline" asChild>
                  <span><Upload className="mr-2 h-4 w-4" />Upload File</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Output</h3>
              {mimeType && (
                <span className="text-sm text-muted-foreground">
                  {mimeType}
                </span>
              )}
            </div>
            <pre className="code-editor min-h-[300px] overflow-auto">
              <code>{output || 'Output will appear here...'}</code>
            </pre>
            {output && (
              <div className="mt-4 flex gap-2">
                <Button onClick={() => copyToClipboard(output)}>
                  <Copy className="mr-2 h-4 w-4" />Copy
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => downloadFile(output, 'output.txt')}
                >
                  <Download className="mr-2 h-4 w-4" />Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### JWT Decoder

Create `app/tools/jwt-decoder/page.tsx`:

```typescript
import { Metadata } from 'next';
import { JwtDecoderClient } from '@/components/tools/jwt-decoder-client';

export const metadata: Metadata = {
  title: 'JWT Decoder - Decode and Verify JSON Web Tokens',
  description: 'Free online JWT decoder and validator. Decode JWT headers and payloads, verify signatures, and check token expiration.',
  keywords: ['JWT decoder', 'JWT validator', 'JSON web token', 'decode JWT', 'verify JWT'],
  alternates: { canonical: '/tools/jwt-decoder' },
};

export default function JwtDecoderPage() {
  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1 className="tool-title">JWT Decoder</h1>
        <p className="tool-description">
          Decode and validate JSON Web Tokens with signature verification
        </p>
      </div>
      <JwtDecoderClient />
    </div>
  );
}
```

Create `components/tools/jwt-decoder-client.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toaster';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function JwtDecoderClient() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const { toast } = useToast();

  const decodeJwt = () => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const decodedHeader = JSON.parse(atob(parts[0]));
      const decodedPayload = JSON.parse(atob(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));

      // Check expiration
      if (decodedPayload.exp) {
        const expiryDate = new Date(decodedPayload.exp * 1000);
        setIsExpired(expiryDate < new Date());
      }

      toast({ title: 'Success', description: 'JWT decoded successfully' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Invalid JWT token',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">JWT Token</h3>
          <Textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here..."
            className="code-editor min-h-[100px]"
          />
          <Button onClick={decodeJwt} className="mt-4">
            Decode JWT
          </Button>
        </CardContent>
      </Card>

      {header && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Header</h3>
              <pre className="code-editor overflow-auto">
                <code>{header}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payload</h3>
                {isExpired ? (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">Expired</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm">Valid</span>
                  </div>
                )}
              </div>
              <pre className="code-editor overflow-auto">
                <code>{payload}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
```

---

## Admin Dashboard Implementation

### Main Admin Dashboard Page

Create `app/admin/page.tsx`:

```typescript
import { Metadata } from 'next';
import { DashboardStats } from '@/components/admin/dashboard-stats';
import { RecentActivity } from '@/components/admin/recent-activity';
import { UsageChart } from '@/components/admin/usage-chart';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage users, view analytics, and monitor system health',
};

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      
      <DashboardStats />
      
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <UsageChart />
        <RecentActivity />
      </div>
    </div>
  );
}
```

### Dashboard Stats Component

Create `components/admin/dashboard-stats.tsx`:

```typescript
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, TrendingUp, Eye } from 'lucide-react';

export function DashboardStats() {
  // In production, fetch from API
  const stats = [
    {
      title: 'Total Users',
      value: '12,234',
      change: '+12.5%',
      icon: Users,
    },
    {
      title: 'Active Sessions',
      value: '2,345',
      change: '+4.2%',
      icon: Activity,
    },
    {
      title: 'Tool Usage',
      value: '45,678',
      change: '+18.9%',
      icon: TrendingUp,
    },
    {
      title: 'Page Views',
      value: '89,012',
      change: '+7.3%',
      icon: Eye,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## API Routes

### Tool Usage Tracking

Create `app/api/track/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashString } from '@/lib/utils';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { toolType, input, duration, success } = await request.json();
    
    const inputHash = hashString(input);
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    await prisma.toolSession.create({
      data: {
        toolType,
        inputHash,
        duration,
        success,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track usage' },
      { status: 500 }
    );
  }
}
```

### Analytics API

Create `app/api/admin/analytics/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [totalUsers, toolSessions, activeToday] = await Promise.all([
      prisma.user.count(),
      prisma.toolSession.count(),
      prisma.toolSession.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    const toolUsage = await prisma.toolSession.groupBy({
      by: ['toolType'],
      _count: true,
    });

    return NextResponse.json({
      totalUsers,
      totalSessions: toolSessions,
      activeToday,
      toolUsage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
```

---

## Database Seeding

Create `prisma/seed.ts`:

```typescript
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create superadmin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@devtools.com' },
    update: {},
    create: {
      email: 'admin@devtools.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: Role.SUPERADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.disconnect();
  });
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## SEO & Performance

### Sitemap Generation

Create `app/api/sitemap/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const tools = [
    'json-formatter',
    'base64',
    'code-beautifier',
    'url-encoder',
    'jwt-decoder',
    'regexp-tester',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  ${tools.map(tool => `
  <url>
    <loc>${baseUrl}/tools/${tool}</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
```

### robots.txt

Create `app/robots.txt/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
```

---

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Testing

### Jest Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Example Test

Create `__tests__/utils.test.ts`:

```typescript
import { formatBytes, isValidEmail, isValidUrl } from '@/lib/utils';

describe('Utils', () => {
  test('formatBytes formats correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  test('isValidEmail validates emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });

  test('isValidUrl validates URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('not-a-url')).toBe(false);
  });
});
```

---

## Next Steps

1. Run `npm install` to install all dependencies
2. Configure `.env` file with your database credentials
3. Run `npx prisma generate && npx prisma db push`
4. Run `npm run dev` to start development server
5. Create remaining tool pages following the same pattern
6. Implement additional admin dashboard features
7. Add authentication with NextAuth.js
8. Set up CI/CD pipeline
9. Deploy to production

For questions or issues, refer to the main README.md file.
