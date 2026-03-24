const asyncHandler = require("../middlewares/asyncHandler");
const Order = require("../model/Order");
const orderService = require("../services/orderService");
const responseHandler = require("../utils/responseHandler");

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user);

  return responseHandler.success(res, "Order created successfully", order);
});

exports.getOrder = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrder(req.user);

  return responseHandler.success(res, "Order fetched successfully", orders);
});
