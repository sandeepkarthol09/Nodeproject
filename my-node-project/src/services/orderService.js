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

exports.getOrder = async (user, { page, limit }) => {
  const skip = (page - 1) * limit;

  const orders = await Order.aggregate([
    {
      $match: { user: user._id },
    },

    { $unwind: "$products" },

    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },

    { $unwind: "$productInfo" },

    {
      $project: {
        _id: 1,
        status: 1,
        totalAmount: 1,
        quantity: "$products.quantity",
        productName: "$productInfo.name",
        price: "$productInfo.price",
        createdAt: 1,
      },
    },

    { $skip: skip },
    { $limit: limit },
  ]);

  return orders;
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

exports.getDashboardStats = async () => {
  const stats = await Order.aggregate([
    {
      $facet: {
        // ✅ Total Revenue
        revenue: [
          { $match: { status: "completed" } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
        ],

        // ✅ Total Orders
        totalOrders: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
        ],

        // ✅ Orders by Status
        statusStats: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],

        // ✅ Top Selling Products
        topProducts: [
          { $match: { status: "completed" } },
          { $unwind: "$products" },
          {
            $group: {
              _id: "$products.product",
              totalSold: { $sum: "$products.quantity" },
            },
          },
          { $sort: { totalSold: -1 } },
          { $limit: 5 },

          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          { $unwind: "$productInfo" },

          {
            $project: {
              name: "$productInfo.name",
              totalSold: 1,
            },
          },
        ],
      },
    },
  ]);

  return {
    revenue: stats[0].revenue[0]?.totalRevenue || 0,
    totalOrders: stats[0].totalOrders[0]?.count || 0,
    statusStats: stats[0].statusStats,
    topProducts: stats[0].topProducts,
  };
};

