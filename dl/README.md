# E-Commerce Website Project

A full-stack e-commerce application built with React.js frontend and Node.js/Express.js backend.

## 🚀 Quick Start

**Windows Users:**
```powershell
# Run the automated startup script
.\start-app.ps1
```

**Manual Setup:**
1. See detailed instructions in `SETUP-INSTRUCTIONS.md`
2. Or follow the steps below for quick setup

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free)
- Modern web browser

## 🛠 Tech Stack

### Frontend
- **React.js** - UI library with hooks and context
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern responsive styling

### Backend
- **Node.js & Express.js** - Server and API framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

## ✨ Features

- 🛍️ **Product Catalog** - Browse and search products
- 📱 **Responsive Design** - Works on desktop and mobile
- 🛒 **Shopping Cart** - Add, update, and remove items
- 🔍 **Product Details** - Detailed product information
- 📊 **Real-time Updates** - Cart updates instantly
- 🏷️ **Category Filtering** - Filter by product categories
- 💾 **Persistent Cart** - Cart data saved in database

## 📁 Project Structure

```
ecommerce-website/
├── 📁 backend/                 # Node.js/Express API
│   ├── 📁 config/             # Database configuration
│   ├── 📁 models/             # MongoDB schemas
│   ├── 📁 routes/             # API endpoints
│   ├── 📄 server.js           # Main server file
│   └── 📄 package.json        # Backend dependencies
├── 📁 frontend/               # React application
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable components
│   │   ├── 📁 pages/          # Page components
│   │   ├── 📁 context/        # State management
│   │   ├── 📁 services/       # API services
│   │   └── 📁 styles/         # CSS styling
│   └── 📄 package.json        # Frontend dependencies
├── 📁 docs/                   # Documentation
│   ├── 📄 technical-architecture.md
│   └── 📄 prompts-used.md
├── 📄 SETUP-INSTRUCTIONS.md   # Detailed setup guide
├── 📄 start-app.ps1          # Windows startup script
└── 📄 README.md              # This file
```

## 🎯 API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category

### Shopping Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

## 📱 Screenshots

The application includes:
- **Homepage** with featured products and hero section
- **Products page** with search, filtering, and sorting
- **Product detail** pages with add-to-cart functionality
- **Shopping cart** with quantity management
- **Responsive design** that works on all devices

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'build' folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Set environment variables on platform
# Deploy with platform-specific commands
```

## 🔧 Development

### Start Development Servers
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm start
```

### Environment Variables
Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 📚 Documentation

- **[Setup Instructions](SETUP-INSTRUCTIONS.md)** - Complete setup guide
- **[Technical Architecture](docs/technical-architecture.md)** - System design and architecture
- **[Prompts Used](docs/prompts-used.md)** - AI prompts for development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter issues:
1. Check `SETUP-INSTRUCTIONS.md` for troubleshooting
2. Verify MongoDB Atlas connection
3. Ensure all dependencies are installed
4. Check browser console for errors

---

**Built with ❤️ using modern web technologies**