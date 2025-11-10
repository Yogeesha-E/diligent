const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-key', {
        expiresIn: '7d'
    });
};

// Mock users for when database is not connected
const getMockUsers = () => [
    {
        _id: "user1",
        name: "John Doe",
        email: "john@example.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6TK0.WrKyG", // password: 123456
        avatar: "",
        role: "user",
        isVerified: true,
        createdAt: new Date()
    },
    {
        _id: "admin1", 
        name: "Admin User",
        email: "admin@example.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6TK0.WrKyG", // password: 123456
        avatar: "",
        role: "admin",
        isVerified: true,
        createdAt: new Date()
    }
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Handle mock data when database not connected
        if (global.dbConnected === false) {
            const mockUsers = getMockUsers();
            const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email'
                });
            }

            const newUser = {
                _id: `user_${Date.now()}`,
                name,
                email: email.toLowerCase(),
                role: 'user',
                isVerified: true,
                createdAt: new Date()
            };

            const token = generateToken(newUser._id);

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: newUser,
                    token
                }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
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
            message: 'Server error during registration'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Handle mock data when database not connected
        if (global.dbConnected === false) {
            const bcrypt = require('bcryptjs');
            const mockUsers = getMockUsers();
            const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            const token = generateToken(user._id);
            const { password: pwd, ...userWithoutPassword } = user;

            return res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userWithoutPassword,
                    token
                }
            });
        }

        // Check if user exists and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

        // Handle mock data when database not connected
        if (global.dbConnected === false) {
            const mockUsers = getMockUsers();
            const user = mockUsers.find(u => u._id === decoded.id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const { password, ...userWithoutPassword } = user;
            return res.json({
                success: true,
                data: userWithoutPassword
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user.getPublicProfile()
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;