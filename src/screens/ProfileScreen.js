import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


import { Colors } from '../theme/colors';
import { TextSemiBold, TextMedium } from '../theme/globalStyles';

export default function ProfileScreen({ onLogout }) {

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            onLogout(); // 🔥 switch back to AuthStack
        } catch (error) {
            console.log('Logout failed');
        }
    };
    const confirmLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: handleLogout }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, TextSemiBold]}>
                    Profile
                </Text>
                <TouchableOpacity>
                    <Icon name="create-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* PROFILE CARD */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>O</Text>
                        <View style={styles.onlineDot} />
                    </View>

                    <Text style={[styles.name, TextSemiBold]}>
                        Om Shinde
                    </Text>
                    <Text style={styles.email}>
                        omshinde@gmail.com
                    </Text>
                </View>

                {/* SETTINGS */}
                <View style={styles.section}>
                    <ProfileRow
                        icon="person-outline"
                        label="Edit Profile"
                    />
                    <ProfileRow
                        icon="lock-closed-outline"
                        label="Account & Security"
                    />
                    <ProfileRow
                        icon="notifications-outline"
                        label="Notifications"
                    />
                    <ProfileRow
                        icon="shield-checkmark-outline"
                        label="Privacy"
                    />
                    <ProfileRow
                        icon="help-circle-outline"
                        label="Help & Support"
                    />
                </View>

                {/* LOGOUT */}
                <TouchableOpacity style={styles.logout} onPress={confirmLogout}>
                    <Icon name="log-out-outline" size={20} color="#ff4d4d" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>


            </ScrollView>
        </SafeAreaView>
    );
}

/* ---------- ROW COMPONENT ---------- */
function ProfileRow({ icon, label, onPress }) {
    return (
        <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={styles.rowLeft}>
                <Icon name={icon} size={20} color={Colors.primary} />
                <Text style={[styles.rowText, TextMedium]}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#121212',
    },

    /* HEADER */
    header: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
    },

    headerTitle: {
        fontSize: 20,
        color: '#fff',
    },

    /* CONTENT */
    container: {
        padding: 24,
    },

    /* PROFILE */
    profileCard: {
        alignItems: 'center',
        marginBottom: 32,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: Colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },

    avatarText: {
        fontSize: 42,
        color: Colors.primary,
        fontWeight: '700',
    },

    onlineDot: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: '#121212',
    },

    name: {
        color: '#fff',
        fontSize: 22,
    },

    email: {
        color: '#888',
        marginTop: 4,
    },

    /* SETTINGS */
    section: {
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 32,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },

    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    rowText: {
        color: '#fff',
        fontSize: 16,
    },

    /* LOGOUT */
    logout: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ff4d4d40',
    },

    logoutText: {
        color: '#ff4d4d',
        fontSize: 16,
        fontWeight: '600',
    },
});
