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

module.exports = router;