import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProduct(id);
      
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      setError('Product not found or failed to load');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setMessage(null);
    
    try {
      const result = await addItem(product._id, quantity);
      if (result.success) {
        setMessage({ type: 'success', text: `Added ${quantity} item(s) to cart successfully!` });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to add to cart' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while adding to cart' });
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error">
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Back
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'} style={{ marginBottom: '2rem' }}>
          {message.text}
        </div>
      )}

      <div className="product-detail">
        {/* Product Image */}
        <div>
          <img 
            src={product.image} 
            alt={product.name}
            className="product-detail-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x500/ddd/999?text=No+Image';
            }}
          />
        </div>

        {/* Product Information */}
        <div>
          <span className="product-category">{product.category}</span>
          <h1 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{product.name}</h1>
          
          <div className="product-price" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            ${product.price.toFixed(2)}
          </div>

          <div className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`} style={{ marginBottom: '2rem' }}>
            {product.stock > 0 ? (
              <span>✅ {product.stock} items in stock</span>
            ) : (
              <span>❌ Out of stock</span>
            )}
          </div>

          <div style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
            <h3 style={{ marginBottom: '1rem' }}>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector and Add to Cart */}
          {product.stock > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div className="quantity-selector">
                <label htmlFor="quantity" style={{ fontWeight: '600' }}>Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                />
                <span style={{ color: '#666' }}>Max: {product.stock}</span>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  padding: '1rem 2rem', 
                  fontSize: '1.1rem',
                  marginTop: '1rem'
                }}
              >
                {addingToCart ? 'Adding to Cart...' : `Add ${quantity} to Cart`}
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <div style={{ padding: '1rem', background: '#ffeaea', borderRadius: '5px', textAlign: 'center' }}>
              <p style={{ color: '#e74c3c', margin: 0 }}>This product is currently out of stock</p>
            </div>
          )}

          {/* Product Details */}
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Product Details</h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div><strong>Category:</strong> {product.category}</div>
              <div><strong>Price:</strong> ${product.price.toFixed(2)}</div>
              <div><strong>Stock:</strong> {product.stock} available</div>
              <div><strong>Product ID:</strong> {product._id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;