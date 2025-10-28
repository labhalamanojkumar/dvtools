#!/bin/bash

# DevTools Hub - Installation Script
# This script sets up the development environment

set -e  # Exit on error

echo "🚀 DevTools Hub - Installation Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Install additional package
echo "📦 Installing tailwindcss-animate..."
npm install tailwindcss-animate
echo -e "${GREEN}✅ tailwindcss-animate installed${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
    echo ""
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
    echo ""
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate
echo -e "${GREEN}✅ Prisma client generated${NC}"
echo ""

# Ask if user wants to push database schema
echo "🗄️  Do you want to push the database schema? (y/n)"
read -r PUSH_DB

if [ "$PUSH_DB" = "y" ] || [ "$PUSH_DB" = "Y" ]; then
    echo "🗄️  Pushing database schema..."
    npx prisma db push
    echo -e "${GREEN}✅ Database schema pushed${NC}"
    echo ""
    
    # Ask about seeding
    echo "🌱 Do you want to seed the database with sample data? (y/n)"
    read -r SEED_DB
    
    if [ "$SEED_DB" = "y" ] || [ "$SEED_DB" = "Y" ]; then
        echo "🌱 Seeding database..."
        npx prisma db seed
        echo -e "${GREEN}✅ Database seeded${NC}"
        echo ""
        echo -e "${YELLOW}Default admin credentials:${NC}"
        echo "  Email: admin@devtools.com"
        echo "  Password: admin123"
        echo ""
    fi
fi

# Installation complete
echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo "📚 Next steps:"
echo "  1. Edit .env file with your configuration"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Visit http://localhost:3000"
echo ""
echo "📖 Documentation:"
echo "  - README.md - Full project documentation"
echo "  - QUICKSTART.md - Quick start guide"
echo "  - IMPLEMENTATION.md - Implementation details"
echo ""
echo "🎉 Happy coding!"
