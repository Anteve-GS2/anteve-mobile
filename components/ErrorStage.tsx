import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { Button } from './Button';

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Não deu para carregar</Text>
      <Text style={styles.msg}>{message}</Text>
      <View style={{ width: 200 }}>
        <Button title="Tentar de novo" onPress={onRetry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
  msg: { fontSize: 14, color: colors.muted, textAlign: 'center' },
});