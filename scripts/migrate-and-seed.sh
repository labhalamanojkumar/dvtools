#!/bin/sh

# Safe migration + seed script for one-off runs in container
# Usage: ./migrate-and-seed.sh

set -euo pipefail

if [ -z "${DATABASE_URL-}" ]; then
  echo "ERROR: DATABASE_URL is not set. Aborting." >&2
  exit 1
fi

# Optionally allow self-signed DB certs via env ALLOW_SELF_SIGNED_DB=true
if [ "${ALLOW_SELF_SIGNED_DB-}" = "true" ]; then
  if ! echo "$DATABASE_URL" | grep -q "sslaccept="; then
    if echo "$DATABASE_URL" | grep -q "\?"; then
      export DATABASE_URL="${DATABASE_URL}&sslaccept=accept_invalid_certs"
    else
      export DATABASE_URL="${DATABASE_URL}?sslaccept=accept_invalid_certs"
    fi
    echo "📡 ALLOW_SELF_SIGNED_DB=true — allowing self-signed DB certs"
  fi
fi

# Migration retry logic
ATTEMPTS=0
MAX_ATTEMPTS=5
BACKOFF=5
until [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; do
  ATTEMPTS=$((ATTEMPTS+1))
  echo "🔁 Migration attempt $ATTEMPTS/$MAX_ATTEMPTS"
  if PRISMA_CONFIG_PATH="" DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy --schema=./prisma/schema.prisma; then
    echo "✅ Migrations applied"
    break
  fi
  echo "⚠️ Migration attempt $ATTEMPTS failed. Sleeping $BACKOFF seconds..."
  sleep "$BACKOFF"
  BACKOFF=$((BACKOFF * 2))
done

if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
  echo "❌ Migrations failed after $MAX_ATTEMPTS attempts" >&2
  exit 1
fi

# Generate Prisma client (idempotent)
echo "🌱 Generating Prisma client"
PRISMA_CONFIG_PATH="" DATABASE_URL="$DATABASE_URL" npx prisma generate --schema=./prisma/schema.prisma

# Seed database if seed script is configured
if npm run -s seed; then
  echo "🌱 Seed script executed"
else
  echo "ℹ️ No seed script or seed failed (non-fatal)"
fi

echo "🎉 Migrations and seed completed"
