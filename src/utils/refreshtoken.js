const jwt = require('jsonwebtoken');
const { JWT_REFRESH_SECRET, REFRESH_TOKEN_EXPIRES_IN } = require('../config/Jwt');

/**
 * Generates a JWT refresh token for the given user.
 * @param {Object} user - The user object (must have _id and email).
 * @returns {string} - Signed JWT refresh token.
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email , roleId : user.roleId },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

module.exports = { generateRefreshToken };
