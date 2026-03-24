// services/product.service.js

const Product = require("../model/Product");

exports.createProduct = async (data) => {
  const { name, description, price, stock, category, image  , createdBy} = data;

  // Basic validation
  if (!name || !description || price == null || stock == null) {
    throw new Error("Required fields missing");
  }

  // Optional: check duplicate product
  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    throw new Error("Product already exists");
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    image,
    createdBy
  });

  return product;
};

exports.getProduct = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(),
  ]);

  return {
    products,
    _meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

exports.updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};