#!/bin/bash

# Prisma Studio Manager Script
# Helps manage Prisma Studio connections reliably

echo "🔧 Prisma Studio Manager"
echo "========================"

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "✅ Port $port is in use (Prisma Studio running)"
        return 0
    else
        echo "❌ Port $port is free"
        return 1
    fi
}

# Check current status
echo "Checking Prisma Studio status..."
if check_port 5555; then
    echo "📊 Primary Prisma Studio (port 5555): RUNNING"
    echo "🌐 Access at: http://localhost:5555"
elif check_port 5556; then
    echo "📊 Alternative Prisma Studio (port 5556): RUNNING"
    echo "🌐 Access at: http://localhost:5556"
else
    echo "❌ No Prisma Studio instances found"
    echo ""
    echo "Starting Prisma Studio..."
    npm run db:studio &
    sleep 3
    if check_port 5555; then
        echo "✅ Prisma Studio started successfully!"
        echo "🌐 Access at: http://localhost:5555"
    else
        echo "❌ Failed to start Prisma Studio"
    fi
fi

echo ""
echo "💡 Commands:"
echo "   npm run db:studio     - Start on port 5555"
echo "   npm run db:studio:alt - Start on port 5556"
echo "   npx prisma studio     - Start with default settings"