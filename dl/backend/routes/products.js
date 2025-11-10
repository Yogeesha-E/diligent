const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Mock products for demo when database is not available
const getMockProducts = () => {
    return [
        {
            _id: "1",
            name: "Wireless Bluetooth Headphones",
            description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
            price: 99.99,
            image: "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Headphones",
            category: "Electronics",
            stock: 50,
            createdAt: new Date()
        },
        {
            _id: "2",
            name: "Smartphone Case",
            description: "Durable protective case for smartphones with shock absorption and wireless charging compatibility.",
            price: 24.99,
            image: "https://via.placeholder.com/300x300/50C878/FFFFFF?text=Phone+Case",
            category: "Accessories",
            stock: 100,
            createdAt: new Date()
        },
        {
            _id: "3",
            name: "Laptop Stand",
            description: "Adjustable aluminum laptop stand for better ergonomics and cooling.",
            price: 49.99,
            image: "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Laptop+Stand",
            category: "Office",
            stock: 30,
            createdAt: new Date()
        },
        {
            _id: "4",
            name: "Wireless Mouse",
            description: "Ergonomic wireless mouse with precision tracking and long battery life.",
            price: 34.99,
            image: "https://via.placeholder.com/300x300/A8E6CF/FFFFFF?text=Mouse",
            category: "Electronics",
            stock: 75,
            createdAt: new Date()
        },
        {
            _id: "5",
            name: "USB-C Cable",
            description: "Fast charging USB-C cable with data transfer capability, 6ft length.",
            price: 14.99,
            image: "https://via.placeholder.com/300x300/FFD93D/FFFFFF?text=USB+Cable",
            category: "Accessories",
            stock: 200,
            createdAt: new Date()
        },
        {
            _id: "6",
            name: "Desk Organizer",
            description: "Multi-compartment desk organizer to keep your workspace tidy and efficient.",
            price: 39.99,
            image: "https://via.placeholder.com/300x300/B19CD9/FFFFFF?text=Organizer",
            category: "Office",
            stock: 45,
            createdAt: new Date()
        }
    ];
};

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        // If database not connected, return mock data
        if (global.dbConnected === false) {
            return res.json({
                success: true,
                count: 6,
                data: getMockProducts()
            });
        }
        const { category, search, sort, limit = 50 } = req.query;
        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search in name and description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let productsQuery = Product.find(query);

        // Sort products
        if (sort) {
            switch (sort) {
                case 'price-low':
                    productsQuery = productsQuery.sort({ price: 1 });
                    break;
                case 'price-high':
                    productsQuery = productsQuery.sort({ price: -1 });
                    break;
                case 'name':
                    productsQuery = productsQuery.sort({ name: 1 });
                    break;
                case 'newest':
                    productsQuery = productsQuery.sort({ createdAt: -1 });
                    break;
                default:
                    productsQuery = productsQuery.sort({ createdAt: -1 });
            }
        }

        const products = await productsQuery.limit(parseInt(limit));

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // If database not connected, return mock data
        if (global.dbConnected === false) {
            const mockProducts = getMockProducts();
            const product = mockProducts.find(p => p._id === req.params.id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            return res.json({
                success: true,
                data: product
            });
        }
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({ category: { $regex: category, $options: 'i' } });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @route   POST /api/products
// @desc    Create a new product (Admin only - for future implementation)
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { name, description, price, image, category, stock } = req.body;

        const product = new Product({
            name,
            description,
            price,
            image,
            category,
            stock
        });

        const savedProduct = await product.save();

        res.status(201).json({
            success: true,
            data: savedProduct,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('Error creating product:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

module.exports = router;