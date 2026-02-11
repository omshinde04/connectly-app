import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';

export default function MessageBubble({ message, currentUserId }) {
    const senderId = String(message.sender);
    const myId = String(currentUserId);

    const isMe = senderId === myId;

    // ✅ DELIVERED (receiver online)
    const isDelivered =
        isMe &&
        Array.isArray(message.deliveredTo) &&
        message.deliveredTo.some((id) => String(id) !== myId);

    // ✅ READ (receiver opened chat)
    const isRead =
        isMe &&
        Array.isArray(message.readBy) &&
        message.readBy.some((id) => String(id) !== myId);

    return (
        <View style={[styles.row, isMe ? styles.right : styles.left]}>
            <View
                style={[
                    styles.bubble,
                    isMe ? styles.myBubble : styles.otherBubble,
                ]}
            >
                <Text style={[styles.text, { color: isMe ? '#000' : '#fff' }]}>
                    {message.text}
                </Text>

                <View style={styles.meta}>
                    <Text style={styles.time}>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>

                    {isMe && (
                        <Icon
                            name={
                                isRead
                                    ? 'checkmark-done'
                                    : isDelivered
                                        ? 'checkmark-done'
                                        : 'checkmark'
                            }
                            size={14}
                            color={
                                isRead
                                    ? '#0A84FF'   // 🔵 read
                                    : isDelivered
                                        ? '#777'      // ⚪ delivered
                                        : '#000'      // ✔ sent
                            }
                        />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 4,
        paddingHorizontal: 10,
    },
    left: { justifyContent: 'flex-start' },
    right: { justifyContent: 'flex-end' },

    bubble: {
        maxWidth: '75%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    myBubble: {
        backgroundColor: Colors.primary,
        borderTopRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#1e1e1e',
        borderTopLeftRadius: 4,
    },
    text: {
        fontSize: 15,
        lineHeight: 20,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        marginTop: 4,
    },
    time: {
        fontSize: 10,
        color: '#aaa',
    },
});
