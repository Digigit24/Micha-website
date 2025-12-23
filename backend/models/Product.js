const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categories: [{
        type: String,
        required: true
    }],
    mrp: {
        type: Number,
        required: true
    },
    discount: {
        type: Number, // Percentage
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    feature: {
        type: Boolean,
        default: false
    },
    available: {
        type: Boolean,
        default: true
    },
    // We keep images here as well for easier fetching, even though we have an Image model
    images: [{
        type: String
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
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
