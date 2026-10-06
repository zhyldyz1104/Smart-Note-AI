import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { NoteCard } from '../../components/NoteCard';
import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

export default function CategoryNotesScreen() {
    const { category, userId } = useLocalSearchParams();
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotes = async () => {
            try {
                const q = query(
                    collection(db, `users/${userId}/notes`),
                    where('category', '==', category)
                );

                const snap = await getDocs(q);
                const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

                setNotes(data);
            } catch (e) {
                console.log('Error loading notes:', e);
            } finally {
                setLoading(false);
            }
        };

        loadNotes();
    }, [category]);

    if (loading) {
        return (
            <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={Colors.primary[400]} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 80 }}>
            <Pressable onPress={() => router.back()} style={{ marginBottom: Spacing.md }}>
                <Text style={{ color: Colors.primary[400], ...Typography.body }}>← Back</Text>
            </Pressable>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {String(category).charAt(0).toUpperCase() + String(category).slice(1)} Notes
                </Text>
                <Text style={styles.headerSubtitle}>
                    All notes categorized under "{category}"
                </Text>
            </View>

            {/* Empty State */}
            {notes.length === 0 && (
                <View style={styles.empty}>
                    <Text style={styles.emptyEmoji}>📭</Text>
                    <Text style={styles.emptyText}>No notes found in this category</Text>
                </View>
            )}

            {/* Notes List */}
            <View style={styles.list}>
                {notes.map((note, i) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        index={i}
                        onPress={(n) => router.push(`/notes/${n.id}?userId=${userId}`)}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background, // dark background
        paddingHorizontal: Spacing.lg,
    },

    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },

    header: {
        marginTop: Spacing.xl,
        marginBottom: Spacing.lg,
    },

    headerTitle: {
        ...Typography.h1,
        color: Colors.text,
        marginBottom: Spacing.xs,
    },

    headerSubtitle: {
        ...Typography.caption,
        color: Colors.textMuted,
    },

    list: {
        marginTop: Spacing.md,
    },

    empty: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl,
    },

    emptyEmoji: {
        fontSize: 48,
        marginBottom: Spacing.sm,
    },

    emptyText: {
        ...Typography.body,
        color: Colors.textMuted,
    },
});
