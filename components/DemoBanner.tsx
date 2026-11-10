import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export function DemoBanner() {
  const { token } = useAuth();
  if (token !== 'demo') return null;
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Text style={styles.text}>MODO DEMONSTRAÇÃO · dados fictícios, sem conexão com a API</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: '#FFF4D6', borderRadius: 8, padding: 8 },
  text: { fontSize: 12, fontWeight: '700', color: '#14232B', textAlign: 'center' },
});