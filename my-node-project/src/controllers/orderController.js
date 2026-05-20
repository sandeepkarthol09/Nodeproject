const asyncHandler = require("../middlewares/asyncHandler");
const Order = require("../model/Order");
const orderService = require("../services/orderService");
const responseHandler = require("../utils/responseHandler");

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user);

  return responseHandler.success(res, "Order created successfully", order);
});

exports.getOrder = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await orderService.getOrder(req.user, { page, limit });

  return responseHandler.success(res, "Order fetched successfully", result);
});

exports.deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await orderService.deleteOrder(id);

  return responseHandler.success(res, "Order deleted successfully", order);
});

exports.cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const order = await orderService.cancelOrder(id);
    return responseHandler.success(res, "Order cancelled successfully", order);
  } catch (error) {
    if (error.message === "Order not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === "Order is already cancelled") {
      return res.status(400).json({ success: false, message: error.message });
    }
    throw error;
  }
});


exports.getDashboard = asyncHandler(async (req, res) => {
  const data = await orderService.getDashboardStats();

  return responseHandler.success(
    res,
    "Dashboard data fetched",
    data
  );
});