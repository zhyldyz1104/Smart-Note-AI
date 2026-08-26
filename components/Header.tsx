import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';

interface HeaderProps {
  greeting: string;
  name: string;
  subtitle?: string;
}

export function Header({ greeting, name, subtitle }: HeaderProps) {
  return (
    <LinearGradient colors={Gradients.hero as [string, string, string]} style={styles.container}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.name}>{name}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.xxl + Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  greeting: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    ...Typography.h1,
    color: '#fff',
    marginTop: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
    marginTop: Spacing.xs,
  },
});