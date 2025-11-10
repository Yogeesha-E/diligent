import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../services/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount,
        loading: false
      };
    
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        loading: false
      };
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload._id ? action.payload : item
        ),
        loading: false
      };
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        loading: false
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await getCart();
      dispatch({
        type: 'SET_CART',
        payload: {
          items: response.data.data,
          total: response.data.summary.total,
          itemCount: response.data.summary.itemCount
        }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addItem = async (productId, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await addToCart(productId, quantity);
      
      if (response.data.success) {
        await loadCart(); // Reload cart to get updated totals
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      return { success: false, message: error.response?.data?.message || 'Failed to add item to cart' };
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await updateCartItem(itemId, quantity);
      
      if (response.data.success) {
        if (quantity === 0) {
          dispatch({ type: 'REMOVE_ITEM', payload: itemId });
        } else {
          dispatch({ type: 'UPDATE_ITEM', payload: response.data.data });
        }
        await loadCart(); // Reload to get updated totals
        return { success: true };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      return { success: false, message: error.response?.data?.message || 'Failed to update item' };
    }
  };

  const removeItem = async (itemId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await removeFromCart(itemId);
      
      if (response.data.success) {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
        await loadCart(); // Reload to get updated totals
        return { success: true };
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      return { success: false, message: error.response?.data?.message || 'Failed to remove item' };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    addItem,
    updateItem,
    removeItem,
    loadCart,
    clearError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;