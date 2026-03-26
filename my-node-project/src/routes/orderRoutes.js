// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");


/**
 * @swagger
 * /orders/createorder:
 *   post:
 *     summary: Create a new order
 *     description: Create order for logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *               - totalAmount
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderProduct'
 *               totalAmount:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                 totalAmount: 1500
 *                 status: pending
 *                 createdAt: 2026-03-23T10:00:00.000Z
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/createorder", protect,  orderController.createOrder);

/**
 * @swagger
 * /orders/getorder:
 *   get:
 *     summary: Get all orders (with pagination)
 *     description: Fetch logged-in user's orders with pagination
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of orders per page (default 10)
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Order fetched successfully
 *               data:
 *                 orders:
 *                   - _id: 65f1abc1234567890abcd999
 *                     user:
 *                       name: John Doe
 *                       email: john@example.com
 *                     products:
 *                       - product:
 *                           name: iPhone 14
 *                           price: 75000
 *                         quantity: 2
 *                     totalAmount: 150000
 *                     status: pending
 *                     createdAt: 2026-03-23T10:00:00.000Z
 *                 _meta:
 *                   total: 25
 *                   page: 1
 *                   limit: 10
 *                   totalPages: 3
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/getorder", protect,  orderController.getOrder);

/**
 * @swagger
 * /orders/deleteorder/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/deleteorder/:id", protect, orderController.deleteOrder);

/**
 * @swagger
 * /orders/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       totalRevenue:
 *                         type: number
 *                       totalOrders:
 *                         type: number
 *                 topProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       totalSold:
 *                         type: number
 *                 dailySales:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "2026-03-25"
 *                       revenue:
 *                         type: number
 */
router.get("/dashboard", protect, orderController.getDashboard);

module.exports = router;