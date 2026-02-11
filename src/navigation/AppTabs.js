import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import ChatsScreen from '../screens/ChatsScreen';
import StatusScreen from '../screens/StatusScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppTabs({ onLogout }) {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopColor: '#1f1f1f',
                    height: 64,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 6,
                },

                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: '#888',

                tabBarIcon: ({ color }) => {
                    let iconName;

                    if (route.name === 'Chats') {
                        iconName = 'chatbubble-ellipses';
                    } else if (route.name === 'Status') {
                        iconName = 'radio-button-on'; // WhatsApp-like
                    } else if (route.name === 'Profile') {
                        iconName = 'person';
                    }

                    return <Icon name={iconName} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Chats" component={ChatsScreen} />
            <Tab.Screen name="Status" component={StatusScreen} />
            <Tab.Screen name="Profile">
                {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
            </Tab.Screen>

        </Tab.Navigator>
    );
}
