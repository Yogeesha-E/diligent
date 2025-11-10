import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ limit: 6 });
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      setError('Failed to load featured products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Enhanced Hero Section */}
      <section className="hero-enhanced">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  {isAuthenticated ? `Welcome back, ${user?.name?.split(' ')[0]}!` : 'Welcome to E-Shop'}
                </h1>
                <p className="hero-subtitle">
                  Discover amazing products, unbeatable prices, and exceptional quality
                </p>
                <div className="hero-stats">
                  <div className="stat">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Products</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">50K+</span>
                    <span className="stat-label">Happy Customers</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">99%</span>
                    <span className="stat-label">Satisfaction</span>
                  </div>
                </div>
                <div className="hero-actions">
                  <Link to="/products" className="btn btn-primary btn-lg">
                    🛍️ Shop Now
                  </Link>
                  <Link to="/products?category=Electronics" className="btn btn-secondary btn-lg">
                    🔥 Hot Deals
                  </Link>
                </div>
              </div>
              <div className="hero-visual">
                <div className="floating-cards">
                  <div className="floating-card card-1">
                    <span className="card-emoji">📱</span>
                    <span className="card-text">Electronics</span>
                  </div>
                  <div className="floating-card card-2">
                    <span className="card-emoji">👕</span>
                    <span className="card-text">Fashion</span>
                  </div>
                  <div className="floating-card card-3">
                    <span className="card-emoji">🏠</span>
                    <span className="card-text">Home & Garden</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products?category=Electronics" className="category-card">
              <div className="category-icon">📱</div>
              <h3>Electronics</h3>
              <p>Latest gadgets and tech</p>
              <span className="category-arrow">→</span>
            </Link>
            <Link to="/products?category=Accessories" className="category-card">
              <div className="category-icon">👜</div>
              <h3>Accessories</h3>
              <p>Complete your look</p>
              <span className="category-arrow">→</span>
            </Link>
            <Link to="/products?category=Office" className="category-card">
              <div className="category-icon">💼</div>
              <h3>Office</h3>
              <p>Work from home essentials</p>
              <span className="category-arrow">→</span>
            </Link>
            <Link to="/products?category=Home" className="category-card">
              <div className="category-icon">🏠</div>
              <h3>Home & Garden</h3>
              <p>Beautify your space</p>
              <span className="category-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked products just for you</p>
          </div>
          
          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading featured products...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p>No featured products available at the moment.</p>
            </div>
          )}

          <div className="section-footer">
            <Link to="/products" className="btn btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose E-Shop?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Free shipping on orders over $50. Get your products delivered within 2-3 business days.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Shopping</h3>
              <p>Your data and transactions are protected with industry-standard encryption and security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Quality Products</h3>
              <p>Carefully curated selection of premium items from trusted brands and verified sellers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h3>24/7 Support</h3>
              <p>Our dedicated customer service team is available around the clock to help you.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive pricing and regular discounts to give you the best value for your money.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy with no questions asked. Shop with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay in the Loop</h2>
            <p>Subscribe to our newsletter for exclusive deals and latest updates</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>
            <p className="newsletter-disclaimer">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;