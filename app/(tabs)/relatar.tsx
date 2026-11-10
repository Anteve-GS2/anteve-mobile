import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Input } from '@/components/Input';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';
import { useAsync } from '@/hooks/useAsync';
import { getMapa } from '@/services/mapa';
import { criarRelato } from '@/services/relatos';
import { enfileirar } from '@/storage/filaRelatos';
import { NovoRelato, Relato } from '@/types/relato';
import { errorMessage } from '@/utils/errors';

const MAX_SEGUNDOS = 60;
const mmss = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export default function Relatar() {
  const { data: comunidades } = useAsync(getMapa);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const rec = useAudioRecorderState(recorder);
  const [uri, setUri] = useState<string | null>(null);
  const player = useAudioPlayer(uri);
  const [comId, setComId] = useState<number | null>(null);
  const [texto, setTexto] = useState('');
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [resultado, setResultado] = useState<Relato | null>(null);

  async function parar() {
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    setUri(recorder.uri);
  }

  useEffect(() => {
    if (!rec.isRecording || rec.durationMillis < MAX_SEGUNDOS * 1000) return;
    const timeout = setTimeout(() => {
      void parar();
    }, 0);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec.isRecording, rec.durationMillis]);

  async function alternarGravacao() {
    setErro('');
    if (rec.isRecording) return parar();
    const perm = await AudioModule.requestRecordingPermissionsAsync();
    if (!perm.granted) {
      setErro('Permita o uso do microfone para gravar o relato.');
      return;
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    setUri(null);
    await recorder.prepareToRecordAsync();
    recorder.record();
  }

  async function ouvir() {
    await player.seekTo(0);
    player.play();
  }

  function limpar() {
    setUri(null);
    setTexto('');
  }

  async function enviar() {
    if (comId === null) return setErro('Escolha a comunidade.');
    if (!uri && !texto.trim()) return setErro('Grave um áudio ou escreva o relato.');
    const novo: NovoRelato = {
      comunidadeId: comId,
      comunidadeNome: comunidades?.find((c) => c.id === comId)?.nome,
      texto: texto.trim() || undefined,
      audioUri: uri ?? undefined,
    };
    setBusy(true);
    setErro('');
    setAviso('');
    setResultado(null);
    try {
      setResultado(await criarRelato(novo));
      limpar();
    } catch (e: any) {
      if (!e?.response) {
        await enfileirar(novo); // sem sinal: guarda e envia quando a rede voltar
        setAviso('Sem sinal: o relato foi guardado e será enviado quando a conexão voltar.');
        limpar();
      } else {
        setErro(errorMessage(e, 'Não foi possível enviar o relato.'));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Gravar relato por voz" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Comunidade</Text>
        <View style={styles.chips}>
          {(comunidades ?? []).map((c) => (
            <Chip key={c.id} label={c.nome} active={comId === c.id} onPress={() => setComId(c.id)} />
          ))}
        </View>

        <Text style={styles.label}>Conte o que você está vendo na natureza ou no rio</Text>
        <View style={styles.center}>
          <Button
            title={rec.isRecording ? '■ Parar' : uri ? '● Gravar de novo' : '● Gravar'}
            variant={rec.isRecording ? 'primary' : 'secondary'}
            onPress={alternarGravacao}
          />
          <Text style={styles.timer} accessibilityLiveRegion="polite">
            {mmss(rec.durationMillis)} / {mmss(MAX_SEGUNDOS * 1000)}
          </Text>
        </View>

        {uri && !rec.isRecording && <Button title="▶ Ouvir antes de enviar" variant="secondary" onPress={ouvir} />}

        <Input
          label="Ou escreva o relato"
          value={texto}
          onChangeText={setTexto}
          multiline
          autoCapitalize="sentences"
          placeholder="Ex.: o igarapé não passa mais barco"
        />

        {!!erro && <Text style={styles.erro} accessibilityLiveRegion="polite">{erro}</Text>}
        {!!aviso && <Text style={styles.aviso} accessibilityLiveRegion="polite">{aviso}</Text>}
        <Button title="Enviar relato" onPress={enviar} loading={busy} disabled={rec.isRecording} />

        {resultado && (
          <Card>
            <Text style={styles.label}>O que a IA entendeu</Text>
            {!!resultado.texto && <Text style={styles.text}>&quot;{resultado.texto}&quot;</Text>}
            <Text style={styles.text}>Indicador: {resultado.indicador ?? 'não identificado'}</Text>
            {!!resultado.antecedencia && <Text style={styles.text}>Antecedência: {resultado.antecedencia}</Text>}
            {!!resultado.confianca && <Text style={styles.text}>Confiança: {resultado.confianca}</Text>}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  center: { gap: 8 },
  timer: { fontSize: 24, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  label: { fontSize: 12, color: colors.muted },
  text: { fontSize: 14, color: colors.ink },
  erro: { color: colors.danger, fontSize: 14 },
  aviso: { color: colors.ink, fontSize: 14, backgroundColor: '#FFF4D6', padding: 10, borderRadius: 8 },
});