import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
// import  {LinearGradient}  from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';
import { ProgressBars } from '../../components/ProgressBars';
import { Categories } from '../../lib/storage/categories';
import { Colors, Gradients } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius, Layout } from '../../constants/spacing';
import { LinearGradient } from 'expo-linear-gradient';

export default function AIToolsScreen() {
  const router = useRouter();

  const progressItems = [
    { label: 'Flashcards', value: 0.72 },
    { label: 'Quizzes', value: 0.58 },
    { label: 'Summaries', value: 0.85 },
  ];
  const { userId } = useLocalSearchParams();
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: Layout.bottomNavHeight + Spacing.xxl }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: Gradients.hero[0] }]}>
          <Text style={styles.eyebrow}>AI TOOLS</Text>
          <Text style={styles.title}>Your study companion</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.row}>
            <ToolBox
              title="Quizzes"
              subtitle="Test your knowledge"
              icon="❓"
              gradient={Gradients.button as [string, string]}
              onPress={() => router.push('/notes')}
            />
            <ToolBox
              title="Flashcards"
              subtitle="Memorize faster"
              icon="🃏"
              gradient={Gradients.accent as [string, string]}
              onPress={() => router.push('/notes')}
            />
          </View>

          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.card}>
            <ProgressBars items={progressItems} />
          </View>
          <Text style={styles.sectionTitle}>Categories</Text>

          {Categories.map((c) => (
            <Pressable key={c.id} style={styles.catRow} onPress={() => router.push({
              pathname: `/category`,
              params: {
                userId,
                category: c.name.toLowerCase()
              }
            })}>
              <View style={[styles.catIcon, { backgroundColor: `${c.color}33` }]}>
                <Text style={styles.catEmoji}>{c.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.catName}>{c.name}</Text>
                <Text style={styles.catCount}>12 notes</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView >
      <BottomNav />
    </View >
  );
}

function ToolBox({ title, subtitle, icon, gradient, onPress }: { title: string; subtitle: string; icon: string; gradient: [string, string]; onPress: () => void }) {
  return (
    <Pressable style={styles.toolBox} onPress={onPress}>
      {/* <LinearGradient colors={gradient} style={styles.toolGradient}> */}
      <View style={[styles.toolGradient, { backgroundColor: gradient[0] }]}>
        <Text style={styles.toolIcon}>{icon}</Text>
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolSubtitle}>{subtitle}</Text>
      </View>
      {/* </LinearGradient> */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  eyebrow: { ...Typography.label, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 },
  title: { ...Typography.h1, color: '#fff', marginTop: Spacing.xs },
  body: { padding: Spacing.lg },
  row: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  toolBox: { flex: 1 },
  toolGradient: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolIcon: { fontSize: 32, marginBottom: Spacing.sm },
  toolTitle: { ...Typography.h3, color: '#fff' },
  toolSubtitle: { ...Typography.caption, color: 'rgba(255,255,255,0.8)' },
  sectionTitle: { ...Typography.h3, color: Colors.text, marginBottom: Spacing.md },
  card: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  catEmoji: { fontSize: 20 },
  catName: { ...Typography.body, color: Colors.text, fontFamily: 'Inter-Medium' },
  catCount: { ...Typography.caption, color: Colors.textMuted },
  chevron: { fontSize: 22, color: Colors.textMuted },
});