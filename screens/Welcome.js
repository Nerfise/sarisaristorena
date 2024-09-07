import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import Button from '../components/Button';

const Welcome = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/grocery.jpg")}
                style={styles.backgroundImage}
            />

            <LinearGradient
                style={styles.overlay}
                colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.5)']}  // Semi-transparent black gradient
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Let's Get</Text>
                    <Text style={styles.title}>Started</Text>

                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>Enjoy Browsing for the products</Text>
                        <Text style={styles.subtitle}>Keep using our application</Text>
                    </View>

                    <Button
                        title="Join Now"
                        onPress={() => navigation.navigate("Signup")}
                        style={styles.button}
                    />

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account?</Text>
                        <Pressable onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.loginButton}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </LinearGradient>
        </View>
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',  // Semi-transparent white background
        padding: 20,
        borderRadius: 15,
        width: '80%',
        alignItems: 'center',
        elevation: 5,  // Shadow effect for card
    },
    title: {
        fontSize: 40,
        fontWeight: '700',
        color: COLORS.Deepgreen,
        textAlign: 'center',
        marginVertical: 10,
    },
    subtitleContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.Deepgreen,
        textAlign: 'center',
        marginVertical: 4,
    },
    button: {
        marginTop: 20,
        width: '100%',
    },
    loginContainer: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 16,
        color: COLORS.Deepgreen,
    },
    loginButton: {
        fontSize: 16,
        color: COLORS.brightorange,
        fontWeight: 'bold',
        marginLeft: 4,
    },
});

export default Welcome;
