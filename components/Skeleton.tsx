import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing, Radius } from '../constants/spacing';

export function NoteCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={[styles.line, { width: '40%', height: 16 }]} />
      <View style={[styles.line, { width: '90%', height: 18, marginTop: Spacing.sm }]} />
      <View style={[styles.line, { width: '70%', height: 14, marginTop: Spacing.xs }]} />
      <View style={[styles.line, { width: '30%', height: 12, marginTop: Spacing.sm }]} />
    </View>
  );
}

export function NotesListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <NoteCardSkeleton key={i} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  line: {
    backgroundColor: Colors.border,
    borderRadius: Radius.sm,
  },
});