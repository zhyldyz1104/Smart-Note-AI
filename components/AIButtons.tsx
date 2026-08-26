import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';

interface AIButtonProps {
  label: string;
  icon: string;
  loading?: boolean;
  onPress: () => void;
}

export function AIButton({ label, icon, loading, onPress }: AIButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={styles.buttonWrap}>
      <LinearGradient colors={Gradients.button as [string, string]} style={styles.button}>
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.icon}>{icon}</Text>
        )}
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

interface AIButtonsProps {
  loading?: boolean;
  onSummarize: () => void;
  onImprove: () => void;
  onFlashcards: () => void;
  onQuiz: () => void;
}

export function AIButtons({ loading, onSummarize, onImprove, onFlashcards, onQuiz }: AIButtonsProps) {
  return (
    <View style={styles.grid}>
      <AIButton label="Summarize" icon="📋" loading={loading} onPress={onSummarize} />
      <AIButton label="Improve" icon="✨" loading={loading} onPress={onImprove} />
      <AIButton label="Flashcards" icon="🃏" loading={loading} onPress={onFlashcards} />
      <AIButton label="Quiz" icon="❓" loading={loading} onPress={onQuiz} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  buttonWrap: {
    flex: 1,
    minWidth: '48%',
  },
  button: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
  },
  icon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.label,
    color: '#fff',
  },
});