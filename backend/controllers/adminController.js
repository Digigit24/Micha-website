const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.createAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email or username already exists' });
        }

        const newAdmin = new Admin({
            username,
            email,
            password
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        console.log(req)
        const { identifier, password } = req.body; // identifier can be email or username

        // Find admin by email or username
        const admin = await Admin.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1h' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({
            message: 'Login successful',
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.logoutAdmin = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

exports.checkAuth = (req, res) => {
    // If middleware passes, user is authenticated
    res.status(200).json({ isAuthenticated: true, user: req.user });
};
