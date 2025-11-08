#!/usr/bin/env node

/**
 * Script to fix DATABASE_URL format for Prisma MySQL compatibility
 * Prisma MySQL uses sslaccept parameter instead of ssl-mode
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.error('.env file not found');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');

// Fix DATABASE_URL SSL parameters
const databaseUrlMatch = envContent.match(/^DATABASE_URL=(.+)$/m);

if (databaseUrlMatch) {
  let dbUrl = databaseUrlMatch[1].replace(/^["']|["']$/g, ''); // Remove quotes
  
  // Remove ssl-mode=REQUIRED and keep sslaccept
  let fixedUrl = dbUrl
    .replace(/ssl-mode=REQUIRED[&]?/gi, '')
    .replace(/ssl-mode=required[&]?/gi, '');
  
  // Ensure proper format: use sslaccept=accept_invalid_certs
  if (!fixedUrl.includes('sslaccept=')) {
    fixedUrl += (fixedUrl.includes('?') ? '&' : '?') + 'sslaccept=accept_invalid_certs';
  }
  
  // Update the .env file
  envContent = envContent.replace(
    /^DATABASE_URL=.*$/m,
    `DATABASE_URL="${fixedUrl}"`
  );
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Fixed DATABASE_URL format');
  console.log('New URL:', fixedUrl.substring(0, 50) + '...');
} else {
  console.log('⚠️  DATABASE_URL not found in .env file');
}

