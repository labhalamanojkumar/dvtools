-- Database initialization for local development
-- This script runs when the MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dvtools_dev;
USE dvtools_dev;

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON dvtools_dev.* TO 'dvtools'@'%';
FLUSH PRIVILEGES;