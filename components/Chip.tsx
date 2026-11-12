import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

interface Props {
  label: string;
  active?: boolean;
  dot?: string;
  onPress?: () => void;
}

export function Chip({ label, active, dot, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      hitSlop={4}
      style={[styles.chip, active && styles.on]}
    >
      {!!dot && <View style={[styles.dot, { backgroundColor: dot }]} />}
      <Text style={[styles.text, active && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 99,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  on: { backgroundColor: colors.tealDark, borderColor: colors.tealDark },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: colors.white },
  text: { fontSize: 13, fontWeight: '600', color: colors.ink },
});