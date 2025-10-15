const os = require('os')
const hostname = os.hostname()  // Get the hostname once and store it in a variable

module.exports = {
  apps: [
    {
      name: 'whatsapp-bot',
      script: './dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      // Correctly concatenate the hostname to the log file names
      error_file: `./pm2-logs/error-${hostname}.log`,
      out_file: `./pm2-logs/out-${hostname}.log`,
      log_file: `./pm2-logs/combined-${hostname}.log`,
      merge_logs: false,
    }
  ]
}
