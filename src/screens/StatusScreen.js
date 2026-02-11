import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors } from '../theme/colors';
import { TextSemiBold, TextMedium } from '../theme/globalStyles';

const RECENT_STATUS = [
    { id: '1', name: 'Aarav', time: '10 minutes ago' },
    { id: '2', name: 'Riya', time: 'Today, 9:20 AM' },
];

const VIEWED_STATUS = [
    { id: '3', name: 'Karan', time: 'Yesterday, 8:10 PM' },
];

export default function StatusScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, TextSemiBold]}>
                    Status
                </Text>
                <View style={styles.headerActions}>
                    <Icon name="camera-outline" size={22} color="#fff" />
                    <Icon name="ellipsis-vertical" size={20} color="#fff" />
                </View>
            </View>

            <FlatList
                ListHeaderComponent={
                    <>
                        {/* MY STATUS */}
                        <TouchableOpacity style={styles.myStatus}>
                            <View style={styles.myAvatar}>
                                <Text style={styles.avatarText}>O</Text>
                                <View style={styles.addIcon}>
                                    <Icon name="add" size={16} color="#000" />
                                </View>
                            </View>

                            <View>
                                <Text style={[styles.name, TextMedium]}>
                                    My Status
                                </Text>
                                <Text style={styles.subText}>
                                    Tap to add status update
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* RECENT */}
                        <Text style={styles.sectionTitle}>
                            Recent updates
                        </Text>
                    </>
                }
                data={RECENT_STATUS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <StatusRow item={item} />
                )}
                ListFooterComponent={
                    <>
                        <Text style={styles.sectionTitle}>
                            Viewed updates
                        </Text>
                        {VIEWED_STATUS.map((item) => (
                            <StatusRow key={item.id} item={item} viewed />
                        ))}
                    </>
                }
            />
        </SafeAreaView>
    );
}

/* ---------- STATUS ROW ---------- */
function StatusRow({ item, viewed }) {
    return (
        <TouchableOpacity style={styles.row}>
            <View
                style={[
                    styles.avatar,
                    {
                        borderColor: viewed
                            ? '#444'
                            : Colors.primary,
                    },
                ]}
            >
                <Text style={styles.avatarText}>
                    {item.name.charAt(0)}
                </Text>
            </View>

            <View>
                <Text style={[styles.name, TextMedium]}>
                    {item.name}
                </Text>
                <Text style={styles.subText}>{item.time}</Text>
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

    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },

    /* MY STATUS */
    myStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },

    myAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    addIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* STATUS ROW */
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
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

    subText: {
        color: '#888',
        fontSize: 13,
    },

    sectionTitle: {
        color: '#aaa',
        fontSize: 14,
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 16,
    },
});
