import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.replace("Main"); // Ensure it navigates to the main tab navigator
      })
      .catch((error) => {
        console.error('Error signing in:', error);
        Alert.alert('Login Error', error.message || 'Failed to sign in. Please try again.');
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
          <Text style={styles.title}>Hi Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Hello again, you have been missed!</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email address</Text>
            <View style={styles.inputBox}>
              <TextInput
                onChangeText={text => setEmail(text)}
                value={email}
                placeholder='Enter your email address'
                placeholderTextColor={COLORS.black}
                keyboardType='email-address'
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordBox}>
              <TextInput
                onChangeText={text => setPassword(text)}
                value={password}
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
            title="Login"
            onPress={handleSignIn}
            color={COLORS.primary}
            style={styles.button}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupButton}>Register</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  textInput: {
    width: '100%',
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.grey,
    marginHorizontal: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 22,
  },
  signupText: {
    fontSize: 16,
    color: COLORS.black,
  },
  signupButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default Login;
