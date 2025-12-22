const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');

const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'adminFrontend'))); // Serve frontend files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// Database Connection
mongoose.connect('mongodb://localhost:27017/micha-website')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Swagger Configuration
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Admin API',
            version: '1.0.0',
            description: 'A simple Express Admin API',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// Fallback for frontend
app.get(/(.*)/, (req, res) => {
    // Check if request is for API
    if (req.path.startsWith('/api/')) { // Changed to /api/ to avoid matching /api-docs
        return res.status(404).json({ message: 'API route not found' });
    }
    // Ideally serve index.html or handle navigation, but since we have specific html files:
    // We let the static middleware handle it.
    // If we want a default entry:
    res.sendFile(path.join(__dirname, 'adminFrontend/login.html'));
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});