import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Header } from '../../components/Header';
import { NoteCard } from '../../components/NoteCard';
import { BottomNav } from '../../components/BottomNav';
import { NotesListSkeleton } from '../../components/Skeleton';
import { NewNoteModal } from '../../components/NewNoteModal';
import { useNotes } from '../../hooks/useNotes';
import { Colors, Gradients } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius, Layout } from '../../constants/spacing';

type Filter = 'all' | 'favorites' | 'trash';

export default function NotesHomeScreen() {
  const router = useRouter();
  const { notes, stats, loading, createNote, toggleStar, trash } = useNotes();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const filtered = useMemo(() => {
    let list = notes;
    if (filter === 'favorites') list = list.filter((n) => n.starred && !n.trashed);
    else if (filter === 'trash') list = list.filter((n) => n.trashed);
    else list = list.filter((n) => !n.trashed);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }
    return list;
  }, [notes, filter, query]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: Layout.bottomNavHeight + Spacing.xxl }} showsVerticalScrollIndicator={false}>
        <Header greeting={greeting} name="Alex Johnson" subtitle="Let's organize your thoughts ✨" />

        <View style={styles.searchWrap}>
          <TextInput
            style={styles.search}
            placeholder="Search notes…"
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.counters}>
          <Counter label="Total" value={stats.total} />
          <Counter label="Starred" value={stats.starred} />
          <Counter label="Trashed" value={stats.trashed} />
        </View>

        <View style={styles.tabs}>
          {(['all', 'favorites', 'trash'] as Filter[]).map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)} style={styles.tabWrap}>
              {filter === f ? (
                <LinearGradient colors={Gradients.button as [string, string]} style={styles.tabActive}>
                {/* <View style={[styles.tabActive, { backgroundColor: Gradients.button[0] }]}> */}
                  <Text style={styles.tabTextActive}>{f}</Text>
                {/* </View> */}
                </LinearGradient>
              ) : (
                <View style={styles.tab}>
                  <Text style={styles.tabText}>{f}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.list}>
          {loading ? (
            <NotesListSkeleton />
          ) : filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No notes here yet</Text>
            </View>
          ) : (
            filtered.map((note, i) => (
              <NoteCard
                key={note.id}
                note={note}
                index={i}
                onPress={(n) => router.push(`/notes/${n.id}`)}
                onStar={(id) => (filter === 'trash' ? trash(id) : toggleStar(id))}
              />
            ))
          )}
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <LinearGradient colors={Gradients.button as [string, string]} style={styles.fabGradient}>
        {/* <View style={[styles.fabGradient, { backgroundColor: Gradients.button[0] }]}> */}
          <Text style={styles.fabText}>+</Text>
        {/* </View> */}
        </LinearGradient> 
      </Pressable>

      <NewNoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={async (data) => {
          const note = await createNote(data);
          setModalVisible(false);
          router.push(`/notes/${note.id}`);
        }}
      />

      <BottomNav />
    </View>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.counter}>
      <Text style={styles.counterValue}>{value}</Text>
      <Text style={styles.counterLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  searchWrap: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  search: {
    ...Typography.body,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  counters: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  counter: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  counterValue: { ...Typography.h3, color: Colors.primary[400] },
  counterLabel: { ...Typography.caption, color: Colors.textMuted, marginTop: Spacing.xs },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  tabWrap: { flex: 1 },
  tab: {
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  tabText: { ...Typography.label, color: Colors.textMuted, textTransform: 'capitalize' },
  tabTextActive: { ...Typography.label, color: '#fff', textTransform: 'capitalize' },
  list: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.sm },
  emptyText: { ...Typography.body, color: Colors.textMuted },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Layout.bottomNavHeight + Spacing.md,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: { fontSize: 28, color: '#fff', marginTop: -2 },
});