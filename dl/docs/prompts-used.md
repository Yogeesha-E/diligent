# Prompts Used for E-Commerce Website Development

This document contains all the prompts and instructions used to generate the technical documentation and codebase for the e-commerce website project.

## 1. Initial Project Setup Prompts

### Architecture Design Prompt
```
Create a technical architecture document for an e-commerce website using:
- Frontend: React.js with React Router
- Backend: Node.js with Express.js  
- Database: MongoDB Atlas
- Features: Product browsing, product details, shopping cart management
- Requirements: Clean, responsive UI, lightweight backend, basic state management

Include:
- High-level system architecture diagram
- Component structure for frontend
- API endpoint design
- Database schema design
- Data flow documentation
- Security and scalability considerations
```

### Backend Development Prompt
```
Generate a Node.js/Express.js backend for an e-commerce website with:
- RESTful API endpoints for products and cart
- MongoDB integration using Mongoose
- Product model with name, description, price, image, category, stock
- Cart model for managing shopping cart items
- CORS configuration for frontend communication
- Error handling and validation
- MVC architecture pattern
```

### Frontend Development Prompt
```
Create a React.js frontend for an e-commerce website with:
- React Router for navigation (Home, Products, Product Details, Cart pages)
- Product listing and detail components
- Shopping cart functionality with Context API
- Responsive design with CSS
- API integration using Axios
- Clean, modern UI with product cards and cart management
- State management for cart operations
```

## 2. Component-Specific Prompts

### Product Management Prompt
```
Implement product-related components:
- ProductCard: Display product with image, name, price, add-to-cart button
- ProductList: Grid layout of product cards with responsive design
- ProductDetail: Detailed view with description, stock info, quantity selector
- Integration with backend API for fetching product data
```

### Shopping Cart Prompt
```
Create shopping cart functionality:
- Cart Context for global state management
- CartItem component for individual cart items
- CartSummary component showing total price and item count
- Add, update, and remove cart operations
- Persistent cart data using backend API
```

### Styling and Layout Prompt
```
Design responsive CSS for e-commerce website:
- Modern, clean design with good typography
- Mobile-first responsive layout
- Product grid with card-based design
- Navigation header with cart icon and count
- Cart page with item management interface
- Color scheme and consistent spacing
```

## 3. Database and API Prompts

### MongoDB Schema Prompt
```
Design MongoDB schemas for e-commerce:
- Products collection with all necessary fields
- Cart collection for temporary cart storage
- Mongoose models with validation
- Sample data for testing and development
```

### API Documentation Prompt
```
Create RESTful API documentation:
- All endpoint specifications
- Request/response formats
- Error handling documentation
- Authentication requirements (if any)
- Testing instructions
```

## 4. Setup and Deployment Prompts

### Package Configuration Prompt
```
Generate package.json files for both frontend and backend with:
- All necessary dependencies
- Development dependencies
- Scripts for development and production
- Proper version specifications
```

### Environment Setup Prompt
```
Create setup instructions and configuration:
- Environment variable templates
- MongoDB Atlas connection setup
- Development server startup instructions
- Build and deployment scripts
```

## 5. Testing and Documentation Prompts

### README Documentation Prompt
```
Create comprehensive README.md with:
- Project overview and features
- Tech stack explanation
- Installation and setup instructions
- Usage examples
- Project structure overview
- Contributing guidelines
```

### Error Handling Prompt
```
Implement comprehensive error handling:
- Frontend error boundaries and user feedback
- Backend error middleware and logging
- Database connection error handling
- API response error management
```

## 6. Sample Data Generation Prompt

### Test Data Prompt
```
Generate sample product data for e-commerce testing:
- Variety of product categories
- Realistic product names, descriptions, and prices
- Sample image URLs or placeholder images
- Stock quantities and category organization
```

## 7. Performance Optimization Prompts

### Frontend Optimization Prompt
```
Optimize React application:
- Component memoization where appropriate
- Efficient state updates
- Image lazy loading
- Bundle size optimization
```

### Backend Optimization Prompt
```
Optimize Express.js server:
- Database query optimization
- Response compression
- Caching strategies
- Request rate limiting
```

These prompts were used iteratively to build a complete, production-ready e-commerce website with modern development practices and clean architecture.