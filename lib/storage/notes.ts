import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'smartnoteai:notes';

export interface Note {
  id: string;
  title: string;
  category: string;
  content: string;
  preview: string;
  date: string; // ISO
  starred: boolean;
  trashed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteStats {
  total: number;
  starred: number;
  trashed: number;
}

function makePreview(content: string): string {
  const clean = content.replace(/\s+/g, ' ').trim();
  return clean.length > 120 ? `${clean.slice(0, 120)}…` : clean;
}

export async function getNotes(): Promise<Note[]> {
  const raw = await AsyncStorage.getItem(NOTES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Note[];
  } catch {
    return [];
  }
}

export async function saveNote(note: Partial<Note> & { id?: string }): Promise<Note> {
  const notes = await getNotes();
  const now = new Date().toISOString();

  if (note.id) {
    const idx = notes.findIndex((n) => n.id === note.id);
    if (idx === -1) throw new Error('Note not found');
    const updated: Note = {
      ...notes[idx],
      ...note,
      preview: makePreview(note.content ?? notes[idx].content),
      updatedAt: now,
    } as Note;
    notes[idx] = updated;
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return updated;
  }

  const newNote: Note = {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: note.title ?? 'Untitled',
    category: note.category ?? 'General',
    content: note.content ?? '',
    preview: makePreview(note.content ?? ''),
    date: now,
    starred: false,
    trashed: false,
    createdAt: now,
    updatedAt: now,
  };
  notes.unshift(newNote);
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  return newNote;
}

export async function deleteNote(id: string): Promise<void> {
  const notes = await getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
}

export async function toggleFavorite(id: string): Promise<Note | null> {
  const notes = await getNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  notes[idx].starred = !notes[idx].starred;
  notes[idx].updatedAt = new Date().toISOString();
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  return notes[idx];
}

export async function moveToTrash(id: string): Promise<void> {
  const notes = await getNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return;
  notes[idx].trashed = true;
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export async function restoreNote(id: string): Promise<void> {
  const notes = await getNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return;
  notes[idx].trashed = false;
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export async function getStats(): Promise<NoteStats> {
  const notes = await getNotes();
  return {
    total: notes.filter((n) => !n.trashed).length,
    starred: notes.filter((n) => n.starred && !n.trashed).length,
    trashed: notes.filter((n) => n.trashed).length,
  };
}