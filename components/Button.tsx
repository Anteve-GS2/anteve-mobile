import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, loading, disabled, variant = 'primary' }: Props) {
  const secondary = variant === 'secondary';
  const off = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      onPress={onPress}
      disabled={off}
      style={[styles.base, secondary ? styles.secondary : styles.primary, off && styles.off]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? colors.ink : colors.white} />
      ) : (
        <Text style={[styles.text, secondary && { color: colors.ink }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 48, borderRadius: radius, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.teal },
  secondary: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.field },
  off: { opacity: 0.6 },
  text: { color: colors.white, fontSize: 16, fontWeight: '700' },
});