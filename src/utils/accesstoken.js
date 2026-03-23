const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET, ACCESS_TOKEN_EXPIRES_IN } = require('../config/Jwt');

/**
 * Generates a JWT access token for the given user.
 * @param {Object} user - The user object (must have _id and email).
 * @returns {string} - Signed JWT access token.
 */
const generateAccessToken = (user) => {
  return jwt.sign(
     { id: user._id, email: user.email , roleId : user.roleId },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

module.exports = { generateAccessToken };
