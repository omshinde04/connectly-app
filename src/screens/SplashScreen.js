import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors } from '../theme/colors';
import { TextSemiBold } from '../theme/globalStyles';
import { useIsFocused } from '@react-navigation/native';


export default function SplashScreen({ navigation }) {
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const isFocused = useIsFocused();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2200,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        const timer = setTimeout(() => {
            // navigation.replace('Login');
        }, 2600);

        return () => clearTimeout(timer);
    }, [isFocused]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            {/* Background glows */}
            <View style={styles.glowTop} />
            <View style={styles.glowBottom} />

            {/* Center section */}
            <View style={styles.centerWrapper}>
                <Animated.View
                    style={[
                        styles.centerContent,
                        {
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Logo */}
                    <View style={styles.logoWrapper}>
                        <View style={styles.logoGlow} />
                        <View style={styles.logo}>
                            <Icon name="chatbubble" size={54} color="#fff" />
                            <View style={styles.onlineDot} />
                        </View>
                    </View>

                    {/* Brand */}
                    <Text style={[styles.title, TextSemiBold]}>Connectly</Text>

                    <View style={styles.subtitleRow}>
                        <View style={styles.line} />
                        <Text style={styles.subtitle}>PREMIUM MESSAGING</Text>
                        <View style={styles.line} />
                    </View>
                </Animated.View>
            </View>

            {/* Bottom section */}
            <View style={styles.bottom}>
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>INITIALISING</Text>
                        <Text style={styles.progressPercent}>100%</Text>
                    </View>

                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                { width: progressWidth },
                            ]}
                        />
                    </View>
                </View>

                <Text style={styles.footerText}>
                    SECURE • SEAMLESS • MODERN
                </Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#102216',
    },

    glowTop: {
        position: 'absolute',
        top: -120,
        right: -120,
        width: 260,
        height: 260,
        backgroundColor: Colors.primary + '20',
        borderRadius: 130,
    },

    glowBottom: {
        position: 'absolute',
        bottom: -120,
        left: -120,
        width: 260,
        height: 260,
        backgroundColor: Colors.primary + '20',
        borderRadius: 130,
    },

    /* ---- CENTER ---- */

    centerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    centerContent: {
        alignItems: 'center',
    },

    logoWrapper: {
        marginBottom: 28,
    },

    logoGlow: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 30,
        backgroundColor: Colors.primary + '30',
        top: -15,
        alignSelf: 'center',
    },

    logo: {
        width: 120,
        height: 120,
        borderRadius: 24,
        backgroundColor: '#102216',
        borderWidth: 1,
        borderColor: Colors.primary + '40',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOpacity: 0.5,
        shadowRadius: 25,
    },

    onlineDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 42,
        marginBottom: 8,
    },

    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    subtitle: {
        color: Colors.primary,
        fontSize: 12,
        letterSpacing: 3,
    },

    line: {
        width: 32,
        height: 1,
        backgroundColor: Colors.primary + '40',
    },

    /* ---- BOTTOM ---- */

    bottom: {
        paddingHorizontal: 32,
        paddingBottom: 40,
    },

    progressContainer: {
        marginBottom: 26,
    },

    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    progressLabel: {
        color: Colors.primary + '80',
        fontSize: 10,
        letterSpacing: 2,
    },

    progressPercent: {
        color: Colors.primary,
        fontSize: 10,
    },

    progressBar: {
        height: 4,
        backgroundColor: '#ffffff10',
        borderRadius: 4,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
    },

    footerText: {
        color: '#ffffff55',
        fontSize: 11,
        letterSpacing: 1,
        textAlign: 'center',
    },
});
