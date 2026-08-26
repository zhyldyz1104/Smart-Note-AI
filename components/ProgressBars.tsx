import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { Radius, Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

interface ProgressItem {
    label: string;
    value: number; // 0..1
    color?: string;
}

export function ProgressBars({ items }: { items: ProgressItem[] }) {
    return (
        <View style={styles.container}>
            {items.map((item, i) => (
                <ProgressBar key={i} item={item} />
            ))}
        </View>
    );
}

function ProgressBar({ item }: { item: ProgressItem }) {
    const width = useSharedValue(0);

    useEffect(() => {
        width.value = withTiming(item.value, { duration: 800 });
    }, [item.value]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${width.value * 100}%`,
    }));

    return (
        <View style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.track}>
                <Animated.View
                    style={[styles.fill, animatedStyle, { backgroundColor: item.color ?? Colors.primary[500] }]}
                />
            </View>
            <Text style={styles.percent}>{Math.round(item.value * 100)}%</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    label: {
        ...Typography.bodySmall,
        color: Colors.text,
        width: 80,
    },
    track: {
        flex: 1,
        height: 10,
        backgroundColor: Colors.surfaceLight,
        borderRadius: Radius.full,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: Radius.full,
    },
    percent: {
        ...Typography.caption,
        color: Colors.textMuted,
        width: 36,
        textAlign: 'right',
    },
});