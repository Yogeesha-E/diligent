const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET /api/cart
// @desc    Get all cart items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const sessionId = req.query.sessionId || 'default_session';
        const cartItems = await Cart.find({ sessionId }).populate('productId');

        const total = await Cart.getCartTotal(sessionId);
        const itemCount = await Cart.getCartItemCount(sessionId);

        res.json({
            success: true,
            count: cartItems.length,
            data: cartItems,
            summary: {
                total: total.toFixed(2),
                itemCount
            }
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { productId, quantity = 1, sessionId = 'default_session' } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if product is in stock
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        // Check if item already exists in cart
        const existingCartItem = await Cart.findOne({ productId, sessionId });

        if (existingCartItem) {
            // Update quantity
            const newQuantity = existingCartItem.quantity + quantity;
            
            if (product.stock < newQuantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock'
                });
            }

            existingCartItem.quantity = newQuantity;
            await existingCartItem.save();

            res.json({
                success: true,
                data: existingCartItem,
                message: 'Cart updated successfully'
            });
        } else {
            // Create new cart item
            const cartItem = new Cart({
                productId,
                name: product.name,
                price: product.price,
                quantity,
                image: product.image,
                sessionId
            });

            const savedCartItem = await cartItem.save();

            res.status(201).json({
                success: true,
                data: savedCartItem,
                message: 'Item added to cart successfully'
            });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        
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

// @route   PUT /api/cart/:id
// @desc    Update cart item quantity
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const { quantity } = req.body;

        if (quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be positive'
            });
        }

        const cartItem = await Cart.findById(req.params.id);

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // Check stock availability
        const product = await Product.findById(cartItem.productId);
        if (product && product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        if (quantity === 0) {
            await cartItem.deleteOne();
            return res.json({
                success: true,
                message: 'Item removed from cart'
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.json({
            success: true,
            data: cartItem,
            message: 'Cart item updated successfully'
        });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @route   DELETE /api/cart/:id
// @desc    Remove item from cart
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        await cartItem.deleteOne();

        res.json({
            success: true,
            message: 'Item removed from cart successfully'
        });
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Public
router.delete('/', async (req, res) => {
    try {
        const sessionId = req.query.sessionId || 'default_session';
        await Cart.deleteMany({ sessionId });

        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

module.exports = router;