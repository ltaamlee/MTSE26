import { createContext, useContext, useState, useCallback } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.getCart();
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.addToCart({ productId, quantity });
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      const message = error.response?.data?.message || 'Thêm vào giỏ hàng thất bại';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartItem = useCallback(async (productId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.updateCart({ productId, quantity });
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      const message = error.response?.data?.message || 'Cập nhật giỏ hàng thất bại';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.removeFromCart(productId);
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      const message = error.response?.data?.message || 'Xóa sản phẩm thất bại';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.clearCart();
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      const message = error.response?.data?.message || 'Xóa giỏ hàng thất bại';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    cart,
    setCart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
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
