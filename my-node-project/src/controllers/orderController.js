const orderService = require("../services/orderService");
const responseHandler = require("../utils/responseHandler");

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body, req.user);

    return responseHandler.success(res, "Order created successfully", order);
  } catch (error) {
    return responseHandler.serverError(res, error.message);
  }
};