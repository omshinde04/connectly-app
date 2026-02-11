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

const API_URL = `${API_BASE_URL}/api/auth/signup`;

export default function SignupScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Signup Failed', data.message || 'Try again');
                return;
            }

            Alert.alert(
                'Account Created',
                'You can now login',
                [
                    {
                        text: 'Login',
                        onPress: () => navigation.replace('Login'),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Backend not reachable');
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
                        <Icon
                            name="person-add-outline"
                            size={28}
                            color={Colors.primary}
                        />
                    </View>
                    <Text style={[styles.appName, TextSemiBold]}>
                        Create Account
                    </Text>
                    <Text style={styles.tagline}>
                        Join the future of messaging
                    </Text>
                </View>

                {/* Card */}
                <View style={styles.card}>
                    <Text style={[styles.cardTitle, TextSemiBold]}>
                        Sign Up
                    </Text>

                    {/* Username */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>USERNAME</Text>
                        <View style={styles.inputBox}>
                            <Icon name="person-outline" size={18} color="#888" />
                            <TextInput
                                value={username}
                                onChangeText={setUsername}
                                placeholder="yourname"
                                placeholderTextColor="#666"
                                style={styles.input}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

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

                    {/* SIGNUP BUTTON */}
                    <TouchableOpacity
                        style={styles.signupButton}
                        onPress={handleSignup}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.signupText}>
                                Create Account
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Already have an account?
                    <Text
                        style={styles.footerLink}
                        onPress={() => navigation.navigate('Login')}
                    >
                        {' '}Login
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
        fontSize: 26,
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

    signupButton: {
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
        shadowColor: Colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },

    signupText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },

    footer: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 24,
    },

    footerLink: {
        color: Colors.primary,
        fontWeight: '700',
    },
});
