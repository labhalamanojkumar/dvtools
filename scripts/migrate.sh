#!/bin/bash

# Database Migration Script for Production
# This script handles database migrations and initial setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_CONTAINER_NAME="multi-tool-db"
REDIS_CONTAINER_NAME="multi-tool-redis"
MIGRATION_LOG="/app/logs/migration.log"
BACKUP_DIR="/app/backups"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$MIGRATION_LOG"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$MIGRATION_LOG"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$MIGRATION_LOG"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker first."
    fi
    log "Docker is running"
}

# Check if required environment variables are set
check_env_vars() {
    local required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "ADMIN_EMAIL" "ADMIN_PASSWORD")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            error "Required environment variable $var is not set"
        fi
    done
    log "Required environment variables are set"
}

# Create necessary directories
setup_directories() {
    mkdir -p "$BACKUP_DIR" /app/logs /app/data
    log "Created necessary directories"
}

# Backup existing database (if exists)
backup_database() {
    if docker exec "$DB_CONTAINER_NAME" mysql -u"${DB_USER}" -p"${DB_PASSWORD}" -e "USE ${DB_NAME}; SHOW TABLES;" > /dev/null 2>&1; then
        local backup_file="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
        log "Creating database backup: $backup_file"
        docker exec "$DB_CONTAINER_NAME" mysqldump -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" > "$backup_file"
        log "Database backup completed: $backup_file"
    else
        warn "No existing database found, skipping backup"
    fi
}

# Run Prisma migrations
run_migrations() {
    log "Running database migrations..."
    
    # Generate Prisma client
    npx prisma generate
    
    # Apply database migrations
    npx prisma db push
    
    # Run seed if it exists
    if [ -f "prisma/seed.js" ]; then
        log "Running database seed..."
        node prisma/seed.js
    fi
    
    log "Database migrations completed"
}

# Verify database connection
verify_database() {
    log "Verifying database connection..."
    
    if npx prisma db pull; then
        log "Database connection successful"
    else
        error "Database connection failed"
    fi
}

# Main migration process
main() {
    log "Starting database migration process..."
    
    check_docker
    check_env_vars
    setup_directories
    backup_database
    run_migrations
    verify_database
    
    log "Database migration process completed successfully!"
}

# Run main function
main "$@"