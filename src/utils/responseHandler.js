exports.success = (res, message, data = []) => {
  return res.status(200).json({
    status: 200,
    message,
    data
  });
};

exports.badRequest = (res, message) => {
  return res.status(400).json({
    status: 400,
    message
  });
};

exports.notFound = (res, message) => {
  return res.status(404).json({
    status: 404,
    message
  });
};

exports.unauthorized = (res, message) => {
  return res.status(401).json({
    status: 401,
    message
  });
};

exports.forbidden = (res, message) => {
  return res.status(403).json({
    status: 403,
    message
  });
};

exports.serverError = (res, message = "Internal Server Error") => {
  return res.status(500).json({
    status: 500,
    message
  });
};