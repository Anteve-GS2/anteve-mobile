import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { Button } from './Button';
import { Mini } from './illustrations/Mini';

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.wrap}>
      <Mini nome="erro" />
      <Text style={styles.title}>Não deu para carregar</Text>
      <Text style={styles.msg}>{message}</Text>
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