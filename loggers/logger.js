// Import the Winston library for logs, transports, & formats
const winston = require("winston");
// const Logsene = require('winston-logsene');
const path = require("path");

// Configure logging options
const options = {
  // Logs from console...
  console: {
    // Set minimal log level for console output
    level: "debug",
    // When true, Winston handles & logs any exceptions
    handleExceptions: true,
    // When false, logs are plain text, true is in JSON
    json: false,
    // Adds color to make logs more readable
    colorize: true
  },
  // ...are sent to Logsene, or similar service
  logsene: {
    // Get token from env variable for auth to use Logsene
    token: process.env.LOGS_TOKEN,
    // Set minimal log level to send to Logsene
    level: "debug",
    // Represents the type of logs being sent
    type: "app_logs",
    // Logsene endpoint, token & logs are sent here to be processed
    url: "https://logsene-receiver.sematext.com/_bulk"
  },
  file: {
    level: "debug", 
    // Path to log file
    filename: path.join(__dirname, "../logs/debug.log"),
    handleExceptions: true, 
    json: true, 
    // Max size of each log file is 5MB
    maxsize: 5242880, 
    // 5 log files can be created, then deletes oldest 
    maxFiles: 5
  }
}

// const logger = winston.createLogger({
//  levels: winston.config.npm.levels,
//  transports: [
//  new winston.transports.Console(options.console),
//  new Logsene(options.logsene)
//  ],
//  exitOnError: false
// })

// Create a new logger instance with Console and HTTP transport
const logger = winston.createLogger({
  // Set log levels to npm defaults (error, warn, info, verbose, debug, & silly)
  levels: winston.config.npm.levels,
  // Transports define where logs are sent
  transports: [
    // Logs are sent to console, using options.console defined earlier
    new winston.transports.Console(options.console), // Console transport
    // Logs are sent over http to Logsene server below
    new winston.transports.Http({
      host: "logsene-receiver.sematext.com", // Logsense server
      // Path w/token for logs to be processed
      path: `/_bulk/${options.logsene.token}`, // Path to send logs, with the token
      // Secures the connection with HTTPS
      ssl: true, 
      // Set the logging level
      level: options.logsene.level, 
    }),
    // Set up file transport for local logs
    new winston.transports.File(options.file)
  ],
  // App will not automatically terminate when an error is logged
  exitOnError: false, // Do not exit on handled exceptions
});

module.exports = logger