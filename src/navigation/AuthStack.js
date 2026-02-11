import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
// import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack({ showSplash, onLoginSuccess }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {showSplash && (
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                />
            )}

            {!showSplash && (
                <>
                    <Stack.Screen name="Login">
                        {(props) => (
                            <LoginScreen
                                {...props}
                                onLoginSuccess={onLoginSuccess}
                            />
                        )}
                    </Stack.Screen>

                    <Stack.Screen
                        name="Signup"
                        component={SignupScreen}
                    />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    {/* <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} /> */}

                </>
            )}
        </Stack.Navigator>
    );
}
