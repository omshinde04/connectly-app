import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import ChatItem from '../components/ChatItem';
import { Colors } from '../theme/colors';
import { TextSemiBold } from '../theme/globalStyles';

import {
    connectSocket,
    onNewMessage,
} from '../services/socket';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/chats`;

export default function ChatsScreen({ navigation }) {
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');

    /* 🔁 REFRESH ON SCREEN FOCUS */
    useFocusEffect(
        useCallback(() => {
            fetchChats();
        }, [])
    );

    /* 🔌 SOCKET (LAST MESSAGE UPDATE) */
    useEffect(() => {
        const initSocket = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            connectSocket(token);

            onNewMessage((payload) => {
                setChats((prev) => {
                    const updated = prev.map(chat =>
                        chat._id === payload.chat
                            ? {
                                ...chat,
                                lastMessage: payload,
                                updatedAt: payload.createdAt,
                            }
                            : chat
                    );

                    const active = updated.find(c => c._id === payload.chat);
                    const others = updated.filter(c => c._id !== payload.chat);

                    return active ? [active, ...others] : updated;
                });

                setFilteredChats(prev => prev);
            });
        };

        initSocket();
    }, []);

    /* 📥 FETCH CHATS */
    const fetchChats = async () => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const res = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                },
            });

            const data = await res.json();
            if (!res.ok || !Array.isArray(data)) return;

            setChats(data);
            setFilteredChats(data);
        } catch (err) {
            console.log('❌ Chat fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };

    /* 🔍 SEARCH */
    const handleSearch = (text) => {
        setQuery(text);

        if (!text.trim()) {
            setFilteredChats(chats);
            return;
        }

        const filtered = chats.filter(chat =>
            chat.otherUser?.name
                ?.toLowerCase()
                .includes(text.toLowerCase())
        );

        setFilteredChats(filtered);
    };

    const closeSearch = () => {
        setSearchOpen(false);
        setQuery('');
        setFilteredChats(chats);
    };

    /* 🎮 GAME INVITE */
    const sendGameInvite = async (item) => {
        console.log('🎮 Game invite to:', item.otherUser);

        Alert.alert(
            'Play Game',
            `Send game invite to ${item.otherUser.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Invite',
                    onPress: () => {
                        // 🔥 FOR NOW: DIRECT NAVIGATION
                        // Later we’ll add socket invite/accept flow
                        navigation.navigate('Game', {
                            opponent: item.otherUser,
                            chatId: item._id,
                        });
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* HEADER */}
            <View style={styles.header}>
                {!searchOpen ? (
                    <>
                        <Text style={[styles.title, TextSemiBold]}>
                            Chats
                        </Text>

                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => setSearchOpen(true)}
                            >
                                <Icon name="search" size={22} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.iconButton}>
                                <Icon name="ellipsis-vertical" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.searchBar}>
                        <Icon name="search" size={18} color="#888" />
                        <TextInput
                            value={query}
                            onChangeText={handleSearch}
                            placeholder="Search chats"
                            placeholderTextColor="#777"
                            style={styles.searchInput}
                            autoFocus
                        />
                        <TouchableOpacity onPress={closeSearch}>
                            <Icon name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* BODY */}
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredChats}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <ChatItem
                            item={item}
                            onPress={() =>
                                navigation.navigate('Chat', {
                                    chatId: item._id,
                                    otherUser: item.otherUser,
                                })
                            }
                            onGamePress={sendGameInvite} // 🔥 CONNECTED
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            No conversations found
                        </Text>
                    }
                />
            )}

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Search')}
            >
                <Icon name="create-outline" size={24} color="#000" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },

    header: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
    },

    title: { fontSize: 22, color: '#fff' },
    headerActions: { flexDirection: 'row', gap: 8 },

    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 20,
        paddingHorizontal: 12,
        gap: 8,
        height: 40,
    },

    searchInput: { flex: 1, color: '#fff' },

    listContent: { paddingBottom: 100 },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyText: {
        color: '#777',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 14,
    },

    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
