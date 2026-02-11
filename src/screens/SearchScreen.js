import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors } from '../theme/colors';
import { TextSemiBold } from '../theme/globalStyles';
import { API_BASE_URL } from '../config';

const USERS_API = `${API_BASE_URL}/api/users`;
const CREATE_CHAT_API = `${API_BASE_URL}/api/chats/create`;

export default function SearchScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const res = await fetch(USERS_API, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setUsers(data);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log('Fetch users failed', error);
        } finally {
            setLoading(false);
        }
    };

    const startChat = async (userId) => {
        try {
            const token = await AsyncStorage.getItem('token');

            const res = await fetch(CREATE_CHAT_API, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ receiverId: userId }),
            });

            const chat = await res.json();

            if (res.ok) {
                navigation.replace('Chat', {
                    chatId: chat._id,
                });
            } else {
                console.log(chat.message);
            }
        } catch (error) {
            console.log('Create chat failed', error);
        }
    };

    // 🔍 FILTER USERS
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>

                <Text style={[styles.title, TextSemiBold]}>
                    New Chat
                </Text>
            </View>

            {/* 🔍 SEARCH BOX */}
            <View style={styles.searchBox}>
                <Icon name="search" size={18} color="#777" />
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search users"
                    placeholderTextColor="#777"
                    style={styles.searchInput}
                />
            </View>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.userRow}
                            onPress={() => startChat(item._id)}
                        >
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {item.name.charAt(0)}
                                </Text>
                            </View>

                            <View>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.email}>{item.email}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            No users found
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#121212',
    },

    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
    },

    title: {
        color: '#fff',
        fontSize: 18,
    },

    /* 🔍 SEARCH */
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        paddingHorizontal: 14,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1e1e1e',
        gap: 8,
    },

    searchInput: {
        flex: 1,
        color: '#fff',
    },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary + '30',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    avatarText: {
        color: Colors.primary,
        fontSize: 18,
        fontWeight: '700',
    },

    name: {
        color: '#fff',
        fontSize: 16,
    },

    email: {
        color: '#777',
        fontSize: 12,
    },

    emptyText: {
        color: '#777',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 14,
    },
});
