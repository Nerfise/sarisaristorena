import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { firestore } from '../config/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const HistoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const { orderDetails } = route.params || {};

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderDetails) {
      // If orderDetails are passed, show them first
      setOrders([orderDetails]);
      setLoading(false);
    } else {
      // Fetch real-time orders from Firebase
      const ordersCollection = collection(firestore, 'orders');
      const q = query(ordersCollection, orderBy('createdAt', 'desc')); // Order by creation date

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const ordersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
          }));
          setOrders(ordersList);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching orders: ', error);
          setError('Failed to load orders.');
          setLoading(false);
        }
      );

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [orderDetails]);

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetailsScreen', { order });
  };

  const renderOrderItem = ({ item }) => {
    const createdAtDate = item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt);
    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderId}>Order ID: {item.id}</Text>
        <Text style={styles.orderDate}>Date: {createdAtDate.toLocaleDateString()}</Text>
        <Text style={styles.orderStatus}>Status: {item.status}</Text>
        <Text style={styles.orderPaymentMethod}>Payment Method: {item.paymentMethod}</Text>
        <Text style={styles.orderItems}>Items: {item.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</Text>
        <TouchableOpacity onPress={() => handleOrderPress(item)}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderPaymentMethod: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderItems: {
    fontSize: 16,
    marginBottom: 10,
  },
  viewDetailsText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  noOrdersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HistoryScreen;
