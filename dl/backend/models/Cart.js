const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be positive']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    image: {
        type: String,
        required: [true, 'Product image is required'],
        trim: true
    },
    sessionId: {
        type: String,
        required: false,
        default: 'default_session'
    }
}, {
    timestamps: true
});

// Index for better query performance
CartSchema.index({ sessionId: 1 });
CartSchema.index({ productId: 1 });

// Virtual for total price of this cart item
CartSchema.virtual('totalPrice').get(function() {
    return this.price * this.quantity;
});

// Static method to get cart total
CartSchema.statics.getCartTotal = async function(sessionId = 'default_session') {
    const cartItems = await this.find({ sessionId });
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Static method to get cart item count
CartSchema.statics.getCartItemCount = async function(sessionId = 'default_session') {
    const cartItems = await this.find({ sessionId });
    return cartItems.reduce((total, item) => total + item.quantity, 0);
};

// Method to update quantity
CartSchema.methods.updateQuantity = function(newQuantity) {
    if (newQuantity <= 0) {
        return this.deleteOne();
    } else {
        this.quantity = newQuantity;
        return this.save();
    }
};

module.exports = mongoose.model('Cart', CartSchema);