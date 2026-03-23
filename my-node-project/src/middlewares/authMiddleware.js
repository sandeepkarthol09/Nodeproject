const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../model/User');
const { JWT_ACCESS_SECRET } = require('../config/Jwt');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith('bearer')
  ) {
    // Extract token, handling potential double "Bearer" or extra spaces
    token = req.headers.authorization
      .replace(/^bearer\s+/i, '')
      .replace(/^bearer\s+/i, '')
      .trim();
  }

  if (!token) {
    const error = new Error('No authentication token provided. Please log in.');
    error.statusCode = 401;
    throw error;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      const error = new Error('The user belonging to this token no longer exists.');
      error.statusCode = 401;
      throw error;
    }

    next();
  } catch (err) {
    let message = 'Not authorized to access this route';
    
    if (err.name === 'TokenExpiredError') {
      message = 'Your session has expired. Please log in again.';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid or malformed authentication token. Please check your credentials.';
    }

    const error = new Error(message);
    error.statusCode = 401;
    throw error;
  }
});

// 🔒 Restrict access based on roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(`Role (${req.user.role}) is not authorized to access this resource`);
      error.statusCode = 403;
      throw error;
    }
    next();
  };
};
