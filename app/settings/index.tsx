//Reviwed
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomNav } from '../../components/BottomNav';
import { Colors, Gradients } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius, Layout } from '../../constants/spacing';

export default function SettingsScreen() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: Layout.bottomNavHeight + Spacing.xxl }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={Gradients.hero as [string, string, string]} style={styles.header}>
        {/* <View style={[styles.header, { backgroundColor: Gradients.hero[0] }]}> */}
          <Text style={styles.eyebrow}>SETTINGS</Text>
          <Text style={styles.title}>Personalize</Text>
        {/* </View> */}
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AJ</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Alex Johnson</Text>
              <Text style={styles.email}>alex.johnson@example.com</Text>
            </View>
            <Pressable>
              <Text style={styles.edit}>Edit</Text>
            </Pressable>
          </View>

          <Section title="Accessibility">
            <ToggleRow label="High Contrast" value={highContrast} onValueChange={setHighContrast} />
            <ToggleRow label="Large Text" value={largeText} onValueChange={setLargeText} />
          </Section>

          <Section title="Account">
            <LinkRow label="Unlock Pro" icon="👑" tint={Colors.primary[400]} />
            <LinkRow label="Invite Friends" icon="🎁" tint={Colors.pink[500]} />
          </Section>

          <Section title="Preferences">
            <LinkRow label="Language" icon="🌐" value="English" tint={Colors.primary[400]} />
            <ToggleRow label="Notifications" value={notifications} onValueChange={setNotifications} />
          </Section>

          <Section title="Support">
            <LinkRow label="Contact Us" icon="✉️" tint={Colors.pink[500]} />
          </Section>
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function ToggleRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.primary[600] }}
        thumbColor="#fff"
      />
    </View>
  );
}

function LinkRow({ label, icon, value, tint }: { label: string; icon: string; value?: string; tint: string }) {
  return (
    <Pressable style={styles.row}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.rowIcon, { backgroundColor: `${tint}33` }]}>
          <Text style={styles.rowEmoji}>{icon}</Text>
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Text style={styles.chevron}>›</Text>
      </View>
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
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: { ...Typography.h3, color: '#fff' },
  name: { ...Typography.h3, color: Colors.text },
  email: { ...Typography.bodySmall, color: Colors.textMuted },
  edit: { ...Typography.label, color: Colors.primary[400] },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm, marginLeft: Spacing.xs },
  sectionBody: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  rowIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  rowEmoji: { fontSize: 16 },
  rowLabel: { ...Typography.body, color: Colors.text },
  rowValue: { ...Typography.bodySmall, color: Colors.textMuted, marginRight: Spacing.sm },
  chevron: { fontSize: 20, color: Colors.textMuted },
});