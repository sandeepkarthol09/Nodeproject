// services/orderService.js

const Order = require("../model/Order");
const Product = require("../model/Product");

exports.createOrder = async (orderData, user) => {
  const { products: inputProducts, productId, quantity } = orderData;
  let products = inputProducts;

  if (!products && productId) {
    products = [{ productId, quantity: quantity || 1 }];
  }

  if (!products || products.length === 0) {
    throw new Error("No products provided");
  }

  let totalAmount = 0;
  const orderItems = [];

  for (let item of products) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (!product.isActive) {
      throw new Error(`${product.name} is not available`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    // calculate total
    totalAmount += product.price * item.quantity;

    // reduce stock using findByIdAndUpdate to avoid validation issues with existing data
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity }
    });

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
    });
  }

  const order = await Order.create({
    user: user?.id || null, // optional auth
    products: orderItems,
    totalAmount,
  });

  return order;
};

exports.getOrder = async (user) => {
  const orders = await Order.find({ user: user.id })
    .populate("user", "name email")
    .populate("products.product", "name price")
    .sort({ createdAt: -1 });

  return orders;
};

