import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { db } from '../../firebase/firebase';
import { collection, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

type Filter = 'all' | 'favorites' | 'trash';
type Note = {
  id: string;
  title: string;
  category: string;
  content: string;
  preview: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  starred: boolean;
  trashed: boolean;
};

export default function NotesHomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;

  const { notes, stats, loading, createNote, toggleStar, trash } = useNotes(userId);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  /////


  // useEffect(() => {
  //   const fetchNotes = async () => {
  //     if (!userId) {
  //       setNotess([]);
  //       return;
  //     }

  //     try {
  //       const notesRef = collection(db, "users", userId, "notes");
  //       const snapshot = await getDocs(notesRef);

  //       const notesArray: Note[] = snapshot.docs.map(doc => {
  //         const data = doc.data() as any;
  //         const now = new Date().toISOString();

  //         return {
  //           id: doc.id,
  //           title: data.title || "",
  //           category: data.category || "general",
  //           content: data.content || "",
  //           preview: data.preview || "",
  //           date: data.date || now,
  //           createdAt: data.createdAt || now,
  //           updatedAt: data.updatedAt || now,
  //           starred: data.starred ?? false,
  //           trashed: data.trashed ?? false,
  //         };
  //       });

  //       setNotess(notesArray);
  //     } catch (error) {
  //       console.error("Error loading notes:", error);
  //       setNotess([]);
  //     }
  //   };

  //   fetchNotes();
  // }, [userId]);


  const filtered = useMemo(() => {
    let list = notes; //Give here note from firebase based on id from params
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
        <Header greeting={greeting} subtitle="Let's organize your thoughts ✨" />

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
                  <Text style={styles.tabTextActive}>{f}</Text>
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
          {
            loading ? (
              <NotesListSkeleton />
            ) : filtered.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyText}>No notes here yet</Text>
              </View>
            ) :
              (
                filtered.map((note, i) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    index={i}
                    onPress={(n) => router.push(`/notes/${n.id}?userId=${userId}`)}
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
          const newNote = await createNote({
            title: data.title,
            category: data.category,
            content: data.content,
            preview: data.content?.slice(0, 120) ?? "",
          });

          setModalVisible(false);

          router.push(`/notes/${newNote?.id}?userId=${userId}`);
          console.log("New note created with ID:", newNote);
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