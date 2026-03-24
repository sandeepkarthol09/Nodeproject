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

exports.getOrder = async (user, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const filter = { user: user.id };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Order.countDocuments(filter),
  ]);

  return {
    orders,
    _meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.deleteOrder = async (id) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new Error("Order not found");
  }

  // Restore stock for each product in the order
  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }

  await Order.findByIdAndDelete(id);
  return order;
};

