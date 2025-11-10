import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Product API functions
export const getProducts = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/products${queryString ? `?${queryString}` : ''}`);
};

export const getProduct = (id) => {
  return api.get(`/products/${id}`);
};

export const getProductsByCategory = (category) => {
  return api.get(`/products/category/${category}`);
};

export const createProduct = (productData) => {
  return api.post('/products', productData);
};

// Cart API functions
export const getCart = (sessionId = 'default_session') => {
  return api.get(`/cart?sessionId=${sessionId}`);
};

export const addToCart = (productId, quantity = 1, sessionId = 'default_session') => {
  return api.post('/cart', {
    productId,
    quantity,
    sessionId
  });
};

export const updateCartItem = (itemId, quantity) => {
  return api.put(`/cart/${itemId}`, { quantity });
};

export const removeFromCart = (itemId) => {
  return api.delete(`/cart/${itemId}`);
};

export const clearCart = (sessionId = 'default_session') => {
  return api.delete(`/cart?sessionId=${sessionId}`);
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      data: null
    };
  } else {
    return {
      message: 'An unexpected error occurred',
      status: 0,
      data: null
    };
  }
};

export default api;