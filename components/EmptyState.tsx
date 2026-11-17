import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Mini } from './illustrations/Mini';

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  const { colors: themeColors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Mini nome="vazio" />
      <Text style={[styles.title, { color: themeColors.ink }]}>{title}</Text>
      {!!hint && <Text style={[styles.hint, { color: themeColors.muted }]}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 6 },
  title: { fontSize: 18, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  hint: { fontSize: 14, color: colors.muted, textAlign: 'center' },
});