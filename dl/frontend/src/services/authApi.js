import api from './api';

// Authentication API functions
export const loginUser = (email, password) => {
  return api.post('/auth/login', {
    email,
    password
  });
};

export const registerUser = (name, email, password, confirmPassword) => {
  return api.post('/auth/register', {
    name,
    email,
    password,
    confirmPassword
  });
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  return api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const logoutUser = () => {
  const token = localStorage.getItem('token');
  return api.post('/auth/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Set authentication token for all requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};