const response = require("../utils/responseHandler");
const logger = require("../config/logger");

const errorMiddleware = (err, req, res, next) => {
  logger.error(err);

  if (err.name === "ValidationError") {
    return response.badRequest(res, err.message);
  }

  if (err.statusCode === 400) {
    return response.badRequest(res, err.message);
  }

  if (err.statusCode === 404) {
    return response.notFound(res, err.message);
  }

  if (err.statusCode === 401) {
    return response.unauthorized(res, err.message);
  }

  if (err.statusCode === 403) {
    return response.forbidden(res, err.message);
  }

  return response.serverError(res, err.message);
};

module.exports = errorMiddleware;