import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: ''
  });

  const categories = ['All', 'Electronics', 'Accessories', 'Office', 'Clothing', 'Home', 'Books', 'Sports', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (filters.category && filters.category !== 'All') {
        params.category = filters.category;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.sort) {
        params.sort = filters.sort;
      }

      const response = await getProducts(params);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sort: ''
    });
  };

  return (
    <div>
      <div className="products-header">
        <h1>All Products</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
          >
            {categories.map(category => (
              <option key={category} value={category === 'All' ? '' : category}>
                {category}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
          >
            <option value="">Sort by</option>
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>

          {/* Clear Filters */}
          <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.category || filters.search || filters.sort) && (
        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
          <strong>Active Filters: </strong>
          {filters.category && <span>Category: {filters.category} </span>}
          {filters.search && <span>Search: "{filters.search}" </span>}
          {filters.sort && <span>Sort: {filters.sort} </span>}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <p>Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Try Again
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {products.length > 0 ? (
            <>
              <div style={{ marginBottom: '1rem', color: '#666' }}>
                Showing {products.length} products
              </div>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;