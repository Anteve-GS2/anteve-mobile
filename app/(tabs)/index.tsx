import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { DemoBanner } from '@/components/DemoBanner';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loader } from '@/components/Loader';
import { RiskMap } from '@/components/RiskMap';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TimeControl } from '@/components/TimeControl';
import { ATRASO_PADRAO_HORAS } from '@/constants/logistica';
import { ESTADOS, RISK } from '@/constants/risk';
import { colors } from '@/constants/theme';
import { useAsync } from '@/hooks/useAsync';
import { getMapa } from '@/services/mapa';
import { EstadoRisco } from '@/types/mapa';
import { aplicarLogistica, calcularBarcos, textoFolga } from '@/utils/logistica';
import { projetar } from '@/utils/projecao';
import { formatarDias } from '@/utils/risk';

const MAX_DIAS = 30;
const PASSO = 0.25;

export default function Mapa() {
  const router = useRouter();
  const { data, loading, error, reload } = useAsync(getMapa);
  const [filtro, setFiltro] = useState<EstadoRisco | null>(null);
  const [selId, setSelId] = useState<number | null>(null);
  const [t, setT] = useState(0); // tempo em dias (fracionado)
  const [playing, setPlaying] = useState(false);
  const [barcosOn, setBarcosOn] = useState(false);
  const [atrasado, setAtrasado] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setT((v) => {
        if (v >= MAX_DIAS) {
          setPlaying(false);
          return v;
        }
        return Math.min(MAX_DIAS, v + PASSO);
      });
    }, 200);
    return () => clearInterval(timer);
  }, [playing]);

  function alternarPlay() {
    if (!playing && t >= MAX_DIAS) setT(0);
    setPlaying(!playing);
  }

  const atraso = barcosOn && atrasado ? ATRASO_PADRAO_HORAS : 0;
  const barcosTodos = useMemo(() => calcularBarcos(data ?? []), [data]);

  const items = useMemo(() => {
    let lista = projetar(data ?? [], Math.floor(t));
    if (barcosOn) lista = aplicarLogistica(lista, barcosTodos, atraso);
    return lista.filter((c) => !filtro || c.estado === filtro);
  }, [data, t, barcosOn, barcosTodos, atraso, filtro]);

  const ids = useMemo(() => new Set(items.map((c) => c.id)), [items]);
  const barcosVisiveis = useMemo(
    () => (barcosOn ? barcosTodos.filter((b) => ids.has(b.id)) : []),
    [barcosOn, barcosTodos, ids]
  );

  const selected = items.find((c) => c.id === selId) ?? null;
  const barcoSel = barcosOn ? barcosTodos.find((b) => b.id === selId) : undefined;
  const dia = Math.floor(t);

  return (
    <View style={styles.flex}>
      <ScreenHeader cena="mapa" compacto title="Mapa de risco" right={<Chip label="Atualizar" onPress={reload} />} />
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
          <RiskMap
            items={items}
            selectedId={selId}
            onSelect={setSelId}
            barcos={barcosVisiveis}
            tempoDias={t}
            atrasoHoras={atraso}
          />
        )}
      </View>

      <View style={styles.panel}>
        <DemoBanner />
        {data && (
          <View style={styles.row}>
            <Chip label="🚤 Barcos" active={barcosOn} onPress={() => setBarcosOn(!barcosOn)} />
            {barcosOn && (
              <Chip label={`E se atrasar ${ATRASO_PADRAO_HORAS} h?`} active={atrasado} onPress={() => setAtrasado(!atrasado)} />
            )}
          </View>
        )}
        {barcosOn && (
          <Text style={styles.nota}>
            Barcos: rota em linha reta a 15 km/h do polo, valores ilustrativos. Comunidade sem folga fica vermelha.
          </Text>
        )}
        {data && <TimeControl dia={t} max={MAX_DIAS} playing={playing} onChange={setT} onTogglePlay={alternarPlay} />}
        {selected && (
          <Card>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <Text style={styles.name}>{selected.nome}</Text>
              <Badge estado={selected.estado} />
            </View>
            <Text style={styles.sub}>
              {dia === 0 ? 'Isolamento em' : `Em ${dia} dias, faltam`} {formatarDias(selected.diasPrevistos)}
            </Text>
            {barcoSel && (
              <Text style={styles.sub}>
                Barco: {((barcoSel.etaHoras + atraso) / 24).toFixed(1)} dias de viagem · {textoFolga(barcoSel, atraso)}
              </Text>
            )}
            <Button title="Ver detalhes" onPress={() => router.push(`/comunidade/${selected.id}`)} />
          </Card>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  legend: { flexGrow: 0 },
  legendRow: { paddingHorizontal: 20, paddingBottom: 10, gap: 8 },
  panel: { padding: 12, gap: 8, backgroundColor: colors.bg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 18, fontWeight: '800', color: colors.ink, flexShrink: 1 },
  sub: { fontSize: 14, color: colors.muted },
  nota: { fontSize: 11, color: colors.muted },
});