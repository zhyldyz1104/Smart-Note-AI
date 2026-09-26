import { useCallback, useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs
} from 'firebase/firestore';

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

export function useNotes(userId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    const notesRef = collection(db, "users", userId, "notes");
    const snapshot = await getDocs(notesRef);

    const list: Note[] = snapshot.docs.map(doc => {
      const data = doc.data() as any;
      const now = new Date().toISOString();

      return {
        id: doc.id,
        title: data.title || "",
        category: data.category || "general",
        content: data.content || "",
        preview: data.preview || "",
        date: data.date || now,
        createdAt: data.createdAt || now,
        updatedAt: data.updatedAt || now,
        starred: data.starred ?? false,
        trashed: data.trashed ?? false,
      };
    });

    setNotes(list);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // CREATE NOTE → Firebase
  const createNote = useCallback(
    async (data: Partial<Note>) => {
      if (!userId) return;

      const now = new Date().toISOString();

      const notesRef = collection(db, "users", userId, "notes");
      const docRef = await addDoc(notesRef, {
        title: data.title || "",
        category: data.category || "general",
        content: data.content || "",
        preview: data.preview || "",
        date: now,
        createdAt: now,
        updatedAt: now,
        starred: false,
        trashed: false,
      });

      await refresh();

      return {
        id: docRef.id,   // ⭐ FIXED — ALWAYS VALID
        title: data.title || "",
        category: data.category || "general",
        content: data.content || "",
        preview: data.preview || "",
        date: now,
        createdAt: now,
        updatedAt: now,
        starred: false,
        trashed: false,
      };
    },
    [userId, refresh]
  );



  // UPDATE NOTE → Firebase
  const updateNote = useCallback(
    async (id: string, data: Partial<Note>) => {
      if (!userId) return;

      const noteRef = doc(db, "users", userId, "notes", id);
      await updateDoc(noteRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      await refresh();
    },
    [userId, refresh]
  );

  // DELETE NOTE → Firebase
  const removeNote = useCallback(
    async (id: string) => {
      if (!userId) return;

      const noteRef = doc(db, "users", userId, "notes", id);
      await deleteDoc(noteRef);

      await refresh();
    },
    [userId, refresh]
  );

  // TOGGLE STAR → Firebase
  const toggleStar = useCallback(
    async (id: string) => {
      if (!userId) return;

      const noteRef = doc(db, "users", userId, "notes", id);
      const note = notes.find(n => n.id === id);
      if (!note) return;

      await updateDoc(noteRef, { starred: !note.starred });
      await refresh();
    },
    [userId, notes, refresh]
  );

  // MOVE TO TRASH → Firebase
  const trash = useCallback(
    async (id: string) => {
      if (!userId) return;

      const noteRef = doc(db, "users", userId, "notes", id);
      await updateDoc(noteRef, { trashed: true });
      await refresh();
    },
    [userId, refresh]
  );
  const stats = {
    total: notes.length,
    starred: notes.filter(n => n.starred && !n.trashed).length,
    trashed: notes.filter(n => n.trashed).length,
  };

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
  };
}
