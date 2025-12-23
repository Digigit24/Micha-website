const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

exports.addBanner = async (req, res) => {
    try {
        const { title, description, link, active, order } = req.body;

        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else {
            return res.status(400).json({ message: 'Banner image is required' });
        }

        const newBanner = new Banner({
            imageUrl,
            title,
            description,
            link,
            active: active === 'true' || active === true,
            order: parseInt(order) || 0
        });

        await newBanner.save();
        res.status(201).json({ message: 'Banner added successfully', banner: newBanner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json(banners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPublicBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ active: true }).sort({ order: 1, createdAt: -1 });
        res.status(200).json(banners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findByIdAndDelete(id);

        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Optional: Delete image file
        // const filePath = path.join(__dirname, '..', banner.imageUrl);
        // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
