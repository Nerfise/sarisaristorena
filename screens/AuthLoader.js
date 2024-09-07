// screens/AuthLoader.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { auth } from '../config/firebase'; // Ensure correct path
import { onAuthStateChanged } from 'firebase/auth';

const AuthLoader = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }], // Use correct screen name
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }], // Use correct screen name
        });
      }
    });

    return unsubscribe; // Clean up the subscription on unmount
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return null;
};

export default AuthLoader;
