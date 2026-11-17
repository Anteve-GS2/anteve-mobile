import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  label: string;
  active?: boolean;
  dot?: string;
  onPress?: () => void;
}

export function Chip({ label, active, dot, onPress }: Props) {
  const { colors: themeColors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      hitSlop={4}
      style={[
        styles.chip,
        { backgroundColor: themeColors.white, borderColor: themeColors.line },
        active && { backgroundColor: themeColors.tealDark, borderColor: themeColors.tealDark },
      ]}
    >
      {!!dot && <View style={[styles.dot, { backgroundColor: dot }]} />}
      <Text style={[styles.text, { color: themeColors.ink }, active && { color: themeColors.white }]}>{label}</Text>
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
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: colors.white },
  text: { fontSize: 13, fontWeight: '600', color: colors.ink },
});