const userService = require("../services/userService");
const response = require("../utils/responseHandler");
const asyncHandler = require("../middlewares/asyncHandler");

// GET users
exports.getuserlist = asyncHandler(async (req, res) => {
  const { role, id } = req.user; // JWT middleware se

  // Full user list for admin
  if (role === "admin") {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await userService.getAllUsers({ page, limit });

    return response.success(res, "User list fetched successfully", result);
  }

  // for manager only detail
  if (role === "manager") {
    const user = await userService.getUserById(id);
    return response.success(res, "User detail fetched successfully", user);
  }

  // for employee (user) nothing
  return response.success(res, "No data available for this role", []);
});

// CREATE user
exports.createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);

  return response.success(res, "User created successfully", user);
});

// Login user

exports.login = asyncHandler(async (req, res) => {
  const result = await userService.login(req.body);

  return response.success(res, "Login successful", result);
});

// GET user by id
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return response.success(res, "User fetched successfully", user);
});

// UPDATE user
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return response.success(res, "User updated successfully", user);
});

// DELETE user
exports.deleteUserById = asyncHandler(async (req, res) => {
  const user = await userService.deleteUser(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return response.success(res, "User deleted successfully", user);
});

// Forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const token = await userService.forgotPassword(req.body.email);

  return response.success(res, "Reset token generated successfully", { token });
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  await userService.resetPassword(req.body.token, req.body.password);

  return response.success(res, "Password reset successful");
});
