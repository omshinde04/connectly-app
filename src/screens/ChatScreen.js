import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MessageBubble from '../components/MessageBubble';
import { Colors } from '../theme/colors';
import { TextSemiBold, TextMedium } from '../theme/globalStyles';

import {
    connectSocket,
    joinChatRoom,
    sendSocketMessage,
    onNewMessage,
    disconnectSocket,
} from '../services/socket';
import { API_BASE_URL } from '../config';

const BASE_URL = `${API_BASE_URL}/api/messages`;

export default function ChatScreen({ route, navigation }) {
    const { chatId, otherUser } = route.params; // 🔥 IMPORTANT

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState('');

    const flatListRef = useRef(null);

    /* 👤 LOAD CURRENT USER */
    useEffect(() => {
        (async () => {
            const id = await AsyncStorage.getItem('userId');
            setCurrentUserId(id ? id.trim() : '');
        })();
    }, []);

    /* 📥 LOAD MESSAGES */
    useEffect(() => {
        fetchMessages();
    }, [chatId]);

    const markAsRead = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        await fetch('http://10.0.2.2:3000/api/messages/read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ chatId }),
        });
    };

    useEffect(() => {
        if (!loading && messages.length > 0) {
            markAsRead();
        }
    }, [loading, messages]);

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const res = await fetch(`${BASE_URL}/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                const normalized = (data.messages || []).map((m) => ({
                    ...m,
                    _id: String(m._id),
                    sender:
                        typeof m.sender === 'object'
                            ? String(m.sender._id)
                            : String(m.sender),
                }));

                setMessages(normalized);
            }
        } catch (err) {
            console.log('❌ Fetch messages failed:', err);
        } finally {
            setLoading(false);
        }
    };

    /* 🔌 SOCKET */
    useEffect(() => {
        let active = true;

        (async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            connectSocket(token);
            joinChatRoom(chatId);

            onNewMessage((message) => {
                if (!active) return;

                const normalizedMessage = {
                    ...message,
                    _id: String(message._id),
                    sender: String(message.sender),
                };

                setMessages((prev) =>
                    prev.some((m) => m._id === normalizedMessage._id)
                        ? prev
                        : [...prev, normalizedMessage]
                );
            });
        })();

        return () => {
            active = false;
            disconnectSocket();
        };
    }, [chatId]);

    /* 📤 SEND MESSAGE */
    const sendMessage = () => {
        if (!text.trim()) return;
        sendSocketMessage(chatId, text.trim());
        setText('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* 🔥 HEADER LIKE WHATSAPP */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>

                {/* Avatar */}
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {otherUser?.name?.charAt(0)}
                    </Text>
                </View>

                {/* Name */}
                <View>
                    <Text style={[styles.name, TextSemiBold]}>
                        {otherUser?.name || 'Chat'}
                    </Text>
                    {/* <Text style={styles.status}>online</Text> */}
                </View>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            >
                {loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <MessageBubble
                                message={item}
                                currentUserId={currentUserId}
                            />
                        )}
                        contentContainerStyle={{ paddingVertical: 10 }}
                        onContentSizeChange={() =>
                            flatListRef.current?.scrollToEnd({ animated: true })
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <View style={styles.inputBar}>
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder="Type a message"
                        placeholderTextColor="#777"
                        style={styles.input}
                        multiline
                    />
                    <TouchableOpacity onPress={sendMessage}>
                        <Icon name="send" size={22} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        gap: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary + '40',
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatarText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '700',
    },

    name: {
        color: '#fff',
        fontSize: 16,
    },

    status: {
        color: '#4CAF50',
        fontSize: 12,
    },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: '#1f1f1f',
        backgroundColor: '#121212',
    },

    input: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        color: '#fff',
        maxHeight: 100,
    },
});
