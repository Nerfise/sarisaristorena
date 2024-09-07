import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Button, FlatList, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firestore, auth } from '../config/firebase';
import { doc, getDoc, updateDoc, setDoc, collection } from 'firebase/firestore';
import { CartContext } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { products } from './data'; // Correct if `data.js` is in the same directory as `HomeScreen.js` and `ConfirmOrderScreen.js`

// Helper function to find a product by ID
const getProductById = (id) => {
  return products.find(product => product.id === id) || {};
};

const OrderScreen = () => {
  const navigation = useNavigation();
  const { cartItems = [] } = useContext(CartContext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const docRef = doc(firestore, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userAddresses = docSnap.data().addresses || [];
          setAddresses(userAddresses);
          if (userAddresses.length > 0) {
            setSelectedAddress(userAddresses[0].id); 
          }
        } else {
          console.log("No such document!");
          Alert.alert("No Document", "No addresses found for this user.");
        }
      } catch (error) {
        console.error("Error fetching addresses: ", error);
        Alert.alert("Error", `Error fetching addresses: ${error.message}`);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleAddAddress = async () => {
    if (!newAddress) {
      Alert.alert("Address Required", "Please enter an address.");
      return;
    }

    const newAddressId = Date.now().toString();

    try {
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, {
        addresses: [...addresses, { id: newAddressId, address: newAddress }],
      });
      setAddresses([...addresses, { id: newAddressId, address: newAddress }]);
      setNewAddress('');
      setShowAddAddress(false);
      Alert.alert("Address Added", "Your address has been added successfully!");
    } catch (error) {
      console.error("Error adding address: ", error);
      Alert.alert("Error", "There was an issue adding your address. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert("Address Missing", "Please select an address before placing your order.");
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "Your cart is empty. Please add items to your cart before placing an order.");
      return;
    }

    Alert.alert(
      "Confirm Order",
      "Are you sure you want to place this order?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: async () => {
          setLoading(true);
          const formattedItems = cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
          }));

          const orderDetails = {
            items: formattedItems,
            total: calculateTotalPrice(),
            delivery: deliveryMethod,
            address: addresses.find(addr => addr.id === selectedAddress)?.address,
            paymentMethod: deliveryMethod,
            userId: userId,
            createdAt: new Date(),
            status: 'Pending', // Added orderStatus field
          };

          try {
            const orderRef = doc(collection(firestore, 'orders'));
            await setDoc(orderRef, orderDetails);

            Alert.alert("Order Placed", "Your order has been placed successfully!");

            // Navigate to HistoryScreen and pass the order details
            navigation.navigate('HistoryScreen', { orderDetails });
          } catch (error) {
            console.error("Error placing order: ", error);
            Alert.alert("Order Failed", "There was an issue placing your order. Please try again.");
          } finally {
            setLoading(false);
          }
        } }
      ]
    );
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const product = getProductById(item.id);
      const price = parseFloat(product.price.replace('Php', '').replace(',', '')) || 0;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.addressHeader}>Select Address:</Text>
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.addressItemContainer}>
                  <TouchableOpacity
                    style={[
                      styles.addressItem,
                      item.id === selectedAddress && styles.selectedAddress,
                    ]}
                    onPress={() => setSelectedAddress(item.id)}
                  >
                    <View style={[
                      styles.circle,
                      item.id === selectedAddress ? styles.circleSelected : styles.circleUnselected
                    ]} />
                    <Text style={styles.addressText}>{item.address}</Text>
                  </TouchableOpacity>
                  {item.id === selectedAddress && (
                    <TouchableOpacity onPress={() => setStep(2)} style={styles.deliverButton}>
                      <Text style={styles.deliverButtonText}>Deliver to this address</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
            <TouchableOpacity onPress={() => setShowAddAddress(true)} style={styles.addAddressButton}>
              <Text style={styles.buttonText}>+ Add New Address</Text>
            </TouchableOpacity>

            {showAddAddress && (
              <View style={styles.addAddressForm}>
                <TextInput
                  style={styles.addressInput}
                  value={newAddress}
                  onChangeText={setNewAddress}
                  placeholder="Enter your new address"
                  autoFocus
                />
                <Button title="Save Address" onPress={handleAddAddress} />
                <TouchableOpacity onPress={() => setShowAddAddress(false)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.deliveryHeader}>Select Delivery Method:</Text>
            <TouchableOpacity onPress={() => setDeliveryMethod('Cash on Delivery')} style={styles.deliveryOption}>
              <View style={[
                styles.circle,
                deliveryMethod === 'Cash on Delivery' ? styles.circleSelected : styles.circleUnselected
              ]} />
              <Text style={styles.deliveryOptionText}>Cash on Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeliveryMethod('E-Wallet (Gcash)')} style={styles.deliveryOption}>
              <View style={[
                styles.circle,
                deliveryMethod === 'E-Wallet (Gcash)' ? styles.circleSelected : styles.circleUnselected
              ]} />
              <Text style={styles.deliveryOptionText}>E-Wallet (Gcash)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep(3)} style={styles.nextButton}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.paymentHeader}>Review and Confirm Order:</Text>
            <Text style={styles.reviewText}>Total Price: Php {calculateTotalPrice()}</Text>
            <Text style={styles.reviewText}>Delivery Method: {deliveryMethod}</Text>
            <Text style={styles.reviewText}>Address: {addresses.find(addr => addr.id === selectedAddress)?.address}</Text>
            <Text style={styles.reviewText}>Products:</Text>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const product = getProductById(item.id);
                const productTotal = (parseFloat(product.price.replace('Php', '').replace(',', '')) || 0) * item.quantity;

                return (
                  <View style={styles.productItem}>
                    <Image source={product.image} style={styles.productImage} />
                    <View style={styles.productDetailsContainer}>
                      <Text style={styles.productName}>{product.name || 'Unknown Product'}</Text>
                      <Text style={styles.productDetails}>Quantity: {item.quantity}</Text>
                      <Text style={styles.productDetails}>Price: {product.price || 'N/A'}</Text>
                      <Text style={styles.productDetails}>Total: Php {productTotal.toFixed(2)}</Text>
                    </View>
                  </View>
                );
              }}
            />
            <TouchableOpacity onPress={handlePlaceOrder} style={styles.placeOrderButton}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Confirm Order</Text>}
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.stepper}>
        <View style={styles.step}>
          <Ionicons name="checkmark-circle" size={24} color={step >= 1 ? 'green' : 'gray'} />
          <Text style={styles.stepText}>Address</Text>
        </View>
        <View style={styles.step}>
          <Ionicons name="checkmark-circle" size={24} color={step >= 2 ? 'green' : 'gray'} />
          <Text style={styles.stepText}>Delivery</Text>
        </View>
        <View style={styles.step}>
          <Ionicons name="checkmark-circle" size={24} color={step >= 3 ? 'green' : 'gray'} />
          <Text style={styles.stepText}>Payment</Text>
        </View>
      </View>

      {renderStepContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 16,
  },
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  step: {
    alignItems: 'center',
  },
  stepText: {
    marginTop: 4,
    fontSize: 12,
    color: 'gray',
  },
  stepContent: {
    flex: 1,
    padding: 16,
  },
  addressHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressItemContainer: {
    marginBottom: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
  },
  circleUnselected: {
    borderColor: '#dcdcdc',
  },
  circleSelected: {
    borderColor: '#28a745',
    backgroundColor: '#28a745',
  },
  addressText: {
    flex: 1,
    fontSize: 16,
  },
  deliverButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  deliverButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addAddressButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addAddressForm: {
    marginTop: 20,
  },
  addressInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    padding: 10,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  deliveryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deliveryOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  nextButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  paymentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 10,
  },
  placeOrderButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  productDetailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDetails: {
    fontSize: 14,
    color: '#555',
  },
  selectedAddress: {
    backgroundColor: '#e0ffe0',
  },
});

export default OrderScreen;
