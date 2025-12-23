const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       required:
 *         - imageUrl
 *       properties:
 *         _id:
 *           type: string
 *         imageUrl:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         link:
 *           type: string
 *         active:
 *           type: boolean
 *         order:
 *           type: number
 */

/**
 * @swagger
 * /api/banners/add:
 *   post:
 *     summary: Add a new banner
 *     tags: [Banners]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               link:
 *                 type: string
 *               active:
 *                 type: boolean
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Banner created
 *       500:
 *         description: Server error
 */
router.post('/add', authMiddleware, upload.single('image'), bannerController.addBanner);

/**
 * @swagger
 * /api/banners/all:
 *   get:
 *     summary: Get all banners (Admin)
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: List of all banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banner'
 */
router.get('/all', bannerController.getBanners);

/**
 * @swagger
 * /api/banners/public:
 *   get:
 *     summary: Get active banners (Public)
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: List of active banners
 */
router.get('/public', bannerController.getPublicBanners);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banners]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner deleted
 */
router.delete('/:id', authMiddleware, bannerController.deleteBanner);

module.exports = router;
