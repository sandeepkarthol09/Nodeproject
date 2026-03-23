const User = require("../model/User");
const { generateAccessToken } = require("../utils/accesstoken");
const { generateRefreshToken } = require("../utils/refreshtoken");
const { generateResetToken } = require("../utils/resettoken");
const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET } = require("../config/Jwt");

exports.getAllUsers = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  return {
    users,
    _meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

exports.createUser = async (data) => {
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
    gender: data.gender,
    role: data.role || "employee",
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

exports.login = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    const error = new Error("Invalid email");
    error.statusCode = 400; // client error
    throw error;
  }

  const isPasswordValid = await user.comparePassword(data.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid password");
    error.statusCode = 400; // client error
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.updateUser = async (id, data) => {
  // data may contain any subset of fields: name, email, phone, gender
  return await User.findByIdAndUpdate(
    id,
    data, // update all fields present in data
    {
      new: true, // return the updated document
      runValidators: true, // ensure schema validations are applied
    },
  );
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User with this email does not exist");
    error.statusCode = 404;
    throw error;
  }

  // Generate reset token
  const resetToken = generateResetToken(user);

  // Set token and expiry in DB
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes from now

  await user.save({ validateBeforeSave: false });

  return resetToken;
};

exports.resetPassword = async (token, newPassword) => {
  // 1. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (err) {
    const error = new Error("Token is invalid or has expired");
    error.statusCode = 400;
    throw error;
  }

  // 2. Find user with that token and expiry date
  const user = await User.findOne({
    _id: decoded.id,
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    const error = new Error("Token is invalid or has expired");
    error.statusCode = 400;
    throw error;
  }

  // 3. Update password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return user;
};
