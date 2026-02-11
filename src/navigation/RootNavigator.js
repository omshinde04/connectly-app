import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigator() {
    const [showSplash, setShowSplash] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                if (token) {
                    // ✅ token exists → user already logged in
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.log('Auth check failed');
            } finally {
                // Hide splash after auth check
                setTimeout(() => {
                    setShowSplash(false);
                }, 2600);
            }
        };

        checkAuth();
    }, []);

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <AppStack onLogout={() => setIsLoggedIn(false)} />
            ) : (
                <AuthStack
                    showSplash={showSplash}
                    onLoginSuccess={() => setIsLoggedIn(true)}
                />
            )}

        </NavigationContainer>
    );
}
