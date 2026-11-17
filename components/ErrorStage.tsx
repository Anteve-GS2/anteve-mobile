import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Button } from './Button';
import { Mini } from './illustrations/Mini';

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { colors: themeColors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Mini nome="erro" />
      <Text style={[styles.title, { color: themeColors.ink }]}>Não deu para carregar</Text>
      <Text style={[styles.msg, { color: themeColors.muted }]}>{message}</Text>
      <View style={{ width: 220, marginTop: 8 }}>
        <Button title="Tentar de novo" onPress={onRetry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 6 },
  title: { fontSize: 18, fontWeight: '800', color: colors.ink },
  msg: { fontSize: 14, color: colors.muted, textAlign: 'center' },
});