import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors } from '../theme/colors';
import { TextSemiBold } from '../theme/globalStyles';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/auth/forgot-password`;

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgot = async () => {
        if (!email) {
            Alert.alert('Error', 'Email is required');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Error', data.message || 'Try again');
                return;
            }

            Alert.alert(
                'Check Your Email',
                'A password reset link has been sent to your email.',
                [
                    {
                        text: 'Back to Login',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Server error');
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.iconBox}>
                    <Icon name="mail-outline" size={28} color={Colors.primary} />
                </View>

                <Text style={[styles.title, TextSemiBold]}>
                    Forgot Password
                </Text>
                <Text style={styles.subtitle}>
                    Enter your registered email
                </Text>

                <View style={styles.inputBox}>
                    <Icon name="mail-outline" size={18} color="#777" />
                    <TextInput
                        placeholder="name@example.com"
                        placeholderTextColor="#666"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleForgot}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>
                            Send Reset Link
                        </Text>
                    )}
                </TouchableOpacity>

                <Text
                    style={styles.back}
                    onPress={() => navigation.goBack()}
                >
                    Back to Login
                </Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#121212',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#ffffff10',
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: Colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 6,
    },
    subtitle: {
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        borderRadius: 26,
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 18,
        gap: 10,
        borderWidth: 1,
        borderColor: '#ffffff10',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
    },
    button: {
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    back: {
        color: Colors.primary,
        textAlign: 'center',
        marginTop: 20,
        fontWeight: '600',
    },
});
