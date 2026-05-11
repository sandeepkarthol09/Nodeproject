// routes/orderRoutes.js

const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /orders/createorder:
 *   post:
 *     summary: Create a new order (Naya order create karein)
 *     description: |
 *       Aap do tarike se order create kar sakte hain:
 *       1. **Multiple Products:** Ek sath bahut saare items bhejne ke liye 'products' array ka use karein.
 *       2. **Single Product:** Agar sirf ek item mangwana hai, toh seedha 'productId' aur 'quantity' bhej dein.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - required: [products]
 *                 properties:
 *                   products:
 *                     type: array
 *                     description: List of products (Multiple items ke liye)
 *                     items:
 *                       type: object
 *                       required: [productId, quantity]
 *                       properties:
 *                         productId:
 *                           type: string
 *                           example: 65f1abc1234567890abcd123
 *                         quantity:
 *                           type: number
 *                           example: 2
 *               - required: [productId]
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: Single product ID (Sirf ek item ke liye)
 *                     example: 65f1abc1234567890abcd123
 *                   quantity:
 *                     type: number
 *                     description: Quantity (Kitne piece chahiye)
 *                     example: 1
 *     responses:
 *       201:
 *         description: Order created successfully (Order safaltapurvak ban gaya)
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Order created successfully
 *               data:
 *                 _id: 65f1abc1234567890abcd999
 *                 user: 65f1abc1234567890abcd111
 *                 products:
 *                   - product: 65f1abc1234567890abcd123
 *                     quantity: 2
 *                     image: https://example.com/uploads/iphone14.png
 *                 totalAmount: 150000
 *                 status: pending
 *                 createdAt: 2026-03-23T10:00:00.000Z
 *       400:
 *         description: Bad request (Data sahi nahi hai)
 *       401:
 *         description: Unauthorized (Login zaroori hai)
 */
router.post("/createorder", protect, orderController.createOrder);

/**
 * @swagger
 * /orders/getorder:
 *   get:
 *     summary: Get all orders (Orders ki list nikaalein)
 *     description: Fetch logged-in user's orders with pagination (Login kiye huye user ke orders ki list pagination ke sath)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (Konse page ka data chahiye)
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of orders per page (Ek page par kitne orders dikhane hain)
 *
 *     responses:
 *       200:
 *         description: Orders fetched successfully (Orders mil gaye)
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Orders fetched successfully
 *               data:
 *                 - _id: 65f1abc1234567890abcd999
 *                   status: pending
 *                   totalAmount: 150000
 *                   quantity: 2
 *                   productName: iPhone 14
 *                   price: 75000
 *                   image: https://example.com/uploads/iphone14.png
 *                   createdAt: 2026-03-23T10:00:00.000Z
 *       401:
 *         description: Unauthorized (Login zaroori hai)
 *       500:
 *         description: Server error (Kuch gadbad ho gayi)
 */
router.get("/getorder", protect, orderController.getOrder);

/**
 * @swagger
 * /orders/deleteorder/{id}:
 *   delete:
 *     summary: Delete an order by ID (Order delete karein)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID (Jo order delete karna hai uski ID)
 *
 *     responses:
 *       200:
 *         description: Order deleted successfully (Order delete ho gaya)
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Order deleted successfully
 *
 *       404:
 *         description: Order not found (Order nahi mila)
 *
 *       401:
 *         description: Unauthorized (Login zaroori hai)
 */
router.delete("/deleteorder/:id", protect, orderController.deleteOrder);

/**
 * @swagger
 * /orders/dashboard:
 *   get:
 *     summary: Get dashboard statistics (Dashboard ka data nikaalein)
 *     description: Total revenue, orders and status stats (Kul kamayi aur orders ki jaankari)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully (Dashboard data mil gaya)
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Dashboard fetched successfully
 *               data:
 *                 revenue: 500000
 *                 totalOrders: 120
 *
 *                 statusStats:
 *                   - _id: pending
 *                     count: 20
 *
 *                   - _id: completed
 *                     count: 80
 *
 *                   - _id: cancelled
 *                     count: 20
 *
 *                 topProducts:
 *                   - name: iPhone 14
 *                     image: https://example.com/uploads/iphone14.png
 *                     totalSold: 40
 *
 *                   - name: Samsung S24
 *                     image: https://example.com/uploads/s24.png
 *                     totalSold: 25
 *
 *       401:
 *         description: Unauthorized (Login zaroori hai)
 */
router.get("/dashboard", protect, orderController.getDashboard);

module.exports = router;
