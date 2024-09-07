import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Button, Alert, TextInput } from 'react-native';
import COLORS from '../constants/colors';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const [selectedOption, setSelectedOption] = useState(product.options[0]);
  const [quantity, setQuantity] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddToCart = () => {
    if (selectedOption && quantity) {
      // Logic to add the selected product and quantity to the cart
      Alert.alert('Added to Cart', `${product.name} with ${selectedOption} and quantity ${quantity} added to your cart.`);
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please select an option and enter a quantity.');
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => (parseInt(prev) + 1).toString());
  };

  const decrementQuantity = () => {
    setQuantity(prev => (parseInt(prev) > 1 ? (parseInt(prev) - 1).toString() : '1'));
  };

  const handleQuantityChange = (text) => {
    // Validate that the input is a positive integer
    if (/^\d*$/.test(text)) {
      setQuantity(text);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Select Options</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{product.name}</Text>
            <Text style={styles.modalSubtitle}>Select an option:</Text>
            <View style={styles.optionContainer}>
              {product.options.map((option, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.optionButton, selectedOption === option && styles.selectedOptionButton]}
                  onPress={() => setSelectedOption(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.modalSubtitle}>Select Quantity:</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={decrementQuantity}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={quantity}
                onChangeText={handleQuantityChange}
                maxLength={2} // Limit length to 2 digits
              />
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={incrementQuantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Button title="Add to Cart" onPress={handleAddToCart} color={COLORS.primary} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color={COLORS.red} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: COLORS.grey,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  optionContainer: {
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: COLORS.lightGrey,
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 18,
    color: COLORS.black,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  quantityButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 3,
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: 20,
  },
  quantityInput: {
    fontSize: 20,
    width: 60,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    textAlign: 'center',
    marginHorizontal: 10,
  },
});

export default ProductDetail;
