import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radius } from '@/constants/theme';

export function Card({ style, ...rest }: ViewProps) {
  return <View style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius,
    padding: 12,
    gap: 4,
  },
});