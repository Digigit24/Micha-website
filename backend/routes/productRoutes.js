const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware'); // Protect product routes if needed

// Route to add product with multiple images (max 10)
// Protecting this route so only admins can add products
router.post('/add', authMiddleware, upload.array('images', 10), productController.addProduct);

// Route to get all products (public or protected depends on requirement, keeping public for display)
router.get('/all', productController.getAllProducts);

module.exports = router;
