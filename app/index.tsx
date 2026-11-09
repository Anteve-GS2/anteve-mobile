import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { colors, space } from '@/constants/theme';

// Tela provisória: será substituída pelo mapa de risco (tela 3).
export default function Home() {
  const { user, signOut } = useAuth();
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Olá, {user?.nome}</Text>
      <Text style={styles.sub}>Perfil: {user?.papel}</Text>
      <Text style={styles.sub}>Aqui entra o mapa de risco.</Text>
      <Button title="Sair" variant="secondary" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: space.lg, gap: space.md, backgroundColor: colors.bg },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 14, color: colors.muted },
});