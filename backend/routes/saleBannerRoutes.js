const express = require('express');
const router = express.Router();
const saleBannerController = require('../controllers/saleBannerController');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleBanner:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         imageUrl:
 *           type: string
 *         title:
 *           type: string
 *         link:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /api/sale-banner:
 *   post:
 *     summary: Set the Sale Banner (Replaces existing)
 *     tags: [Sale Banner]
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
 *               link:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: ISO Date string or compatible format
 *               durationHours:
 *                 type: number
 *                 description: Duration hours
 *               durationMinutes:
 *                 type: number
 *                 description: Duration minutes
 *               durationSeconds:
 *                 type: number
 *                 description: Duration seconds
 *     responses:
 *       201:
 *         description: Sale banner set successfully
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, upload.single('image'), saleBannerController.setSaleBanner);

/**
 * @swagger
 * /api/sale-banner:
 *   get:
 *     summary: Get the current Sale Banner
 *     tags: [Sale Banner]
 *     responses:
 *       200:
 *         description: Current sale banner object or null
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleBanner'
 */
router.get('/', saleBannerController.getSaleBanner);

/**
 * @swagger
 * /api/sale-banner:
 *   delete:
 *     summary: Delete the Sale Banner
 *     tags: [Sale Banner]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sale banner deleted
 */
router.delete('/', authMiddleware, saleBannerController.deleteSaleBanner);

module.exports = router;
