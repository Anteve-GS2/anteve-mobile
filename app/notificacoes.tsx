import React, { useCallback } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';
import { listarNotificacoes, marcarNotificacaoLida, marcarTodasNotificacoesLidas } from '@/storage/notificacoes';
import { Notificacao } from '@/types/notificacao';
import { useTheme } from '@/context/ThemeContext';

function dataRelativa(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function Notificacoes() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const [items, setItems] = React.useState<Notificacao[]>([]);
  const [loading, setLoading] = React.useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listarNotificacoes());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void carregar(); }, [carregar]));

  async function ler(item: Notificacao) {
    if (!item.lida) {
      await marcarNotificacaoLida(item.id);
      await carregar();
    }
  }

  async function lerTodas() {
    await marcarTodasNotificacoesLidas();
    await carregar();
  }

  return (
    <View style={[styles.flex, { backgroundColor: themeColors.bg }]}>
      <ScreenHeader cena="sobre" title="Notificações" onBack={() => router.back()} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} />}
        ListHeaderComponent={items.some((item) => !item.lida) ? <Button title="Marcar todas como lidas" variant="secondary" onPress={lerTodas} /> : undefined}
        ListEmptyComponent={<EmptyState title="Nenhuma notificação" hint="Novos avisos aparecerão aqui." />}
        renderItem={({ item }) => (
          <Pressable accessibilityRole="button" accessibilityState={{ selected: item.lida }} onPress={() => void ler(item)}>
            <Card style={[styles.item, !item.lida && { borderColor: themeColors.teal, borderWidth: 1.5 }]}>
              <View style={styles.row}>
                <Text style={[styles.title, { color: themeColors.ink }]}>{item.titulo}</Text>
                {!item.lida && <View style={[styles.dot, { backgroundColor: themeColors.teal }]} />}
              </View>
              <Text style={[styles.message, { color: themeColors.muted }]}>{item.mensagem}</Text>
              <Text style={[styles.date, { color: themeColors.field }]}>{dataRelativa(item.criadaEm)}</Text>
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, gap: 10 },
  item: { gap: 6 },
  unread: { borderColor: colors.teal, borderWidth: 1.5 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { color: colors.ink, fontSize: 16, fontWeight: '800', flex: 1 },
  message: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  date: { color: colors.field, fontSize: 11 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.teal },
});
