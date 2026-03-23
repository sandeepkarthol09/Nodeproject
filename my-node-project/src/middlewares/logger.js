const logger = require("../config/logger");

function requestLogger(req, res, next) {
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });

  next();
}

module.exports = requestLogger;