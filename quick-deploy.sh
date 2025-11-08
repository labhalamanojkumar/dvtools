#!/bin/bash

# Quick Deployment Script
# This script will build and push your DVtools Docker image to Docker Hub

echo "🚀 DVtools Docker Build & Push"
echo "==============================="
echo ""

# Make script executable
chmod +x build-and-push.sh

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"
echo ""
echo "📋 Next steps:"
echo "1. Login to Docker Hub: docker login"
echo "2. Run: ./build-and-push.sh"
echo ""
echo "This will:"
echo "  - Build optimized Docker image"
echo "  - Push to: manojkumarlabhala/dvtools:latest"
echo "  - Ready for Coolify deployment"
echo ""
