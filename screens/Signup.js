import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Pressable, Image, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import COLORS from '../constants/colors';
import Button from '../components/Button';

const Signup = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Pass user data to ProfileScreen
        navigation.replace('ProfileScreen', {
          name: name,
          email: email,
          number: number
        });
      })
      .catch((error) => {
        console.error('Error signing up:', error);
        Alert.alert('Signup Error', error.message || 'Failed to sign up. Please try again.');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/grocery.jpg")}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Connect with your friend today!</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder='Enter your name'
                placeholderTextColor={COLORS.black}
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email address</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder='Enter your email address'
                placeholderTextColor={COLORS.black}
                keyboardType='email-address'
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder='+63'
                placeholderTextColor={COLORS.black}
                keyboardType='numeric'
                style={styles.countryCode}
              />
              <TextInput
                value={number}
                onChangeText={setNumber}
                placeholder='Enter your phone number'
                placeholderTextColor={COLORS.black}
                keyboardType='numeric'
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordBox}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder='Enter your password'
                placeholderTextColor={COLORS.black}
                secureTextEntry={!isPasswordShown}
                style={styles.textInput}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={styles.eyeIcon}
              >
                <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Sign Up"
            onPress={handleSignup}
            color={COLORS.primary}
            style={styles.button}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginButton}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 5, // Shadow effect for card
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.Deepgreen,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.Deepgreen,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 8,
    color: COLORS.black,
  },
  inputBox: {
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  countryCode: {
    width: '20%',
    borderRightWidth: 1,
    borderColor: COLORS.grey,
    height: '100%',
    paddingLeft: 8,
  },
  textInput: {
    width: '80%',
  },
  passwordBox: {
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  button: {
    marginTop: 18,
    width: '100%',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    color: COLORS.black,
  },
  loginButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default Signup;
