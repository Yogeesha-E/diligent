const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // For demo purposes, we'll use a mock database if MongoDB is not available
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
        
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Seed initial data if database is empty
        const Product = require('../models/Product');
        const productCount = await Product.countDocuments();
        
        if (productCount === 0) {
            console.log('Seeding initial product data...');
            await seedProducts();
        }
        
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.log('📝 To fix this:');
        console.log('1. Set up MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
        console.log('2. Update MONGODB_URI in backend/.env');
        console.log('3. Or install MongoDB locally');
        console.log('\n🔄 Starting server without database (limited functionality)...');
        
        // Don't exit, continue without database for demo
        global.dbConnected = false;
    }
};

const seedProducts = async () => {
    const Product = require('../models/Product');
    
    const sampleProducts = [
        {
            name: "Wireless Bluetooth Headphones",
            description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
            price: 99.99,
            image: "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Headphones",
            category: "Electronics",
            stock: 50
        },
        {
            name: "Smartphone Case",
            description: "Durable protective case for smartphones with shock absorption and wireless charging compatibility.",
            price: 24.99,
            image: "https://via.placeholder.com/300x300/50C878/FFFFFF?text=Phone+Case",
            category: "Accessories",
            stock: 100
        },
        {
            name: "Laptop Stand",
            description: "Adjustable aluminum laptop stand for better ergonomics and cooling.",
            price: 49.99,
            image: "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Laptop+Stand",
            category: "Office",
            stock: 30
        },
        {
            name: "Wireless Mouse",
            description: "Ergonomic wireless mouse with precision tracking and long battery life.",
            price: 34.99,
            image: "https://via.placeholder.com/300x300/A8E6CF/FFFFFF?text=Mouse",
            category: "Electronics",
            stock: 75
        },
        {
            name: "USB-C Cable",
            description: "Fast charging USB-C cable with data transfer capability, 6ft length.",
            price: 14.99,
            image: "https://via.placeholder.com/300x300/FFD93D/FFFFFF?text=USB+Cable",
            category: "Accessories",
            stock: 200
        },
        {
            name: "Desk Organizer",
            description: "Multi-compartment desk organizer to keep your workspace tidy and efficient.",
            price: 39.99,
            image: "https://via.placeholder.com/300x300/B19CD9/FFFFFF?text=Organizer",
            category: "Office",
            stock: 45
        }
    ];

    try {
        await Product.insertMany(sampleProducts);
        console.log('Sample products added successfully');
    } catch (error) {
        console.error('Error seeding products:', error);
    }
};

module.exports = connectDB;