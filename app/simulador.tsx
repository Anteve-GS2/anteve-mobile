import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Stepper } from '@/components/Stepper';
import { FAIXAS } from '@/constants/simulacao';
import { colors } from '@/constants/theme';
import { useAsync } from '@/hooks/useAsync';
import { useRole } from '@/hooks/useRole';
import { getMapa } from '@/services/mapa';
import { simular } from '@/services/simulacoes';
import { SimulacaoResultado } from '@/types/simulacao';
import { errorMessage } from '@/utils/errors';
import { formatarDias } from '@/utils/risk';

const TERMOS: { k: 'N' | 'T' | 'R' | 'V'; nome: string }[] = [
  { k: 'N', nome: 'Nível' },
  { k: 'T', nome: 'Tendência' },
  { k: 'R', nome: 'Relatos' },
  { k: 'V', nome: 'Vulnerabilidade' },
];

export default function Simulador() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { isGestor } = useRole();
  const { data: comunidades } = useAsync(getMapa);
  const [comId, setComId] = useState<number | null>(id ? Number(id) : null);
  const [queda, setQueda] = useState(FAIXAS.queda.padrao);
  const [chuva, setChuva] = useState(FAIXAS.chuva.padrao);
  const [atraso, setAtraso] = useState(FAIXAS.atraso.padrao);
  const [rota, setRota] = useState(false);
  const [res, setRes] = useState<SimulacaoResultado | null>(null);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState('');

  if (!isGestor) {
    return (
      <View style={styles.flex}>
        <ScreenHeader cena="simulador" title="Simulador" onBack={() => router.back()} />
        <EmptyState title="Acesso restrito" hint="Só o perfil Gestor usa o simulador de cenários." />
      </View>
    );
  }

  async function handleSimular() {
    if (comId === null) {
      setErro('Escolha uma comunidade.');
      return;
    }
    setErro('');
    setBusy(true);
    try {
      setRes(
        await simular({
          comunidadeId: comId,
          variacaoNivelCmDia: queda,
          chuvaMm3Dias: chuva,
          rotaInterrompida: rota,
          atrasoHoras: atraso,
        })
      );
    } catch (e) {
      setErro(errorMessage(e, 'Não foi possível simular. Revise os valores.'));
    } finally {
      setBusy(false);
    }
  }

  function limpar() {
    setQueda(FAIXAS.queda.padrao);
    setChuva(FAIXAS.chuva.padrao);
    setAtraso(FAIXAS.atraso.padrao);
    setRota(false);
    setRes(null);
    setErro('');
  }

  const piorou = res ? res.simulado.indice > res.atual.indice : false;

  return (
    <View style={styles.flex}>
      <ScreenHeader cena="simulador" title="Simulador de cenários" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Comunidade</Text>
        <View style={styles.chips}>
          {(comunidades ?? []).map((c) => (
            <Chip key={c.id} label={c.nome} active={comId === c.id} onPress={() => setComId(c.id)} />
          ))}
        </View>

        <Card style={styles.gap}>
          <Stepper label="E se o rio baixar mais por dia?" value={queda} unit={FAIXAS.queda.unidade} min={FAIXAS.queda.min} max={FAIXAS.queda.max} step={FAIXAS.queda.step} onChange={setQueda} />
          <Stepper label="E se a chuva prevista mudar?" value={chuva} unit={FAIXAS.chuva.unidade} min={FAIXAS.chuva.min} max={FAIXAS.chuva.max} step={FAIXAS.chuva.step} onChange={setChuva} />
          <Stepper label="E se o abastecimento atrasar?" value={atraso} unit={FAIXAS.atraso.unidade} min={FAIXAS.atraso.min} max={FAIXAS.atraso.max} step={FAIXAS.atraso.step} onChange={setAtraso} />
          <View style={styles.switchRow}>
            <Text style={styles.text}>E se a rota de navegação for interrompida?</Text>
            <Switch value={rota} onValueChange={setRota} accessibilityLabel="Rota interrompida" />
          </View>
        </Card>

        {!!erro && <Text style={styles.erro} accessibilityLiveRegion="polite">{erro}</Text>}
        <Button title="Simular" onPress={handleSimular} loading={busy} />
        <Button title="Limpar" variant="secondary" onPress={limpar} />

        {res && (
          <>
            <View style={styles.row}>
              <Card style={{ flex: 1 }}>
                <Text style={styles.label}>Atual</Text>
                <Badge estado={res.atual.estado} />
                <Text style={styles.big}>{formatarDias(res.atual.diasPrevistos)}</Text>
                <Text style={styles.label}>índice {res.atual.indice.toFixed(2)}</Text>
              </Card>
              <Card style={[{ flex: 1 }, piorou && { borderColor: colors.danger }]}>
                <Text style={styles.label}>Simulado</Text>
                <Badge estado={res.simulado.estado} />
                <Text style={styles.big}>{formatarDias(res.simulado.diasPrevistos)}</Text>
                <Text style={styles.label}>índice {res.simulado.indice.toFixed(2)}</Text>
              </Card>
            </View>
            <Card>
              <Text style={styles.label}>Contribuição de cada termo (atual → simulado)</Text>
              {TERMOS.map((t) => (
                <Text key={t.k} style={styles.text}>
                  {t.k} · {t.nome}: {res.atual.contribuicoes[t.k].toFixed(2)} → {res.simulado.contribuicoes[t.k].toFixed(2)}
                </Text>
              ))}
            </Card>
            <Card style={{ backgroundColor: '#FFF4D6' }}>
              <Text style={styles.text}>Cenário hipotético: não altera os dados reais. A decisão final é do gestor.</Text>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 10, paddingBottom: 32 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gap: { gap: 16 },
  row: { flexDirection: 'row', gap: 10 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { fontSize: 12, color: colors.muted },
  text: { fontSize: 14, color: colors.ink, flexShrink: 1 },
  big: { fontSize: 20, fontWeight: '800', color: colors.ink },
  erro: { color: colors.danger, fontSize: 14 },
});