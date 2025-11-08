#!/bin/bash

# Database Backup Script for Production
# This script creates regular database backups

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="/app/backups"
RETENTION_DAYS=30
S3_BUCKET=""  # Set to your S3 bucket for cloud backups
DB_CONTAINER_NAME="multi-tool-db"
LOG_FILE="/app/logs/backup.log"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

# Create backup directory
create_backup_dir() {
    mkdir -p "$BACKUP_DIR"
    log "Backup directory created: $BACKUP_DIR"
}

# Create database backup
create_database_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/database_backup_$timestamp.sql.gz"
    
    log "Creating database backup: $backup_file"
    
    # Create SQL dump
    docker exec "$DB_CONTAINER_NAME" mysqldump -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" | gzip > "$backup_file"
    
    if [ -f "$backup_file" ]; then
        log "Database backup created successfully: $backup_file"
        echo "$backup_file"
    else
        error "Failed to create database backup"
    fi
}

# Create Redis backup
create_redis_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/redis_backup_$timestamp.rdb.gz"
    
    log "Creating Redis backup: $backup_file"
    
    # Copy Redis dump
    docker cp "$REDIS_CONTAINER_NAME:/data/dump.rdb" - | gzip > "$backup_file"
    
    if [ -f "$backup_file" ]; then
        log "Redis backup created successfully: $backup_file"
    else
        error "Failed to create Redis backup"
    fi
}

# Upload to S3 (optional)
upload_to_s3() {
    local file_path="$1"
    local file_name=$(basename "$file_path")
    
    if [[ -n "$S3_BUCKET" ]]; then
        log "Uploading $file_name to S3 bucket: $S3_BUCKET"
        aws s3 cp "$file_path" "s3://$S3_BUCKET/backups/$file_name"
        log "Upload to S3 completed"
    fi
}

# Clean old backups
clean_old_backups() {
    log "Cleaning backups older than $RETENTION_DAYS days"
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.rdb.gz" -mtime +$RETENTION_DAYS -delete
    log "Old backups cleaned"
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    if [[ "$backup_file" == *.gz ]]; then
        if gzip -t "$backup_file" 2>/dev/null; then
            log "Backup integrity verified: $backup_file"
        else
            error "Backup integrity check failed: $backup_file"
        fi
    fi
}

# Main backup process
main() {
    log "Starting backup process..."
    
    create_backup_dir
    
    # Create database backup
    local db_backup=$(create_database_backup)
    verify_backup "$db_backup"
    upload_to_s3 "$db_backup"
    
    # Create Redis backup
    create_redis_backup
    
    # Clean old backups
    clean_old_backups
    
    log "Backup process completed successfully!"
}

# Run main function
main "$@"