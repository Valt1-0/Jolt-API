const {
  AuthorizeError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
  ConflictError,
  APIError,
} = require("./errors");
const { logger } = require("../logger");

const handleErrorWithLogger = (error, req, res, next) => {
  let reportError = true;
  let status = 500;
  let data = { message: error.message };

  // Skip common / known errors
  [
    NotFoundError,
    ValidationError,
    AuthorizeError,
    ForbiddenError,
    ConflictError,
  ].forEach((typeOfError) => {
    if (error instanceof typeOfError) {
      reportError = false;
      status = error.status;
      data = { error: error.message, message: error.message };
    }
  });

  if (reportError) {
    // Error reporting tools implementation eg: Cloudwatch, Sentry, etc.
    logger.error(error);
  } else {
    logger.warn(error); // Ignore common errors caused by user
  }

  return res.status(status).json(data);
};

const handleUncaughtException = async (error) => {
  // Error report / monitoring tools
  logger.error(error);
  // Recover
  process.exit(1);
};

module.exports = {
  handleErrorWithLogger,
  handleUncaughtException,
};
