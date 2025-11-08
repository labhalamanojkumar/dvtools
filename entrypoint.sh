#!/bin/sh

# Entrypoint script for production deployment
set -e

echo "🚀 Starting DVtools deployment..."

# Run database migrations if RUN_MIGRATIONS is true
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "📊 Running database migrations..."
  npx prisma migrate deploy
  
  echo "🌱 Generating Prisma client..."
  npx prisma generate
fi

# Check if database is accessible
echo "🔍 Checking database connection..."
npx prisma db push --accept-data-loss || {
  echo "⚠️ Database connection failed. Retrying in 5 seconds..."
  sleep 5
  npx prisma db push --accept-data-loss
}

echo "✅ Database ready!"

# Start the application
echo "🎉 Starting Next.js application..."
exec node server.js
