import React, { Component, type ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😵</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.error?.message ?? 'Unexpected error'}</Text>
          <Pressable style={styles.button} onPress={this.reset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emoji: { fontSize: 48, marginBottom: Spacing.md },
  title: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.sm },
  message: { ...Typography.bodySmall, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.lg },
  button: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  buttonText: { ...Typography.label, color: '#fff' },
});