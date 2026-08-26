import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { Categories } from '../lib/storage/categories';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';

interface NewNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; category: string; content: string }) => Promise<void>;
}

export function NewNoteModal({ visible, onClose, onCreate }: NewNoteModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onCreate({ title, category, content });
      setTitle('');
      setCategory('general');
      setContent('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View entering={SlideInDown.duration(300)} style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.heading}>New Note</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
            {Categories.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setCategory(c.id)}
                style={[styles.chip, category === c.id && { backgroundColor: c.color }]}
              >
                <Text style={[styles.chipText, category === c.id && { color: '#fff' }]}>
                  {c.icon} {c.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Start writing…"
            placeholderTextColor={Colors.textMuted}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleCreate} disabled={saving || !title.trim()}>
              <LinearGradient
                colors={Gradients.button as [string, string]}
                style={[styles.saveBtn, (!title.trim() || saving) && { opacity: 0.5 }]}
              >
                <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save'}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  heading: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.md },
  input: {
    ...Typography.body,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  contentInput: {
    minHeight: 140,
  },
  categories: { flexDirection: 'row', marginBottom: Spacing.md },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceLight,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: { ...Typography.caption, color: Colors.textMuted },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md, marginTop: Spacing.sm },
  cancel: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
  cancelText: { ...Typography.label, color: Colors.textMuted },
  saveBtn: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.full },
  saveText: { ...Typography.label, color: '#fff' },
});