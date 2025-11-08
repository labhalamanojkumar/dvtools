#!/bin/bash

# Local Development Setup Script
# Best Practice: Isolated development environment with local database

set -e

echo "🚀 Setting up DvTools Local Development Environment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down || true

# Start the services
echo "🏗️  Starting local database and Redis..."
docker-compose -f docker-compose.dev.yml up -d db redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check database connection
echo "🔍 Checking database connection..."
npx prisma db push --accept-data-loss || {
    echo "❌ Database setup failed. Check the logs:"
    docker-compose -f docker-compose.dev.yml logs db
    exit 1
}

# Seed the database
echo "🌱 Seeding database..."
npm run seed || echo "⚠️  Seeding failed, but continuing..."

# Start the application
echo "🚀 Starting the application..."
docker-compose -f docker-compose.dev.yml up app

echo "✅ Local development environment is ready!"
echo "🌐 Application: http://localhost:3000"
echo "🗄️  Database: localhost:3306"
echo "🔄 Redis: localhost:6379"