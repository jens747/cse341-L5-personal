// Imports logger module, uses Winston to set up logs
const logger = require("../loggers/logger");
// Import custom baseError class
const BaseError = require("./baseError");

// Defines a helper function to log errors
function logError (err) {
  // Calls the error method from logger
  logger.error(err);
}

// Express error-handling middleware, logs err & passes to next one
function logErrorMiddleware (err, req, res, next) {
  // Calls logError function
  logError(err);
  // Pass error to next error-handling middleware in chain
  // Express ultimately sends response back to the client
  next(err);
}

// Defines a function that sends error response to the client
function returnError (err, req, res, next) {
  // Sends provided status code or code 500 if none provided
  // ie, 404 for "Not Found", 400 for "Bad Request", etc.
  res.status(err.statusCode || 500).send(err.message);
}

// Checks if error is cause by a known condition
// ie: invalid input, network issues, etc.
function isOperationalError(error) {
  // Checks if error is an instance of BaseError.
  // Helps to differentiate between operational and programmer errors.
  if (error instanceof BaseError) {
    // Returns true is error is operationa. Allows app to handle
    // Operational errors gracefully
    return error.isOperational;
  }
  return false;
}

module.exports = {
  logError,
  logErrorMiddleware,
  returnError,
  isOperationalError
}