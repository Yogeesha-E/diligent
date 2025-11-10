import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, total, itemCount, loading, error, updateItem, removeItem, loadCart } = useCart();
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await updateItem(itemId, newQuantity);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await removeItem(itemId);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const calculateItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  if (loading && items.length === 0) {
    return (
      <div className="loading">
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Cart</h2>
        <p>{error}</p>
        <button onClick={loadCart} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Cart Items */}
        <div className="cart-container">
          <h2 style={{ marginBottom: '1.5rem' }}>Cart Items ({itemCount})</h2>
          
          {items.map(item => (
            <div key={item._id} className="cart-item">
              <img 
                src={item.image} 
                alt={item.name}
                className="cart-item-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x80/ddd/999?text=No+Image';
                }}
              />
              
              <div className="cart-item-info">
                <Link 
                  to={`/product/${item.productId}`} 
                  className="cart-item-name"
                  style={{ color: '#3498db', textDecoration: 'none' }}
                >
                  {item.name}
                </Link>
                <div className="cart-item-price">${item.price.toFixed(2)} each</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  Subtotal: ${calculateItemTotal(item.price, item.quantity)}
                </div>
              </div>

              <div className="cart-item-controls">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updating[item._id]}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    -
                  </button>
                  
                  <span style={{ 
                    padding: '0.5rem 1rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    {updating[item._id] ? '...' : item.quantity}
                  </span>
                  
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    disabled={updating[item._id]}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={() => handleRemoveItem(item._id)}
                  disabled={updating[item._id]}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  {updating[item._id] ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2 style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Items ({itemCount}):</span>
              <span>${total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <hr style={{ margin: '1rem 0', border: '1px solid #eee' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Total:</span>
              <span className="cart-total">${total}</span>
            </div>
          </div>

          <button 
            className="btn btn-success"
            style={{ 
              width: '100%', 
              padding: '1rem', 
              fontSize: '1.1rem',
              marginBottom: '1rem'
            }}
            onClick={() => alert('Checkout functionality would be implemented here')}
          >
            Proceed to Checkout
          </button>

          <Link 
            to="/products" 
            className="btn btn-secondary"
            style={{ 
              width: '100%', 
              padding: '1rem', 
              fontSize: '1rem',
              textAlign: 'center',
              display: 'block'
            }}
          >
            Continue Shopping
          </Link>

          {/* Security Info */}
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f8ff', borderRadius: '5px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>🔒</span>
              <strong>Secure Checkout</strong>
            </div>
            <p style={{ margin: 0, color: '#666' }}>
              Your payment information is encrypted and secure. We never store your credit card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;