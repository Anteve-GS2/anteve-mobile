import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RISK } from '@/constants/risk';
import { EstadoRisco } from '@/types/mapa';

export function Badge({ estado }: { estado: EstadoRisco }) {
  const r = RISK[estado];
  return (
    <View style={[styles.badge, { backgroundColor: r.color }]}>
      <Text style={[styles.text, { color: r.text }]}>{r.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '700' },
});