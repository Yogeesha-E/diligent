const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be positive'],
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: 'Price must be a positive number'
        }
    },
    image: {
        type: String,
        required: [true, 'Product image URL is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true,
        enum: ['Electronics', 'Accessories', 'Office', 'Clothing', 'Home', 'Books', 'Sports', 'Other']
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    }
}, {
    timestamps: true
});

// Index for better search performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

// Virtual for availability status
ProductSchema.virtual('inStock').get(function() {
    return this.stock > 0;
});

// Method to decrease stock
ProductSchema.methods.decreaseStock = function(quantity) {
    if (this.stock >= quantity) {
        this.stock -= quantity;
        return this.save();
    } else {
        throw new Error('Insufficient stock');
    }
};

// Method to increase stock
ProductSchema.methods.increaseStock = function(quantity) {
    this.stock += quantity;
    return this.save();
};

module.exports = mongoose.model('Product', ProductSchema);