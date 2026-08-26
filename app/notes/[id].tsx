import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
// import  LinearGradient  from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AIButtons } from '../../components/AIButtons';
import { getNotes, type Note } from '../../lib/storage/notes';
import { getCategoryById } from '../../lib/storage/categories';
import { useAI } from '../../hooks/useAI';
import type { Flashcard, QuizQuestion } from '../../lib/ai/chatgpt';
import { Colors, Gradients } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius, Layout } from '../../constants/spacing';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | Flashcard[] | QuizQuestion[] | null>(null);
  const [resultType, setResultType] = useState<'summary' | 'improve' | 'flashcards' | 'quiz' | null>(null);
  const ai = useAI();

  useEffect(() => {
    (async () => {
      const notes = await getNotes();
      const found = notes.find((n) => n.id === id) ?? null;
      setNote(found);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary[400]} />
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Note not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const category = getCategoryById(note.category);
  const words = note.content.trim() ? note.content.trim().split(/\s+/).length : 0;
  const chars = note.content.length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const handleSummarize = async () => {
    const r = await ai.summarize(note.content);
    if (r) { setResult(r); setResultType('summary'); }
  };
  const handleImprove = async () => {
    const r = await ai.improve(note.content);
    if (r) { setResult(r); setResultType('improve'); }
  };
  const handleFlashcards = async () => {
    const r = await ai.flashcards(note.content);
    if (r) { setResult(r); setResultType('flashcards'); }
  };
  const handleQuiz = async () => {
    const r = await ai.quiz(note.content);
    if (r) { setResult(r); setResultType('quiz'); }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: Layout.bottomNavHeight + Spacing.xl }} showsVerticalScrollIndicator={false}>
        {/* <LinearGradient colors={Gradients.hero as [string, string, string]} style={styles.header}> */}
        <View style={[styles.header, { backgroundColor: Gradients.hero[0] }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backBtn}>← Back</Text>
          </Pressable>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{category?.icon} {category?.name ?? note.category}</Text>
          </View>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.date}>{new Date(note.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
        </View>
        {/* </LinearGradient> */}

        <View style={styles.body}>
          <Text style={styles.content}>{note.content}</Text>

          <View style={styles.statsRow}>
            <Stat label="Words" value={words} />
            <Stat label="Characters" value={chars} />
            <Stat label="Read" value={`${readTime}m`} />
          </View>

          <Text style={styles.sectionTitle}>AI Actions</Text>
          <AIButtons
            loading={ai.loading}
            onSummarize={handleSummarize}
            onImprove={handleImprove}
            onFlashcards={handleFlashcards}
            onQuiz={handleQuiz}
          />

          {ai.error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {ai.error}</Text>
            </View>
          ) : null}

          {result ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>
                {resultType === 'summary' && 'Summary'}
                {resultType === 'improve' && 'Improved Writing'}
                {resultType === 'flashcards' && 'Flashcards'}
                {resultType === 'quiz' && 'Quiz'}
              </Text>
              {resultType === 'summary' || resultType === 'improve' ? (
                <Text style={styles.resultText}>{result as string}</Text>
              ) : null}
              {resultType === 'flashcards' ? (
                (result as Flashcard[]).map((c, i) => (
                  <View key={c.id} style={styles.cardItem}>
                    <Text style={styles.cardQ}>Q{i + 1}. {c.front}</Text>
                    <Text style={styles.cardA}>A: {c.back}</Text>
                  </View>
                ))
              ) : null}
              {resultType === 'quiz' ? (
                (result as QuizQuestion[]).map((q, i) => (
                  <View key={q.id} style={styles.cardItem}>
                    <Text style={styles.cardQ}>{i + 1}. {q.question}</Text>
                    {q.options.map((opt, oi) => (
                      <Text key={oi} style={[styles.quizOpt, oi === q.correctIndex && styles.quizCorrect]}>
                        {String.fromCharCode(65 + oi)}. {opt}{oi === q.correctIndex ? ' ✓' : ''}
                      </Text>
                    ))}
                    <Text style={styles.quizExp}>{q.explanation}</Text>
                  </View>
                ))
              ) : null}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  empty: { ...Typography.h3, color: Colors.text, marginBottom: Spacing.md },
  back: { ...Typography.label, color: Colors.primary[400] },
  header: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  backBtn: { ...Typography.label, color: 'rgba(255,255,255,0.9)', marginBottom: Spacing.md },
  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  headerBadgeText: { ...Typography.caption, color: '#fff', fontFamily: 'Inter-Medium' },
  title: { ...Typography.h1, color: '#fff' },
  date: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginTop: Spacing.xs },
  body: { padding: Spacing.lg },
  content: { ...Typography.body, color: Colors.text, marginBottom: Spacing.lg },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  stat: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: { ...Typography.h3, color: Colors.primary[400] },
  statLabel: { ...Typography.caption, color: Colors.textMuted, marginTop: Spacing.xs },
  sectionTitle: { ...Typography.h3, color: Colors.text, marginBottom: Spacing.md },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  errorText: { ...Typography.bodySmall, color: Colors.danger },
  resultBox: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultTitle: { ...Typography.h3, color: Colors.primary[400], marginBottom: Spacing.md },
  resultText: { ...Typography.body, color: Colors.text },
  cardItem: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardQ: { ...Typography.bodySmall, color: Colors.text, fontFamily: 'Inter-Medium', marginBottom: Spacing.xs },
  cardA: { ...Typography.bodySmall, color: Colors.textMuted },
  quizOpt: { ...Typography.bodySmall, color: Colors.textMuted, marginLeft: Spacing.sm, marginVertical: 2 },
  quizCorrect: { color: Colors.success, fontFamily: 'Inter-Medium' },
  quizExp: { ...Typography.caption, color: Colors.textMuted, marginTop: Spacing.xs, fontStyle: 'italic' },
});