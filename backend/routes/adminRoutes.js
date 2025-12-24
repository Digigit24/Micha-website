const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/admin/create:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - username
 *                - email
 *                - password
 *             properties:
 *                username:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *     responses:
 *       201:
 *         description: The admin was successfully created
 *       400:
 *         description: Admin already exists
 *       500:
 *         description: Some server error
 */
router.post('/create', adminController.createAdmin);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                - identifier
 *                - password
 *             properties:
 *                identifier:
 *                  type: string
 *                password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Some server error
 */
router.post('/login',(req,res,next)=>{console.log(req); next();}, adminController.loginAdmin);

router.post('/logout', adminController.logoutAdmin);

router.get('/check-auth', authMiddleware, adminController.checkAuth);

module.exports = router;
