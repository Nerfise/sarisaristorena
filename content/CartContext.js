import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const loadCartItems = async () => {
    try {
      const items = await AsyncStorage.getItem('cartItems');
      if (items) setCartItems(JSON.parse(items));
    } catch (error) {
      console.error('Failed to load cart items', error);
    }
  };

  const addToCartItem = async (item) => {
    const updatedCart = [...cartItems, item];
    setCartItems(updatedCart);
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Failed to save cart items', error);
    }
  };

  const removeFromCartItem = async (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Failed to save cart items', error);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      await AsyncStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Failed to clear cart items', error);
    }
  };

  React.useEffect(() => {
    loadCartItems();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCartItem, removeFromCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
