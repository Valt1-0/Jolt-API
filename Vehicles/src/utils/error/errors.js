const { STATUS_CODES } = require("./statusCodes");

class BaseError extends Error {
  constructor(name, status, description) {
    super(description);
    this.name = name;
    this.status = status;
    this.message = description;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

// 500 Internal Error
class APIError extends BaseError {
  constructor(description = "api error") {
    super(
      "api internal server error",
      STATUS_CODES.INTERNAL_ERROR,
      description
    );
  }
}

class OutOfStockError extends BaseError {
  constructor(description = "product out of stock") {
    super("out of stock", STATUS_CODES.BAD_REQUEST, description);
  }
}

// 400 Validation Error
class ValidationError extends BaseError {
  constructor(description = "bad request") {
    super("bad request", STATUS_CODES.BAD_REQUEST, description);
  }
}

// 401 Unauthorized error
class AuthorizeError extends BaseError {
  constructor(description = "unauthorized") {
    super("unauthorized", STATUS_CODES.UN_AUTHORISED, description);
  }
}

// 403 Forbidden error
class ForbiddenError extends BaseError {
  constructor(description = "access denied") {
    super("access denied", STATUS_CODES.FORBIDDEN, description);
  }
}

// 404 Not Found
class NotFoundError extends BaseError {
  constructor(description = "not found") {
    super("not found", STATUS_CODES.NOT_FOUND, description);
  }
}

// 409 Conflict
class ConflictError extends BaseError {
  constructor(description = "conflict") {
    super("conflict", STATUS_CODES.CONFLICT, description);
  }
}

module.exports = {
  BaseError,
  APIError,
  ValidationError,
  AuthorizeError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  OutOfStockError,
};
