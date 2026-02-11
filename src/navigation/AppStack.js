import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTabs from './AppTabs';
import ChatScreen from '../screens/ChatScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator();

export default function AppStack({ onLogout }) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* MAIN APP (Bottom Tabs) */}
            <Stack.Screen name="AppTabs">
                {(props) => <AppTabs {...props} onLogout={onLogout} />}
            </Stack.Screen>

            {/* STACK SCREENS (Opened from Tabs) */}
            <Stack.Screen
                name="Search"
                component={SearchScreen}
            />

            <Stack.Screen
                name="Chat"
                component={ChatScreen}
            />
        </Stack.Navigator>
    );
}
