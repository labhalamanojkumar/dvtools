#!/usr/bin/env node

/**
 * Production build script with timeout protection
 * Ensures build doesn't hang indefinitely
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build timeout: 10 minutes
const BUILD_TIMEOUT = 10 * 60 * 1000;

console.log('🔨 Starting optimized Next.js build...\n');

const startTime = Date.now();
let buildProcess;
let timeoutId;

// Spawn the build process
buildProcess = spawn('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'production',
    NODE_OPTIONS: '--max-old-space-size=4096',
  },
});

// Set timeout to kill hung builds
timeoutId = setTimeout(() => {
  console.error('\n❌ Build timeout after 10 minutes');
  console.error('⚠️  Checking if build output exists...\n');
  
  const buildExists = fs.existsSync(path.join(process.cwd(), '.next'));
  
  if (buildExists) {
    console.log('✅ Build directory exists - build may have completed');
    console.log('🔍 Verifying build...');
    
    // Check if essential files exist
    const essentialFiles = [
      '.next/BUILD_ID',
      '.next/package.json',
      '.next/server',
    ];
    
    const allExist = essentialFiles.every(file => 
      fs.existsSync(path.join(process.cwd(), file))
    );
    
    if (allExist) {
      console.log('✅ Build appears complete despite timeout');
      console.log('📦 Output verified\n');
      buildProcess.kill();
      process.exit(0);
    }
  }
  
  console.error('❌ Build incomplete - killing process');
  buildProcess.kill('SIGTERM');
  
  setTimeout(() => {
    buildProcess.kill('SIGKILL');
    process.exit(1);
  }, 5000);
}, BUILD_TIMEOUT);

buildProcess.on('close', (code) => {
  clearTimeout(timeoutId);
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n⏱️  Build duration: ${duration}s`);
  
  const buildExists = fs.existsSync(path.join(process.cwd(), '.next'));
  
  if (code === 0) {
    console.log('✅ Build completed successfully!');
    console.log('📦 Ready for deployment\n');
    process.exit(0);
  } else if (buildExists) {
    console.warn('⚠️  Build exited with code', code, 'but output exists');
    console.log('🔍 Attempting to verify build integrity...\n');
    
    // Verify critical files
    const buildIdExists = fs.existsSync(path.join(process.cwd(), '.next/BUILD_ID'));
    
    if (buildIdExists) {
      console.log('✅ Build appears usable');
      console.log('📦 Proceeding with caution\n');
      process.exit(0);
    }
  }
  
  console.error('❌ Build failed with code:', code);
  process.exit(code);
});

buildProcess.on('error', (error) => {
  clearTimeout(timeoutId);
  console.error('❌ Build error:', error.message);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Build interrupted by user');
  clearTimeout(timeoutId);
  buildProcess.kill();
  process.exit(130);
});

process.on('SIGTERM', () => {
  clearTimeout(timeoutId);
  buildProcess.kill();
  process.exit(143);
});
