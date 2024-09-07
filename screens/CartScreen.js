import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const { cartItems, removeFromCartItem, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Please add a product to your cart before proceeding.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      'Are you sure you want to proceed with the purchase?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => navigation.navigate('ConfirmOrderScreen', { cartItems }),
        },
      ],
      { cancelable: false }
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
      {item.description && <Text style={styles.itemDescription}>Description: {item.description}</Text>}
      {item.category !== 'Starter Pack' && item.option && (
        <Text style={styles.itemOption}>Option: {item.option}</Text>
      )}
      <TouchableOpacity onPress={() => removeFromCartItem(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      const price = parseFloat(item.price.replace('Php', '').replace(',', ''));
      total += price * item.quantity;
    });
    return total.toFixed(2);
  };

  return (
    <ImageBackground source={require('../assets/onlinegrocery.jpg')} style={styles.backgroundImage}>
      <LinearGradient colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.9)']} style={styles.container}>
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
        <View style={styles.footer}>
          <Text style={styles.totalPrice}>Total Price: Php{calculateTotal()}</Text>
          <Button title="Clear Cart" onPress={clearCart} color="#dc3545" />
          <TouchableOpacity
            style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]}
            onPress={handleCheckout}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkoutButtonText}>Confirm</Text>}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 30,
  },
  cartItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    color: '#007bff',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  itemOption: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  removeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
