import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      const result = await addItem(product._id, 1);
      if (result.success) {
        // Could add a toast notification here
        console.log('Added to cart successfully');
      } else {
        console.error('Failed to add to cart:', result.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300/ddd/999?text=No+Image';
          }}
        />
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </p>
          <div className="product-price">${product.price.toFixed(2)}</div>
          <div className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
        </div>
      </Link>
      
      <div style={{ padding: '0 1.5rem 1.5rem' }}>
        <button 
          className={`btn btn-primary ${product.stock === 0 ? 'btn-secondary' : ''}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLoading}
          style={{ width: '100%' }}
        >
          {isLoading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;