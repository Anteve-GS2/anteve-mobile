import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, shadow } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export function Card({ style, ...rest }: ViewProps) {
  const { colors: themeColors } = useTheme();
  return <View style={[styles.card, { backgroundColor: themeColors.white, borderColor: themeColors.line }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 14,
    gap: 4,
    ...shadow,
  },
});