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
import { TextSemiBold, TextMedium } from '../theme/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';


const API_URL = `${API_BASE_URL}/api/auth/login`;
export default function LoginScreen({ navigation, onLoginSuccess }) {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Email and password are required');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error('Invalid JSON from server');
            }

            console.log('LOGIN RESPONSE 👉', data);

            if (!response.ok) {
                throw new Error(data?.message || 'Invalid credentials');
            }

            if (!data?.token) {
                throw new Error('Token missing in response');
            }

            // ✅ Save token
            await AsyncStorage.setItem('token', String(data.token));

            // ✅ FIXED userId resolution
            const userId =
                data.user?._id ||
                data.user?.id ||   // 🔥 IMPORTANT LINE
                data.userId ||
                data.id;

            if (!userId) {
                throw new Error('User ID missing in response');
            }

            await AsyncStorage.setItem('userId', String(userId));

            console.log('✅ SAVED USER ID 👉', userId);

            Alert.alert('Success', 'Login successful', [
                {
                    text: 'Continue',
                    onPress: onLoginSuccess,
                },
            ]);

        } catch (error) {
            console.error('LOGIN ERROR 👉', error);
            Alert.alert('Login Error', error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            {/* Background glow */}
            <View style={styles.glowTop} />
            <View style={styles.glowBottom} />

            <View style={styles.cardWrapper}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoBox}>
                        <Icon name="chatbubble-ellipses" size={28} color={Colors.primary} />
                    </View>
                    <Text style={[styles.appName, TextSemiBold]}>Connectly</Text>
                    <Text style={styles.tagline}>The future of secure messaging</Text>
                </View>

                {/* Card */}
                <View style={styles.card}>
                    <Text style={[styles.cardTitle, TextSemiBold]}>
                        Welcome Back
                    </Text>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL ADDRESS</Text>
                        <View style={styles.inputBox}>
                            <Icon name="mail-outline" size={18} color="#888" />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="name@example.com"
                                placeholderTextColor="#666"
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <View style={styles.inputBox}>
                            <Icon name="lock-closed-outline" size={18} color="#888" />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#666"
                                style={styles.input}
                                secureTextEntry={secure}
                            />
                            <TouchableOpacity onPress={() => setSecure(!secure)}>
                                <Icon
                                    name={secure ? 'eye-outline' : 'eye-off-outline'}
                                    size={18}
                                    color="#888"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Forgot */}
                    <TouchableOpacity style={styles.forgot}>
                        <Text
                            style={styles.forgotText}
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <>
                                <Text style={styles.loginText}>Sign In</Text>
                                <Icon name="arrow-forward" size={18} color="#000" />
                            </>
                        )}
                    </TouchableOpacity>

                </View>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                    <View style={styles.line} />
                </View>

                {/* Social */}
                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Icon name="logo-google" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Icon name="logo-apple" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Don’t have an account?
                    <Text
                        style={styles.footerLink}
                        onPress={() => navigation.navigate('Signup')}
                    >
                        {' '}Create Account
                    </Text>
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

    glowTop: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        backgroundColor: Colors.primary + '10',
        borderRadius: 150,
    },

    glowBottom: {
        position: 'absolute',
        bottom: -100,
        left: -100,
        width: 260,
        height: 260,
        backgroundColor: Colors.primary + '08',
        borderRadius: 130,
    },

    cardWrapper: {
        width: '100%',
        maxWidth: 400,
    },

    header: {
        alignItems: 'center',
        marginBottom: 32,
    },

    logoBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: Colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.primary + '30',
    },

    appName: {
        fontSize: 28,
        color: '#fff',
        marginBottom: 4,
    },

    tagline: {
        color: '#999',
        fontSize: 14,
    },

    card: {
        backgroundColor: '#121212',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#ffffff10',
    },

    cardTitle: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 24,
    },

    inputGroup: {
        marginBottom: 20,
    },

    label: {
        position: 'absolute',
        top: -8,
        left: 20,
        backgroundColor: '#121212',
        paddingHorizontal: 6,
        fontSize: 10,
        color: Colors.primary,
        letterSpacing: 1.5,
        zIndex: 10,
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
    },

    input: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
    },

    forgot: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },

    forgotText: {
        color: '#999',
        fontSize: 13,
    },

    loginButton: {
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 4,
        shadowColor: Colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },

    loginText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginVertical: 24,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ffffff10',
    },

    dividerText: {
        fontSize: 10,
        color: '#777',
        letterSpacing: 2,
    },

    socialRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },

    socialButton: {
        flex: 1,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#121212',
        borderWidth: 1,
        borderColor: '#ffffff10',
        justifyContent: 'center',
        alignItems: 'center',
    },

    footer: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
    },

    footerLink: {
        color: Colors.primary,
        fontWeight: '700',
    },
});
