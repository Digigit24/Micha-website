const mongoose = require('mongoose');

const saleBannerSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    link: {
        type: String
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for checking active status dynamically
saleBannerSchema.virtual('isActive').get(function () {
    const now = new Date();
    return now >= this.startTime && now <= this.endTime;
});

// Ensure virtuals are included in JSON output
saleBannerSchema.set('toJSON', { virtuals: true });
saleBannerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('SaleBanner', saleBannerSchema);
