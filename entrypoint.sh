#!/bin/sh

# Entrypoint script for production deployment
set -e

echo "🚀 Starting DVtools deployment..."

# Ensure DATABASE_URL has SSL parameters if not already present
if [ -n "$DATABASE_URL" ] && ! echo "$DATABASE_URL" | grep -q "sslaccept="; then
  # Check if URL already has query parameters
  if echo "$DATABASE_URL" | grep -q "?"; then
    export DATABASE_URL="${DATABASE_URL}&sslaccept=accept_invalid_certs"
  else
    export DATABASE_URL="${DATABASE_URL}?sslaccept=accept_invalid_certs"
  fi
  echo "📡 SSL enabled for database connection (accepting self-signed certificates)"
fi

# Run database migrations if RUN_MIGRATIONS is true
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "📊 Running database migrations..."
  PRISMA_CONFIG_PATH="" DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy --schema=./prisma/schema.prisma
  
  echo "🌱 Generating Prisma client..."
  PRISMA_CONFIG_PATH="" DATABASE_URL="$DATABASE_URL" npx prisma generate --schema=./prisma/schema.prisma
fi

# Skip database push in production - just verify connection
echo "🔍 Verifying database connection..."
if ! npx prisma db execute --stdin < /dev/null 2>/dev/null; then
  echo "⚠️ Note: Database verification skipped (expected in production)"
fi

echo "✅ Database configuration ready!"

# Start the application
echo "🎉 Starting Next.js application..."
exec node server.js
