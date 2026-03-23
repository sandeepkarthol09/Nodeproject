// controllers/product.controller.js
const asyncHandler = require("../middlewares/asyncHandler");
const response = require("../utils/responseHandler");
const productService = require("../services/productService");

exports.createProduct = asyncHandler(async (req, res) => {
 const product = await productService.createProduct({
    ...req.body,
    createdBy: req.user.id, 
  });
  return response.success(res, "Product created successfully", product);
});