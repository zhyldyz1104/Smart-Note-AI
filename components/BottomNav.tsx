import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import { Colors, Gradients } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius, Layout } from '../constants/spacing';

interface NavItem {
  key: string;
  label: string;
  icon: string;
  href: '/notes' | '/ai-tools' | '/settings';
}

const ITEMS: NavItem[] = [
  { key: 'notes', label: 'Notes', icon: '📝', href: '/notes' },
  { key: 'ai-tools', label: 'AI Tools', icon: '🤖', href: '/ai-tools' },
  { key: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={Gradients.card as [string, string]} style={styles.container}>
        {ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Pressable
              key={item.key}
              style={styles.item}
              onPress={() => router.push(item.href)}
            >
              {active ? (
                <LinearGradient colors={Gradients.button as [string, string]} style={styles.activeIcon}>
                  <Text style={styles.iconText}>{item.icon}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.iconWrap}>
                  <Text style={styles.iconText}>{item.icon}</Text>
                </View>
              )}
              <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: 'row',
    height: Layout.bottomNavHeight,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  activeIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  labelActive: {
    color: Colors.text,
    fontFamily: 'Inter-Medium',
  },
});