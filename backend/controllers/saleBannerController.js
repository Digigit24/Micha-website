const SaleBanner = require('../models/SaleBanner');
const fs = require('fs');
const path = require('path');

exports.setSaleBanner = async (req, res) => {
    try {
        const { title, link, startTime, durationHours, durationMinutes, durationSeconds } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Banner image is required' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        // Calculate start and end times
        let start;
        if (startTime && startTime !== 'undefined') {
            start = new Date(startTime);
        } else {
            return res.status(400).json({ message: 'Start time is required' });
        }

        if (isNaN(start.getTime())) {
            return res.status(400).json({ message: 'Invalid start time format' });
        }

        const hours = parseInt(durationHours) || 0;
        const minutes = parseInt(durationMinutes) || 0;
        const seconds = parseInt(durationSeconds) || 0;

        const durationMs = (hours * 3600 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
        const end = new Date(start.getTime() + durationMs);

        // Remove existing sale banner (Only one allowed)
        await SaleBanner.deleteMany({});

        const newSaleBanner = new SaleBanner({
            imageUrl,
            title,
            link,
            startTime: start,
            endTime: end
        });

        await newSaleBanner.save();
        res.status(201).json({ message: 'Sale banner set successfully', banner: newSaleBanner });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getSaleBanner = async (req, res) => {
    try {
        const banner = await SaleBanner.findOne();
        if (!banner) {
            return res.status(200).json(null); // Return null if no banner set
        }
        res.status(200).json(banner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteSaleBanner = async (req, res) => {
    try {
        await SaleBanner.deleteMany({});
        res.status(200).json({ message: 'Sale banner deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
