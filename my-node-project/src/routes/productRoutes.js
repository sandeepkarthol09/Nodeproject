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
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 */
router.get("/getproduct", protect, productController.getProduct);


module.exports = router;