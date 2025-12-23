const Product = require('../models/Product');
const Image = require('../models/Image');
const Review = require('../models/Review');
const Rating = require('../models/Rating');

exports.addProduct = async (req, res) => {
    try {
        const { title, description, categories, mrp, discountedPrice, feature, available, tags } = req.body;

        // Calculate discount percentage
        const mrpValue = parseFloat(mrp);
        const priceValue = parseFloat(discountedPrice);

        let discountPercentage = 0;
        if (mrpValue > 0 && priceValue < mrpValue) {
            discountPercentage = ((mrpValue - priceValue) / mrpValue) * 100;
        }

        // Process uploaded files
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        }

        // Process categories and tags (assuming comma separated string from form)
        const categoryList = categories ? categories.split(',').map(cat => cat.trim()) : [];
        const tagList = tags ? tags.split(',').map(tag => tag.trim()) : [];

        const newProduct = new Product({
            title,
            description,
            categories: categoryList,
            mrp: mrpValue,
            discount: parseFloat(discountPercentage.toFixed(2)), // Store with 2 decimal places
            discountedPrice: priceValue,
            feature: feature === 'true' || feature === true, // Handle string 'true' from form data
            available: available === 'true' || available === true, // Handle string 'true'
            images: imagePaths, // Store in Product for easy access
            tags: tagList,
            reviews: [],
            ratings: []
        });

        const savedProduct = await newProduct.save();

        // Create Image documents as requested
        if (imagePaths.length > 0) {
            const imageDocs = imagePaths.map(path => ({
                productId: savedProduct._id,
                url: path
            }));
            await Image.insertMany(imageDocs);
        }

        res.status(201).json({ message: 'Product added successfully', product: savedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('reviews')
            .populate('ratings')
            .sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, categories, mrp, discountedPrice, feature, available, tags } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate discount percentage if price changed
        const mrpValue = parseFloat(mrp);
        const priceValue = parseFloat(discountedPrice);
        let discountPercentage = 0;
        if (mrpValue > 0 && priceValue < mrpValue) {
            discountPercentage = ((mrpValue - priceValue) / mrpValue) * 100;
        }

        // Process new uploaded files (append to existing or replace logic can be added, here we append)
        let newImagePaths = [];
        if (req.files && req.files.length > 0) {
            newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
        }

        // Combine existing images with new ones (if any logic needed to delete old ones, it would be here)
        // For simplicity, we are appending new images. 
        // If the user wants to DELETE images, that would typically be a separate API call or a specific field in update.
        const updatedImages = [...product.images, ...newImagePaths];

        const categoryList = categories ? categories.split(',').map(cat => cat.trim()) : [];
        const tagList = tags ? tags.split(',').map(tag => tag.trim()) : [];

        product.title = title || product.title;
        product.description = description || product.description;
        product.categories = categories ? categoryList : product.categories;
        product.mrp = mrpValue || product.mrp;
        product.discountedPrice = priceValue || product.discountedPrice;
        product.discount = parseFloat(discountPercentage.toFixed(2));
        product.feature = (feature === 'true' || feature === true);
        product.available = (available === 'true' || available === true);
        product.tags = tags ? tagList : product.tags;
        product.images = updatedImages;

        const savedProduct = await product.save();

        // Create new Image documents for the new uploads
        if (newImagePaths.length > 0) {
            const imageDocs = newImagePaths.map(path => ({
                productId: savedProduct._id,
                url: path
            }));
            await Image.insertMany(imageDocs);
        }

        res.status(200).json({ message: 'Product updated successfully', product: savedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Optional: Delete associated Image documents
        await Image.deleteMany({ productId: id });

        // Optional: Delete associated reviews/ratings
        await Review.deleteMany({ productId: id });
        await Rating.deleteMany({ productId: id });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
