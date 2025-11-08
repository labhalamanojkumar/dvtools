#!/bin/bash
# Production deployment script for Coolify

set -e

echo "🚀 Starting production deployment for DvTools..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  No .env.production file found. Creating from template...${NC}"
    cp .env.production.template .env.production
    echo -e "${RED}❌ Please update .env.production with your actual values before deploying!${NC}"
    echo -e "${YELLOW}📝 Required variables to update:${NC}"
    echo "   - DATABASE_URL"
    echo "   - REDIS_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - NEXTAUTH_URL"
    echo "   - APP_URL"
    echo "   - ADMIN_EMAIL"
    echo "   - ADMIN_PASSWORD"
    exit 1
fi

echo -e "${GREEN}✅ Production environment file found${NC}"

# Check required environment variables
required_vars=("DATABASE_URL" "REDIS_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL" "APP_URL" "ADMIN_EMAIL" "ADMIN_PASSWORD")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env.production || grep -q "^$var=$" .env.production; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    exit 1
fi

echo -e "${GREEN}✅ All required environment variables are set${NC}"

# Generate NextAuth secret if not set
if grep -q "your-super-secret-nextauth-key-generate-with-openssl-rand-base64-32" .env.production; then
    echo -e "${YELLOW}⚠️  Generating new NextAuth secret...${NC}"
    if command -v openssl >/dev/null 2>&1; then
        secret=$(openssl rand -base64 32)
        sed -i.bak "s/your-super-secret-nextauth-key-generate-with-openssl-rand-base64-32/$secret/" .env.production
        rm .env.production.bak
        echo -e "${GREEN}✅ NextAuth secret generated${NC}"
    else
        echo -e "${RED}❌ OpenSSL not found. Please generate a secret manually:${NC}"
        echo "   openssl rand -base64 32"
        exit 1
    fi
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --only=production

# Run database migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
npx prisma migrate deploy

# Generate Prisma client
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
npx prisma generate

# Build the application
echo -e "${YELLOW}🏗️  Building application...${NC}"
NODE_ENV=production npm run build

echo -e "${GREEN}✅ Production deployment ready!${NC}"
echo -e "${GREEN}📦 Built application is in .next/ directory${NC}"
echo -e "${GREEN}🚀 Run 'npm start' to start the production server${NC}"