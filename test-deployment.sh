#!/bin/bash

# DVtools Local Deployment Test Script
# This script helps test the deployment process locally before deploying to Coolify

set -e

echo "🚀 Testing DVtools deployment locally..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Build the Docker image
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
docker build -t dvtools-test .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

# Create a test environment file
echo -e "${YELLOW}📝 Creating test environment...${NC}"
cat > .env.test << EOF
# Test environment for local deployment testing
DATABASE_URL="file:./prisma/test.db"
DATABASE_PROVIDER="sqlite"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="test-secret-for-local-deployment-testing-only"
NODE_ENV="production"
APP_URL="http://localhost:3001"
PORT=3001
HOSTNAME="0.0.0.0"
ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="testpassword"
ENABLE_ANALYTICS="false"
RUN_MIGRATIONS="true"
SITE_NAME="DvTools Test"
SITE_DESCRIPTION="Testing deployment"
EOF

# Run the container
echo -e "${YELLOW}🐳 Starting container...${NC}"
docker run -d \
    --name dvtools-test \
    -p 3001:3000 \
    --env-file .env.test \
    dvtools-test

# Wait for container to start
echo -e "${YELLOW}⏳ Waiting for application to start...${NC}"
sleep 10

# Test health endpoint
echo -e "${YELLOW}🔍 Testing health endpoint...${NC}"
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo -e "${YELLOW}📋 Container logs:${NC}"
    docker logs dvtools-test
fi

# Test main application
echo -e "${YELLOW}🌐 Testing main application...${NC}"
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is responding${NC}"
else
    echo -e "${RED}❌ Application not responding${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Local deployment test completed!${NC}"
echo -e "${YELLOW}📱 Test your application at: http://localhost:3001${NC}"
echo ""
echo -e "${YELLOW}🧹 To clean up:${NC}"
echo "docker stop dvtools-test && docker rm dvtools-test && docker rmi dvtools-test"
echo "rm .env.test"