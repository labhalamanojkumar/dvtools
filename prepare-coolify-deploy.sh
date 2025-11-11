#!/bin/bash

# Quick Coolify Deployment Script for DvTools
# This script helps verify your setup before deploying to Coolify

set -e

echo "🚀 DvTools Coolify Deployment Preparation"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi
echo -e "${GREEN}✅ Docker is installed${NC}"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose first"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose is installed${NC}"

# Check if required files exist
echo ""
echo "Checking required files..."

required_files=(
    "Dockerfile"
    "docker-compose.coolify.yml"
    "entrypoint.sh"
    ".dockerignore"
    "prisma/schema.prisma"
    "package.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file is missing${NC}"
        exit 1
    fi
done

# Validate docker-compose file
echo ""
echo "Validating docker-compose.coolify.yml..."
if docker-compose -f docker-compose.coolify.yml config > /dev/null 2>&1; then
    echo -e "${GREEN}✅ docker-compose.coolify.yml is valid${NC}"
else
    echo -e "${RED}❌ docker-compose.coolify.yml has errors${NC}"
    exit 1
fi

# Check environment variables template
echo ""
echo "Checking environment configuration..."
if [ -f ".env.production.template" ]; then
    echo -e "${GREEN}✅ Environment template found${NC}"
    echo ""
    echo -e "${YELLOW}📋 Required environment variables for Coolify:${NC}"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - APP_URL"
    echo "   - ADMIN_EMAIL"
    echo "   - ADMIN_PASSWORD"
else
    echo -e "${YELLOW}⚠️  No environment template found${NC}"
fi

# Test Docker build (optional, can take time)
echo ""
read -p "Do you want to test build the Docker image? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Building Docker image (this may take 5-10 minutes)..."
    if docker build -t dvtools-test:latest -f Dockerfile .; then
        echo -e "${GREEN}✅ Docker build successful${NC}"
        echo "Cleaning up test image..."
        docker rmi dvtools-test:latest
    else
        echo -e "${RED}❌ Docker build failed${NC}"
        echo "Please fix build errors before deploying to Coolify"
        exit 1
    fi
fi

# Generate NEXTAUTH_SECRET
echo ""
echo -e "${YELLOW}🔐 Generate NEXTAUTH_SECRET:${NC}"
if command -v openssl &> /dev/null; then
    secret=$(openssl rand -base64 32)
    echo "   $secret"
    echo ""
    echo "   Copy this value to Coolify's NEXTAUTH_SECRET environment variable"
else
    echo "   Install openssl to generate: openssl rand -base64 32"
fi

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Pre-deployment checks passed!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Push code to GitHub repository"
echo "2. Create new application in Coolify"
echo "3. Select Docker Compose build pack"
echo "4. Configure environment variables (see .env.production.template)"
echo "5. Deploy!"
echo ""
echo "📚 Full guide: COOLIFY_DEPLOYMENT_GUIDE.md"
echo ""

# Show deployment checklist
echo "Deployment Checklist:"
echo "  [ ] Code pushed to Git repository"
echo "  [ ] Coolify application created"
echo "  [ ] Database service configured"
echo "  [ ] Environment variables set"
echo "  [ ] Domain configured (optional)"
echo "  [ ] SSL enabled (optional)"
echo "  [ ] Deploy button clicked"
echo ""
echo "🎉 Ready for Coolify deployment!"
