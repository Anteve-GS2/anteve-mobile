import React, { useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { ErrorState } from '@/components/ErrorState';
import { LineChart } from '@/components/LineChart';
import { Loader } from '@/components/Loader';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';
import { useAsync } from '@/hooks/useAsync';
import { useRole } from '@/hooks/useRole';
import { getPainel } from '@/services/mapa';
import { EstadoRisco } from '@/types/mapa';
import { montarAviso } from '@/utils/aviso';
import { estadoPorIndice, formatarDias, normalizarEstado } from '@/utils/risk';

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {!!hint && <Text style={styles.label}>{hint}</Text>}
    </Card>
  );
}

export default function Detalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isGestor } = useRole();
  const [falando, setFalando] = useState(false);

  useEffect(() => () => { Speech.stop(); }, []);
  const { data: p, loading, error, reload } = useAsync(() => getPainel(id), [id]);

  if (loading && !p) return <Loader />;
  if (error || !p) return <ErrorState message={error || 'Sem dados.'} onRetry={reload} />;

  const estado: EstadoRisco = normalizarEstado(p.estado, p.indice ?? 0) ?? estadoPorIndice(p.indice ?? 0);
  const niveis = (p.historico ?? []).map((h) => h.nivel);

  function alternarAviso() {
    if (falando) {
      Speech.stop();
      setFalando(false);
      return;
    }
    setFalando(true);
    Speech.speak(montarAviso(p!, estado), {
      language: 'pt-BR',
      onDone: () => setFalando(false),
      onStopped: () => setFalando(false),
      onError: () => setFalando(false),
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={p.nome ?? 'Comunidade'} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Badge estado={estado} />
        <View style={styles.row}>
          <Metric
            label="Nível atual"
            value={p.nivelAtual !== undefined ? `${p.nivelAtual} m` : '—'}
            hint={p.variacaoDiaria !== undefined ? `variação de ${p.variacaoDiaria} cm/dia` : undefined}
          />
          <Metric label="Isolamento em" value={formatarDias(p.diasPrevistos)} />
        </View>
        <View style={styles.row}>
          <Metric label="Vulneráveis" value={String(p.vulneraveis ?? '—')} hint="gestantes, idosos, crianças" />
          <Metric label="Relatos recentes" value={String(p.relatosRecentes?.length ?? 0)} />
        </View>

        <Card>
          <Text style={styles.label}>Histórico de nível</Text>
          <LineChart values={niveis} />
        </Card>

        <Card>
          <Text style={styles.label}>Indicadores naturais</Text>
          {(p.indicadores ?? []).length === 0 && <Text style={styles.text}>Nenhum indicador identificado.</Text>}
          {(p.indicadores ?? []).map((i, k) => (
            <Text key={k} style={styles.text}>
              {i.nome}
              {i.acertos !== undefined && i.tentativas ? ` · acertou ${i.acertos} de ${i.tentativas}` : ''}
            </Text>
          ))}
        </Card>

        <Card>
          <Text style={styles.label}>Relatos recentes</Text>
          {(p.relatosRecentes ?? []).length === 0 && <Text style={styles.text}>Nenhum relato nas últimas 48 h.</Text>}
          {(p.relatosRecentes ?? []).map((r, k) => (
            <Text key={k} style={styles.text}>"{r.texto}"{r.data ? ` · ${r.data}` : ''}</Text>
          ))}
        </Card>

        <Card>
          <Text style={styles.label}>Necessidades de abastecimento</Text>
          <View style={styles.chips}>
            {(p.necessidades ?? []).length === 0 && <Text style={styles.text}>Sem plano gerado.</Text>}
            {(p.necessidades ?? []).map((n) => <Chip key={n} label={n} />)}
          </View>
        </Card>
        <Button
          title={falando ? '■ Parar aviso' : '🔊 Ouvir aviso'}
          variant="secondary"
          onPress={alternarAviso}
        />
        {isGestor && (
          <Button
            title="Simular cenários"
            onPress={() => router.push({ pathname: '/simulador', params: { id: String(id) } })}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 10, paddingBottom: 32 },
  row: { flexDirection: 'row', gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  label: { fontSize: 12, color: colors.muted },
  value: { fontSize: 20, fontWeight: '800', color: colors.ink },
  text: { fontSize: 14, color: colors.ink },
});