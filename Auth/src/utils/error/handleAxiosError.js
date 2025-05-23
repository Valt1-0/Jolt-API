const utils = require('./errors');
function handleAxiosError(error) {
  if (error.response) {
    switch (error.response.status) {
      case 404:
        throw new utils.NotFoundError(
          error.response.data.message || "not found"
        );
        case 400:
        throw new utils.ValidationError(
          error.response.data.message || "bad request"
        );
      case 401:
        throw new utils.AuthorizeError(
          error.response.data.message ||  "Unauthorized access"
        );
      case 403:
        throw new utils.ForbiddenError(
          error.response.data.message || "Access denied"
        );
      case 409:
        throw new utils.ConflictError(
          error.response.data.message || "Already exists"
        );
      default:
        throw new utils.APIError(error.response.data.message || "Error occurred"); 
    }
  } else {
    throw new utils.APIError(error.message || "An unknown error occurred");
  }
}

module.exports = handleAxiosError;
