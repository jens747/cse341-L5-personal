// Set up loggers
const logger = require("../loggers/logger");
const { logError, isOperationalError } = require("./errorHandler");

// Catch all uncaught exceptions
const catchUncaughtExceptions = () => {
  return process.on("uncaughtException", (error) => {
    // Log the details of the error
    // logError(error);
    logger.error(error);
  
    if (!isOperationalError(error)) {
      // If the error is not operational, shut down the app gracefully
      console.error('Shutting down due to an uncaught exception');
      process.exit(1); // Exit the process with a failure code
    }
  });
}

module.exports = catchUncaughtExceptions;