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

exports.getProduct = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await productService.getProduct({ page, limit });

  return response.success(res, "Product fetched successfully", result);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.deleteProduct(id);
  return response.success(res, "Product deleted successfully", product);
});