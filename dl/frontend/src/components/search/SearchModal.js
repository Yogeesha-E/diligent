import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/api';

const SearchModal = ({ isOpen, onClose, navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search products when query changes
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchProducts();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts({ search: searchQuery.trim() });
      
      if (response.data.success) {
        setSearchResults(response.data.data.slice(0, 8)); // Limit to 8 results
      }
    } catch (error) {
      setError('Failed to search products');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    saveToRecentSearches(searchQuery);
    navigate(`/product/${product._id}`);
    handleClose();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveToRecentSearches(searchQuery);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      handleClose();
    }
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
  };

  const saveToRecentSearches = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const updated = [trimmedQuery, ...recentSearches.filter(item => item !== trimmedQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    onClose();
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-modal">
        <div className="search-header">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              <button type="submit" className="search-submit-btn">
                🔍
              </button>
            </div>
          </form>
          <button className="search-close" onClick={handleClose}>×</button>
        </div>

        <div className="search-content">
          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="search-section">
              <div className="search-section-header">
                <h3>Recent Searches</h3>
                <button className="clear-btn" onClick={clearRecentSearches}>
                  Clear All
                </button>
              </div>
              <div className="recent-searches">
                {recentSearches.map((query, index) => (
                  <button
                    key={index}
                    className="recent-search-item"
                    onClick={() => handleRecentSearchClick(query)}
                  >
                    🕐 {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Categories */}
          {!searchQuery && (
            <div className="search-section">
              <h3>Browse Categories</h3>
              <div className="quick-categories">
                <button 
                  className="category-pill"
                  onClick={() => {
                    navigate('/products?category=Electronics');
                    handleClose();
                  }}
                >
                  📱 Electronics
                </button>
                <button 
                  className="category-pill"
                  onClick={() => {
                    navigate('/products?category=Accessories');
                    handleClose();
                  }}
                >
                  👜 Accessories
                </button>
                <button 
                  className="category-pill"
                  onClick={() => {
                    navigate('/products?category=Office');
                    handleClose();
                  }}
                >
                  💼 Office
                </button>
                <button 
                  className="category-pill"
                  onClick={() => {
                    navigate('/products?category=Home');
                    handleClose();
                  }}
                >
                  🏠 Home
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div className="search-section">
              <h3>Search Results</h3>
              
              {loading && (
                <div className="search-loading">
                  <div className="loading-spinner"></div>
                  <p>Searching...</p>
                </div>
              )}

              {error && (
                <div className="search-error">
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="no-results">
                  <p>No products found for "{searchQuery}"</p>
                  <button 
                    className="view-all-btn"
                    onClick={() => {
                      navigate('/products');
                      handleClose();
                    }}
                  >
                    View All Products
                  </button>
                </div>
              )}

              {!loading && searchResults.length > 0 && (
                <>
                  <div className="search-results">
                    {searchResults.map(product => (
                      <div
                        key={product._id}
                        className="search-result-item"
                        onClick={() => handleProductClick(product)}
                      >
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="result-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x60/ddd/999?text=No+Image';
                          }}
                        />
                        <div className="result-info">
                          <h4 
                            className="result-name"
                            dangerouslySetInnerHTML={{ 
                              __html: highlightText(product.name, searchQuery) 
                            }}
                          />
                          <p className="result-category">{product.category}</p>
                          <p className="result-price">${product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="search-footer">
                    <button 
                      className="view-all-results-btn"
                      onClick={() => {
                        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                        handleClose();
                      }}
                    >
                      View All Results for "{searchQuery}"
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;