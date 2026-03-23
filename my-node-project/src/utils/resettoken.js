const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET } = require('../config/Jwt');

/**
 * Generates a short-lived JWT for password reset.
 * @param {Object} user - The user object (must have _id and email).
 * @returns {string} - Signed JWT reset token.
 */
const generateResetToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, type: 'password_reset' },
    JWT_ACCESS_SECRET,
    { expiresIn: '15m' } // 15 minutes expiry for reset token
  );
};

module.exports = { generateResetToken };
