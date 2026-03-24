const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /products/createproduct:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 */
router.post("/createproduct", protect, productController.createProduct);

/**
 * @swagger
 * /products/getproduct:
 *   get:
 *     summary: Get all products (with pagination)
 *     description: Fetch paginated list of products with optional search
 *     tags: [Products]
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
 *         description: Number of products per page (default 10)
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Product fetched successfully
 *               data:
 *                 products:
 *                   - _id: 65f1abc1234567890abcd123
 *                     name: iPhone 14
 *                     price: 75000
 *                     stock: 10
 *                     createdAt: 2026-03-23T10:00:00.000Z
 *                 _meta:
 *                   total: 50
 *                   page: 1
 *                   limit: 10
 *                   totalPages: 5
 *       400:
 *         description: Bad request
 */
router.get("/getproduct", protect, productController.getProduct);

/**
 * @swagger
 * /products/deleteproduct/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Bad request
 */
router.delete("/deleteproduct/:id", protect, productController.deleteProduct);

module.exports = router;