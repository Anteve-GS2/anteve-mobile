import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '@/constants/theme';

export function Skeleton({ width = '100%', height = 16, style }: { width?: ViewStyle['width']; height?: number; style?: ViewStyle }) {
  return <View style={[styles.base, { width, height }, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.line,
    borderRadius: radius / 2,
  },
});
