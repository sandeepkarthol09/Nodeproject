const JWT_ACCESS_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH || 'fallback_refresh_secret_key';

const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

module.exports = {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
};