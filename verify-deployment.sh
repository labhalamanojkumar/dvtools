#!/bin/bash
# DVtools Deployment Verification Script
# Run this to verify your Docker image works before deploying to Coolify

echo "🔍 DVtools Deployment Verification"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo "1. Checking Docker availability..."
docker --version > /dev/null 2>&1
print_status $? "Docker is installed"

echo "2. Pulling Docker image..."
docker pull manojkumarlabhala/dvtools:v1.0.0 > /dev/null 2>&1
print_status $? "Image pulled successfully"

echo "3. Checking image exists..."
docker images | grep -q "manojkumarlabhala/dvtools"
print_status $? "Image exists locally"

echo "4. Testing container creation..."
docker create --name dvtools-test manojkumarlabhala/dvtools:v1.0.0 > /dev/null 2>&1
print_status $? "Container created successfully"

echo "5. Checking container configuration..."
docker inspect dvtools-test | grep -q '"Entrypoint":\["/app/entrypoint.sh"\]'
print_status $? "Entrypoint configured correctly"

echo "6. Checking exposed ports..."
docker inspect dvtools-test | grep -q '"3000/tcp":{}'
print_status $? "Port 3000 exposed"

echo "7. Checking health check..."
docker inspect dvtools-test | grep -q "curl -f http://localhost:3000/api/health"
print_status $? "Health check configured"

echo "8. Cleaning up test container..."
docker rm dvtools-test > /dev/null 2>&1
print_status $? "Test container cleaned up"

echo ""
echo "📋 VERIFICATION COMPLETE"
echo "========================"
echo ""
echo "If all checks are ✅, your Docker image is ready for deployment!"
echo ""
echo "🚀 To deploy locally for testing:"
echo "   docker run -d -p 3000:3000 --name dvtools \\"
echo "     -e DATABASE_URL='your-db-url' \\"
echo "     -e NEXTAUTH_URL='http://localhost:3000' \\"
echo "     -e NEXTAUTH_SECRET='test-secret' \\"
echo "     manojkumarlabhala/dvtools:v1.0.0"
echo ""
echo "🌐 Then visit: http://localhost:3000"
echo "🩺 Health check: http://localhost:3000/api/health"