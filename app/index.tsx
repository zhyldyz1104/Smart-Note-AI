import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const steps = [
    { title: 'Capture every thought', desc: 'Smart Note AI keeps your ideas organized and searchable.', emoji: '📝' },
    { title: 'AI that understands you', desc: 'Summarize, improve, and turn notes into flashcards & quizzes.', emoji: '🤖' },
    { title: 'Study smarter', desc: 'Track progress and learn faster with AI-powered tools.', emoji: '🚀' },
  ];

  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s + 1) % steps.length), 2500);
    return () => clearTimeout(t);
  }, [step]);

  return (
    // <LinearGradient colors={Gradients.hero as [string, string, string]} style={styles.container}>
    <View style={[styles.container, { backgroundColor: Colors.primary[400] }]}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
        <Text style={styles.emoji}>{steps[step].emoji}</Text>
        <Text style={styles.title}>{steps[step].title}</Text>
        <Text style={styles.desc}>{steps[step].desc}</Text>
      </Animated.View>

      <View style={styles.dots}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.skip} onPress={() => router.replace('/notes')}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/notes')}>
          {/* <LinearGradient colors={Gradients.button as [string, string]} style={styles.button}> */}
          <View style={[styles.button, { backgroundColor: Gradients.button[0] }]}>
            <Text style={styles.buttonText}>Get Started</Text>
          </View>
          {/* </LinearGradient> */}
        </Pressable>
      </View>
      {/* </LinearGradient> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.xl, justifyContent: 'center' },
  content: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  emoji: { fontSize: 72, marginBottom: Spacing.lg },
  title: { ...Typography.display, color: '#fff', textAlign: 'center' },
  desc: { ...Typography.body, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: Spacing.md },
  dots: { flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center', marginBottom: Spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { width: 24, backgroundColor: '#fff' },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: Spacing.xl },
  skip: { padding: Spacing.md },
  skipText: { ...Typography.body, color: 'rgba(255,255,255,0.7)' },
  button: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.full },
  buttonText: { ...Typography.label, color: '#fff' },
});