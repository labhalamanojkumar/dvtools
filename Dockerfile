# Multi-stage build for production optimization
# Next.js 16+ requires Node 20+
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat curl openssl

# Copy package files
COPY package.json package-lock.json* ./

    # Install all dependencies (including dev dependencies) for build  
    # Use install instead of ci to handle package-lock sync issues
    RUN npm install --legacy-peer-deps && npm cache clean --force
    
    # Copy source code
    COPY . .

    # Set environment variables for build
    ENV NEXT_TELEMETRY_DISABLED=1
    ENV NODE_ENV=production
    ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

    # Generate Prisma Client with retry
    RUN npx prisma generate || npx prisma generate

    # Build the application
    RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install production runtime dependencies
RUN apk add --no-cache curl openssl libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy package.json for scripts
COPY --from=builder /app/package.json ./package.json

# Copy entrypoint script directly from source
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Create data directory for uploads and logs
RUN mkdir -p /app/data /app/logs && \
    chown -R nextjs:nodejs /app/data /app/logs /app/prisma

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Use entrypoint script to run migrations before starting app
ENTRYPOINT ["/app/entrypoint.sh"]
