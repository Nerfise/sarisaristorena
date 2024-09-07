import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { Avatar, Input, Button } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ProfileScreen = () => {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [displayName, setDisplayName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // For loading indicator
  const firestore = getFirestore();
  const userDocRef = doc(firestore, 'users', user?.uid);
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user) {
      fetchProfileInfo();
    }
  }, [user]);

  const fetchProfileInfo = async () => {
    try {
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      if (userData) {
        setDisplayName(userData.displayName || '');
        setProfilePhoto(userData.photoURL || '');
        setEmail(userData.email || user.email || '');
        setPhone(userData.phone || '');
        setAddress(userData.address || '');
      }
    } catch (error) {
      console.error('Error fetching profile info:', error);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true); // Show loading indicator
    try {
      let downloadURL = profilePhoto;

      if (profilePhoto && profilePhoto.startsWith('file:')) {
        const response = await fetch(profilePhoto);
        const blob = await response.blob();
        const storageRef = ref(storage, `profile_photos/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        await uploadTask;

        downloadURL = await getDownloadURL(storageRef);
      }

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: downloadURL,
      });

      await setDoc(userDocRef, {
        displayName,
        photoURL: downloadURL,
        email,
        phone,
        address,
      });

      setIsEditing(false);
      Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'There was an issue updating your profile.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged Out', 'You have been successfully logged out.');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'There was an issue signing out.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Avatar
            size="xlarge"
            rounded
            source={profilePhoto ? { uri: profilePhoto } : null}
            showEditButton
            editButton={{
              name: 'edit',
              type: 'font-awesome',
              size: 20,
              color: 'white',
              underlayColor: '#007bff', // Highlight color
            }}
            containerStyle={styles.avatar}
          />
        </TouchableOpacity>
        <Input
          label="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputInnerContainer}
          labelStyle={styles.inputLabel}
          disabled={!isEditing}
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputInnerContainer}
          labelStyle={styles.inputLabel}
          disabled={!isEditing}
        />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputInnerContainer}
          labelStyle={styles.inputLabel}
          disabled={!isEditing}
        />
        <Input
          label="Address"
          value={address}
          onChangeText={setAddress}
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputInnerContainer}
          labelStyle={styles.inputLabel}
          disabled={!isEditing}
        />
        {isEditing ? (
          <>
            <Button
              title={loading ? "Saving..." : "Save Changes"}
              onPress={handleProfileUpdate}
              buttonStyle={styles.saveButton}
              disabled={loading}
              loading={loading} // Show loading spinner on button
            />
            <Button
              title="Cancel"
              onPress={() => setIsEditing(false)}
              buttonStyle={styles.cancelButton}
            />
          </>
        ) : (
          <Button
            title="Edit Profile"
            onPress={() => setIsEditing(true)}
            buttonStyle={styles.editButton}
          />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <FontAwesome name="sign-out" size={20} color="white" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  profileContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Shadow effect for Android
    width: '100%',
    maxWidth: 400, // Maximum width to keep content compact on large screens
  },
  avatar: {
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 8, // Reduced spacing between input fields
  },
  inputInnerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#28a745',
    marginVertical: 3, // Reduced vertical margin for buttons
    width: '90%',
  },
  editButton: {
    backgroundColor: '#007bff',
    marginVertical: 3, // Reduced vertical margin for buttons
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    marginVertical: 3, // Reduced vertical margin for buttons
    width: '100%',
  },
  buttonContainer: {
    marginTop: 1, // Reduced top margin
    width: '100%',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileScreen;
