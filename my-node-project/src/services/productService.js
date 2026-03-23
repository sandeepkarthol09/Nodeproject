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