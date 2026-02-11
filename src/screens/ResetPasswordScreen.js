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

const API_URL = `${API_BASE_URL}/api/auth/reset-password`;

export default function ResetPasswordScreen({ route, navigation }) {
    const { token } = route.params;

    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!password) {
            Alert.alert('Error', 'Password required');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    newPassword: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Error', data.message || 'Invalid token');
                return;
            }

            Alert.alert('Success', 'Password reset successful', [
                {
                    text: 'Login',
                    onPress: () => navigation.replace('Login'),
                },
            ]);
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
                    <Icon name="lock-closed-outline" size={28} color={Colors.primary} />
                </View>

                <Text style={[styles.title, TextSemiBold]}>
                    Reset Password
                </Text>

                <View style={styles.inputBox}>
                    <Icon name="lock-closed-outline" size={18} color="#777" />
                    <TextInput
                        placeholder="New Password"
                        placeholderTextColor="#666"
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secure}
                    />
                    <TouchableOpacity onPress={() => setSecure(!secure)}>
                        <Icon
                            name={secure ? 'eye-outline' : 'eye-off-outline'}
                            size={18}
                            color="#777"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleReset}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>
                            Update Password
                        </Text>
                    )}
                </TouchableOpacity>
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
