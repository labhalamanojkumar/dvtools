#!/bin/bash

# Quick deployment script for Coolify
# This script helps you prepare and deploy DVtools to Coolify

set -e

echo "🚀 DVtools Coolify Deployment Helper"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required commands exist
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }

echo -e "${GREEN}✅ Docker found${NC}"

# Build test
echo ""
echo "📦 Testing Docker build..."
docker build -t dvtools-test . || {
  echo -e "${YELLOW}⚠️ Docker build failed. Please fix errors before deploying.${NC}"
  exit 1
}

echo -e "${GREEN}✅ Docker build successful${NC}"

# Clean up test image
docker rmi dvtools-test

# Generate secrets
echo ""
echo "🔐 Generating secure secrets..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 16)

echo ""
echo "📋 Copy these to Coolify environment variables:"
echo "================================================"
echo ""
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo "DB_PASSWORD=$DB_PASSWORD"
echo ""
echo "================================================"

# Save to a file (optional)
cat > .env.production.local << EOF
# Generated secrets for Coolify deployment
# $(date)
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
DB_PASSWORD=$DB_PASSWORD

# Remember to also set:
# - DATABASE_URL
# - NEXTAUTH_URL
# - ADMIN_EMAIL
# - ADMIN_PASSWORD
# - DOMAIN
EOF

echo ""
echo -e "${GREEN}✅ Secrets saved to .env.production.local${NC}"
echo ""
echo "📚 Next steps:"
echo "  1. Create a new application in Coolify"
echo "  2. Select 'Git Repository' and enter your repo URL"
echo "  3. Set Build Pack to 'Dockerfile'"
echo "  4. Add environment variables (see .env.production.local)"
echo "  5. Configure your domain"
echo "  6. Deploy!"
echo ""
echo "📖 For detailed instructions, see COOLIFY_DEPLOYMENT.md"
echo ""
echo -e "${GREEN}🎉 Ready for Coolify deployment!${NC}"
