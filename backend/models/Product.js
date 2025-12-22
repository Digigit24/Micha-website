const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    images: [{
        type: String, // Store paths/filenames
        required: true
    }],
    tags: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
