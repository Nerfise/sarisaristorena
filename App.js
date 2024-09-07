import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importing screens
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import ConfirmOrderScreen from './screens/ConfirmOrderScreen'; // Import ConfirmOrderScreen
import HistoryScreen from './screens/HistoryScreen'; // Import HistoryScreen

import { CartProvider } from './context/CartContext';

// Create a Tab Navigator for main app sections
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'HomeScreen') {
          iconName = 'home';
        } else if (route.name === 'CartScreen') {
          iconName = 'cart';
        } else if (route.name === 'ProfileScreen') {
          iconName = 'person';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="CartScreen" component={CartScreen} />
    <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
  </Tab.Navigator>
);

// Create a Stack Navigator for handling different screen flows
const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName='Welcome'>
    <Stack.Screen
      name="Welcome"
      component={Welcome}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Signup"
      component={Signup}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ title: 'Product Details' }}
    />
    <Stack.Screen
      name="Main"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ConfirmOrderScreen"
      component={ConfirmOrderScreen}
      options={{ title: 'Confirm Order' }}
    />
    <Stack.Screen
      name="HistoryScreen"
      component={HistoryScreen}
      options={{ title: 'Order History' }}
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </NavigationContainer>
  );
}
