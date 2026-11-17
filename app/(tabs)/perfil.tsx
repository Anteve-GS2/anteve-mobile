import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { DemoBanner } from '@/components/DemoBanner';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import { Papel } from '@/types/auth';
import { listarNotificacoes } from '@/storage/notificacoes';
import { useTheme } from '@/context/ThemeContext';

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
  const { dark, colors, toggleTheme } = useTheme();
  const [naoLidas, setNaoLidas] = useState(0);
  const carregarNaoLidas = useCallback(async () => {
    setNaoLidas((await listarNotificacoes()).filter((item) => !item.lida).length);
  }, []);
  useFocusEffect(useCallback(() => { void carregarNaoLidas(); }, [carregarNaoLidas]));
  return (
    <View style={[styles.flex, { backgroundColor: colors.bg }]}>
      <ScreenHeader cena="perfil" title="Perfil" />
      <ScrollView contentContainerStyle={styles.content}>
        <DemoBanner />
        <Card>
          <Text style={[styles.nome, { color: colors.ink }]}>{user?.nome}</Text>
          <Text style={[styles.sub, { color: colors.muted }]}>{user ? PAPEL[user.papel] : ''}</Text>
        </Card>
        {isGestor && <Button title="Gerenciar comunidades" onPress={() => router.push('/comunidade')} />}
        <Button title={`Notificações${naoLidas ? ` (${naoLidas})` : ''}`} variant="secondary" onPress={() => router.push('/notificacoes' as never)} />
        <Button title={dark ? 'Usar tema claro' : 'Usar tema escuro'} variant="secondary" onPress={toggleTheme} />
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