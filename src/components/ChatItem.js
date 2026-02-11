import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { TextMedium } from '../theme/globalStyles';

export default function ChatItem({ item, onPress }) {
    if (!item?.otherUser) return null;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {/* Avatar */}
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {item.otherUser.name.charAt(0)}
                </Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={[styles.name, TextMedium]}>
                        {item.otherUser.name}
                    </Text>

                    <View style={styles.rightTop}>
                        {item.updatedAt && (
                            <Text style={styles.time}>
                                {new Date(item.updatedAt).toLocaleTimeString(
                                    [],
                                    { hour: '2-digit', minute: '2-digit' }
                                )}
                            </Text>
                        )}

                        {/* 🔥 UNREAD BADGE */}
                        {item.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>
                                    {item.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <Text style={styles.message} numberOfLines={1}>
                    {item.lastMessage?.text || 'No messages yet'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.primary + '30',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    avatarText: {
        color: Colors.primary,
        fontSize: 20,
        fontWeight: '700',
    },

    content: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
        paddingBottom: 8,
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        alignItems: 'center',
    },

    rightTop: {
        alignItems: 'flex-end',
    },

    name: {
        color: '#fff',
        fontSize: 16,
    },

    time: {
        color: '#888',
        fontSize: 12,
    },

    message: {
        color: '#aaa',
        fontSize: 14,
    },

    unreadBadge: {
        marginTop: 4,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#25D366', // WhatsApp green
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },

    unreadText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '700',
    },
});
