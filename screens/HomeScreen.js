import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Modal, Button, Alert, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../context/CartContext';
import { products } from './data';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  const { addToCartItem } = useContext(CartContext);
  const navigation = useNavigation(); // Initialize useNavigation
  const { width } = Dimensions.get('window');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const addToCart = () => {
    if (selectedProduct) {
      const newItem = { 
        ...selectedProduct, 
        quantity, 
        option: selectedOption || 'No Option Selected' 
      };
      addToCartItem(newItem);
      Alert.alert('Added to Cart', `${selectedProduct.name} with quantity ${quantity} ${selectedOption ? `and option ${selectedOption}` : ''} has been added to your cart.`);
      setModalVisible(false);
      setQuantity(1);
      setSelectedOption(null);
    } else {
      Alert.alert('Error', 'Please select a product.');
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + change;
      return newQuantity > 0 ? newQuantity : 1;
    });
  };

  const renderOptions = () => {
    if (selectedProduct && selectedProduct.options) {
      return (
        <View style={styles.optionsContainer}>
          {selectedProduct.options.map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, selectedOption === option && styles.selectedOptionButton]}
              onPress={() => setSelectedOption(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={[styles.categoryButton, selectedCategory === item && styles.selectedCategoryButton]}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => {
        setSelectedProduct(item);
        setModalVisible(true);
        setSelectedOption(null);
      }}
    >
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../assets/onlinegrocery.jpg')} style={styles.backgroundImage}>
      <LinearGradient colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.8)']} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#000" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate('HistoryScreen')} // Navigate to HistoryScreen
          >
            <Ionicons name="time" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productList}
          ListHeaderComponent={() => (
            <>
              <Text style={styles.sectionTitle}>Categories</Text>
              <FlatList
                data={['All', 'Starter Pack', 'Snacks', 'Beverages']}
                renderItem={renderCategory}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
              />
              <Text style={styles.sectionTitle}>Products</Text>
            </>
          )}
        />

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedProduct && (
                <>
                  <Image source={selectedProduct.image} style={styles.modalImage} />
                  <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                  <Text style={styles.modalProductPrice}>{selectedProduct.price}</Text>
                  <Text style={styles.modalProductDescription}>{selectedProduct.description}</Text>
                  {renderOptions()}
                  <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity onPress={() => handleQuantityChange(-1)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <TextInput
                        style={styles.quantityInput}
                        value={String(quantity)}
                        onChangeText={(text) => setQuantity(Number(text) || 1)}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity onPress={() => handleQuantityChange(1)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.modalButtons}>
                    <Button title="Add to Cart" onPress={addToCart} />
                    <Button title="Cancel" onPress={() => setModalVisible(false)} color="#dc3545" />
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 50,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  historyButton: {
    marginLeft: 10,
  },
  categoriesList: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 5,
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: '#0056b3',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  productList: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  modalProductName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalProductPrice: {
    fontSize: 18,
    color: '#888',
    marginBottom: 15,
  },
  modalProductDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  selectedOptionButton: {
    backgroundColor: '#0056b3',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 60,
    textAlign: 'center',
    fontSize: 16,
  },
  modalButtons: {
    marginTop: 20,
    width: '100%',
  },
});

export default HomeScreen;
