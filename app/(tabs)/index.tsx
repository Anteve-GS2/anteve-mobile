import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loader } from '@/components/Loader';
import { RiskMap } from '@/components/RiskMap';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ESTADOS, RISK } from '@/constants/risk';
import { colors } from '@/constants/theme';
import { useAsync } from '@/hooks/useAsync';
import { getMapa } from '@/services/mapa';
import { EstadoRisco } from '@/types/mapa';
import { formatarDias } from '@/utils/risk';

export default function Mapa() {
  const router = useRouter();
  const { data, loading, error, reload } = useAsync(getMapa);
  const [filtro, setFiltro] = useState<EstadoRisco | null>(null);
  const [selId, setSelId] = useState<number | null>(null);

  const items = useMemo(
    () => (data ?? []).filter((c) => !filtro || c.estado === filtro),
    [data, filtro]
  );
  const selected = items.find((c) => c.id === selId) ?? null;

  return (
    <View style={styles.flex}>
      <ScreenHeader
        title="Mapa de risco"
        right={
          <Chip label="Atualizar" onPress={reload} />
        }
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.legend} contentContainerStyle={styles.legendRow}>
        {ESTADOS.map((e) => (
          <Chip
            key={e}
            label={RISK[e].label}
            dot={RISK[e].color}
            active={filtro === e}
            onPress={() => setFiltro(filtro === e ? null : e)}
          />
        ))}
      </ScrollView>

      <View style={styles.flex}>
        {loading && !data ? (
          <Loader />
        ) : error && !data ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <EmptyState title="Nenhuma comunidade para mostrar" hint="Remova o filtro ou atualize." />
        ) : (
          <RiskMap items={items} selectedId={selId} onSelect={setSelId} />
        )}
      </View>

      {selected && (
        <Card style={styles.sheet}>
          <Text style={styles.name}>{selected.nome}</Text>
          <Badge estado={selected.estado} />
          <Text style={styles.sub}>Isolamento em {formatarDias(selected.diasPrevistos)}</Text>
          <Button title="Ver detalhes" onPress={() => router.push(`/comunidade/${selected.id}`)} />
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  legend: { flexGrow: 0 },
  legendRow: { paddingHorizontal: 20, paddingBottom: 10, gap: 8 },
  sheet: { position: 'absolute', left: 16, right: 16, bottom: 16, gap: 8 },
  name: { fontSize: 18, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 14, color: colors.muted },
});