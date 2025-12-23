const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware'); // Protect product routes if needed

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - mrp
 *         - discount
 *         - discountedPrice
 *         - description
 *         - categories
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the product
 *         title:
 *           type: string
 *           description: The product title
 *         description:
 *           type: string
 *           description: The product description
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: List of categories
 *         mrp:
 *           type: number
 *           description: Maximum Retail Price
 *         discount:
 *           type: number
 *           description: Discount percentage
 *         discountedPrice:
 *           type: number
 *           description: Final price after discount
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs of product images
 *         reviews:
 *           type: array
 *           description: List of reviews
 *         ratings:
 *           type: array
 *           description: List of ratings
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         feature:
 *           type: boolean
 *           description: Is it a featured product?
 *         available:
 *           type: boolean
 *           description: Is the product available?
 */

/**
 * @swagger
 * /api/products/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categories:
 *                 type: string
 *                 description: Comma separated categories
 *               mrp:
 *                 type: number
 *               discount:
 *                 type: number
 *               feature:
 *                 type: boolean
 *               available:
 *                 type: boolean
 *               tags:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       500:
 *         description: Server error
 */
router.post('/add', authMiddleware, upload.array('images', 10), productController.addProduct);

/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: Get all products for frontend
 *     description: Retrieve a list of products with all details including images, reviews, and ratings.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
router.get('/all', productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categories:
 *                 type: string
 *               mrp:
 *                 type: number
 *               discountedPrice:
 *                 type: number
 *               feature:
 *                 type: boolean
 *               available:
 *                 type: boolean
 *               tags:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, upload.array('images', 10), productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
