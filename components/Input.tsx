import React, { ReactNode, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  right?: ReactNode;
}

export function Input({ label, error, right, onFocus, onBlur, ...rest }: Props) {
  const { colors: themeColors } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: themeColors.muted }]}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor="#7A8C89"
          autoCapitalize="none"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            right != null && styles.inputWithRight,
            rest.multiline && { height: undefined, minHeight: 104, paddingTop: 14, textAlignVertical: 'top' as const },
            { color: themeColors.ink, backgroundColor: themeColors.white, borderColor: themeColors.line },
            focused && { borderColor: themeColors.teal },
            !!error && { borderColor: themeColors.danger },
          ]}
          {...rest}
        />
        {right && <View style={styles.right}>{right}</View>}
      </View>
      {!!error && <Text style={[styles.error, { color: themeColors.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  inputRow: { position: 'relative' },
  label: { fontSize: 12, fontWeight: '600', color: colors.muted },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.white,
  },
  inputWithRight: { paddingRight: 52 },
  right: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' },
  error: { fontSize: 12, color: colors.danger },
});