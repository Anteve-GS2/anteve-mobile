import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { DemoBanner } from '@/components/DemoBanner';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import { Papel } from '@/types/auth';

const PAPEL: Record<Papel, string> = {
  MORADOR: 'Morador',
  LIDERANCA: 'Liderança comunitária',
  AGENTE_SAUDE: 'Agente de saúde',
  GESTOR: 'Gestor',
};

export default function Perfil() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isGestor } = useRole();
  return (
    <View style={styles.flex}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={styles.content}>
        <DemoBanner />
        <Card>
          <Text style={styles.nome}>{user?.nome}</Text>
          <Text style={styles.sub}>{user ? PAPEL[user.papel] : ''}</Text>
        </Card>
        {isGestor && <Button title="Gerenciar comunidades" onPress={() => router.push('/comunidade')} />}
        <Button title="Sobre o app" variant="secondary" onPress={() => router.push('/sobre')} />
        <Button title="Sair" variant="secondary" onPress={signOut} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 10 },
  nome: { fontSize: 18, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 14, color: colors.muted },
});