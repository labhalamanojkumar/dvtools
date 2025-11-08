// PM2 Ecosystem Configuration for Multi-Tool Platform
// This file manages the application processes in production

module.exports = {
  apps: [
    {
      name: 'multi-tool-platform',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '.',
      
      // Process management
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      
      // Production environment
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        WEB_CONCURRENCY: 4,
        UV_THREADPOOL_SIZE: 4,
      },
      
      // Logging configuration
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,
      
      // Advanced features
      kill_timeout: 1600,
      listen_timeout: 1600,
      shutdown_with_message: true,
      
      // Auto restart conditions
      autorestart: true,
      exp_backoff_restart_delay: 100,
      
      // Memory and CPU limits
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_url: 'http://localhost:3000/health',
      health_check_fatal_timeout: 10000,
    },
    
    // Optional: Background job processor
    {
      name: 'job-processor',
      script: './scripts/job-processor.js',
      cwd: '.',
      
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      
      env: {
        NODE_ENV: 'production',
        JOB_TYPE: 'background',
      },
      
      log_file: './logs/job-processor.log',
      out_file: './logs/job-processor-out.log',
      error_file: './logs/job-processor-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart on failure
      restart_delay: 5000,
      max_restarts: 5,
    },
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/multi-tool-platform.git',
      path: '/var/www/multi-tool-platform',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y',
    },
  },
};