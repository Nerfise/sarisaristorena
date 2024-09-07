import React, { createContext, useState, useContext } from 'react';
import { products } from '../data/data'; // Ensure this path is correct

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Add item to cart
  const addItemToCart = (item) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      if (itemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[itemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  };

  // Remove item from cart by id
  const removeItemFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  // Clear all items in the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate the total price of items in the cart
  const totalPrice = cartItems.reduce((acc, item) => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      // Handle potential issues with price format
      const productPrice = parseFloat(product.price.replace('Php', '').replace(',', ''));
      if (!isNaN(productPrice)) {
        acc += productPrice * item.quantity;
      }
    }
    return acc;
  }, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addItemToCart, 
        removeItemFromCart, 
        clearCart, 
        paymentMethod, 
        setPaymentMethod, 
        totalPrice 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCartContext = () => useContext(CartContext);
