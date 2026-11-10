import React, { useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorStage';
import { Loader } from '@/components/Loader';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';
import { useAsync } from '@/hooks/useAsync';
import { getMapa } from '@/services/mapa';
import { calcularBarcos, textoFolga } from '@/utils/logistica';
import { formatarDias } from '@/utils/risk';

export default function Prioridades() {
  const router = useRouter();
  const { data, loading, error, reload } = useAsync(getMapa);

  // Menos dias até o isolamento = mais urgente. Sem previsão vai para o fim.
  const ordenadas = useMemo(
    () => [...(data ?? [])].sort((a, b) => (a.diasPrevistos ?? 9999) - (b.diasPrevistos ?? 9999)),
    [data]
  );

  const barcos = useMemo(() => new Map(calcularBarcos(data ?? []).map((b) => [b.id, b])), [data]);

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Fila de abastecimento" />
      {loading && !data ? (
        <Loader />
      ) : error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <FlatList
          data={ordenadas}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
          ListEmptyComponent={<EmptyState title="Nenhuma comunidade monitorada" />}
          renderItem={({ item, index }) => (
            <Pressable accessibilityRole="button" onPress={() => router.push(`/comunidade/${item.id}`)}>
              <Card>
                <View style={styles.row}>
                  <Text style={styles.name}>{index + 1}. {item.nome}</Text>
                  <Badge estado={item.estado} />
                </View>
                <Text style={styles.sub}>Isolamento em {formatarDias(item.diasPrevistos)}</Text>
                <Text style={styles.sub}>Índice {item.indice.toFixed(2)}</Text>
                {barcos.has(item.id) && <Text style={styles.sub}>{textoFolga(barcos.get(item.id)!, 0)}</Text>}
              </Card>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  name: { fontSize: 16, fontWeight: '700', color: colors.ink, flexShrink: 1 },
  sub: { fontSize: 13, color: colors.muted },
});