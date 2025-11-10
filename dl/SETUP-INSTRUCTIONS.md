# E-Commerce Website Setup Instructions

This guide will help you set up and run the complete e-commerce website with React.js frontend and Node.js backend.

## Prerequisites

Make sure you have the following installed on your system:
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- MongoDB Atlas account (free tier available)
- Git (optional, for version control)

## Step 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Create a new cluster (choose the free M0 tier)

2. **Configure Database Access**
   - Go to Database Access in the left sidebar
   - Click "Add New Database User"
   - Create a user with read/write permissions
   - Remember the username and password

3. **Configure Network Access**
   - Go to Network Access in the left sidebar
   - Click "Add IP Address"
   - For development, you can use `0.0.0.0/0` (allows access from anywhere)
   - For production, use your specific IP address

4. **Get Connection String**
   - Go to Clusters and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Step 2: Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

4. **Configure Environment Variables**
   Edit the `.env` file and update:
   ```
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```
   
   The server should start on `http://localhost:5000`. You should see:
   - "Server is running on port 5000"
   - "MongoDB Connected: [your cluster info]"
   - "Seeding initial product data..." (first time only)

## Step 3: Frontend Setup

1. **Open New Terminal and Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Frontend Development Server**
   ```bash
   npm start
   ```
   
   The application should open in your browser at `http://localhost:3000`

## Step 4: Verify Installation

1. **Check Backend API**
   - Visit `http://localhost:5000` in your browser
   - You should see a JSON response with API information

2. **Check Frontend**
   - The website should load at `http://localhost:3000`
   - You should see the homepage with featured products
   - Try navigating to different pages (Products, Cart)

3. **Test Functionality**
   - Browse products on the Products page
   - Click on a product to view details
   - Add items to cart
   - View and manage cart

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Structure

```
ecommerce-website/
├── backend/                 # Node.js/Express.js API server
│   ├── config/             # Database configuration
│   ├── models/             # MongoDB/Mongoose models
│   ├── routes/             # API routes
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── frontend/               # React.js application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context (cart state)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── styles/         # CSS styles
│   │   ├── App.js          # Main React component
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
├── docs/                   # Documentation
├── README.md               # Project overview
└── SETUP-INSTRUCTIONS.md   # This file
```

## Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check if MongoDB URI is correct in `.env`
   - Verify MongoDB Atlas network access settings
   - Make sure port 5000 is not already in use

2. **Frontend can't connect to backend**
   - Ensure backend is running on port 5000
   - Check browser console for CORS errors
   - Verify proxy setting in frontend/package.json

3. **Database connection issues**
   - Verify MongoDB Atlas cluster is running
   - Check username/password in connection string
   - Ensure IP address is whitelisted

4. **Products not loading**
   - Check backend logs for database errors
   - Verify sample data was seeded properly
   - Test API endpoints directly (e.g., `http://localhost:5000/api/products`)

### Debug Steps

1. **Check Backend Logs**
   ```bash
   cd backend
   npm run dev
   # Look for error messages in the console
   ```

2. **Check Frontend Console**
   - Open browser developer tools (F12)
   - Look for JavaScript errors in Console tab
   - Check Network tab for API request failures

3. **Test API Endpoints Directly**
   - `GET http://localhost:5000/api/products` - Should return product list
   - `GET http://localhost:5000/api/cart` - Should return empty cart initially

## Production Deployment

For production deployment, consider:

1. **Backend Deployment** (Heroku, Railway, Render)
   - Set environment variables on the platform
   - Use production MongoDB URI
   - Set NODE_ENV to "production"

2. **Frontend Deployment** (Vercel, Netlify, GitHub Pages)
   - Update API URL to point to production backend
   - Build the application: `npm run build`
   - Deploy the `build` folder

3. **Environment Variables for Production**
   ```
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   FRONTEND_URL=https://your-frontend-domain.com
   ```

## Next Steps

After successful setup, you can:

1. **Add More Features**
   - User authentication
   - Product categories
   - Search functionality
   - Order management
   - Payment integration

2. **Improve Security**
   - Add input validation
   - Implement rate limiting
   - Add authentication middleware

3. **Enhance UI/UX**
   - Add loading states
   - Implement toast notifications
   - Add product image galleries
   - Improve responsive design

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed properly

The application includes sample data and is ready to use immediately after setup!