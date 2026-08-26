import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';
import { getCategoryById } from '../lib/storage/categories';
import type { Note } from '../lib/storage/notes';

interface NoteCardProps {
  note: Note;
  onPress?: (note: Note) => void;
  onStar?: (id: string) => void;
  index?: number;
}

export function NoteCard({ note, onPress, onStar, index = 0 }: NoteCardProps) {
  const category = getCategoryById(note.category);

  return (
    <Animated.View entering={FadeIn.delay(index * 60).duration(300)}>
      <Pressable style={styles.container} onPress={() => onPress?.(note)}>
        <View style={styles.topRow}>
          <View style={[styles.categoryBadge, { backgroundColor: `${category?.color ?? Colors.primary[500]}33` }]}>
            <Text style={[styles.categoryText, { color: category?.color ?? Colors.primary[400] }]}>
              {category?.icon} {category?.name ?? note.category}
            </Text>
          </View>
          <Pressable hitSlop={12} onPress={() => onStar?.(note.id)}>
            <Text style={styles.star}>{note.starred ? '⭐' : '☆'}</Text>
          </Pressable>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {note.preview}
        </Text>
        <Text style={styles.date}>{new Date(note.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  categoryText: {
    ...Typography.caption,
    fontFamily: 'Inter-Medium',
  },
  star: {
    fontSize: 18,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  preview: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  date: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});