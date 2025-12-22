const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
    try {
        const { title, category, mrp, discountedPrice, tags } = req.body;

        // Process uploaded files
        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

        // Process tags (assuming comma separated string from form)
        const tagList = tags ? tags.split(',').map(tag => tag.trim()) : [];

        const newProduct = new Product({
            title,
            category,
            mrp,
            discountedPrice,
            images: imagePaths,
            tags: tagList
        });

        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
