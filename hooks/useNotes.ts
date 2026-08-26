import { useCallback, useEffect, useState } from 'react';
import {
  getNotes,
  saveNote,
  deleteNote,
  toggleFavorite,
  moveToTrash,
  restoreNote,
  getStats,
  type Note,
  type NoteStats,
} from '../lib/storage/notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState<NoteStats>({ total: 0, starred: 0, trashed: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [all, s] = await Promise.all([getNotes(), getStats()]);
    setNotes(all);
    setStats(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createNote = useCallback(
    async (data: Partial<Note>) => {
      const note = await saveNote(data);
      await refresh();
      return note;
    },
    [refresh]
  );

  const updateNote = useCallback(
    async (id: string, data: Partial<Note>) => {
      const note = await saveNote({ id, ...data });
      await refresh();
      return note;
    },
    [refresh]
  );

  const removeNote = useCallback(
    async (id: string) => {
      await deleteNote(id);
      await refresh();
    },
    [refresh]
  );

  const toggleStar = useCallback(
    async (id: string) => {
      await toggleFavorite(id);
      await refresh();
    },
    [refresh]
  );

  const trash = useCallback(
    async (id: string) => {
      await moveToTrash(id);
      await refresh();
    },
    [refresh]
  );

  const restore = useCallback(
    async (id: string) => {
      await restoreNote(id);
      await refresh();
    },
    [refresh]
  );

  return {
    notes,
    stats,
    loading,
    refresh,
    createNote,
    updateNote,
    removeNote,
    toggleStar,
    trash,
    restore,
  };
}