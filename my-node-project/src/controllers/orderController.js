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
