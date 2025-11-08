#!/bin/bash

# Build and Push Docker Image to Docker Hub
# Usage: ./build-and-push.sh [version]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKER_USERNAME="manojkumarlabhala"
IMAGE_NAME="dvtools"
VERSION=${1:-"latest"}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DVTools Docker Build & Push Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1/5: Checking Docker login status...${NC}"
if ! docker info | grep -q "Username: ${DOCKER_USERNAME}"; then
    echo -e "${YELLOW}Not logged in to Docker Hub. Logging in...${NC}"
    docker login
else
    echo -e "${GREEN}✓ Already logged in to Docker Hub${NC}"
fi

echo ""
echo -e "${YELLOW}Step 2/5: Building Docker image...${NC}"
echo -e "Image: ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
echo ""

# Build the Docker image
docker build \
    --platform linux/amd64 \
    -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} \
    -t ${DOCKER_USERNAME}/${IMAGE_NAME}:latest \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker image built successfully${NC}"
else
    echo -e "${RED}✗ Docker build failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 3/5: Tagging images...${NC}"
if [ "$VERSION" != "latest" ]; then
    docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
    echo -e "${GREEN}✓ Tagged as latest${NC}"
fi

echo ""
echo -e "${YELLOW}Step 4/5: Pushing image to Docker Hub...${NC}"
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}

if [ "$VERSION" != "latest" ]; then
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Image pushed successfully${NC}"
else
    echo -e "${RED}✗ Docker push failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 5/5: Verifying image...${NC}"
echo -e "Image size:"
docker images ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Build and Push Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Image URL: ${GREEN}docker.io/${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Add this image to your Coolify project"
echo "2. Configure environment variables in Coolify"
echo "3. Deploy!"
echo ""
echo -e "${YELLOW}Docker Pull Command:${NC}"
echo -e "  docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
echo ""
