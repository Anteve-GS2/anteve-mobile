import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        style={[
          styles.input,
          rest.multiline && { height: undefined, minHeight: 96, paddingTop: 12, textAlignVertical: 'top' as const },
          !!error && { borderColor: colors.danger },
        ]}
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 12, color: colors.muted },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.field,
    borderRadius: radius,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.white,
  },
  error: { fontSize: 12, color: colors.danger },
});