import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/Input';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';
import { useRole } from '@/hooks/useRole';
import { atualizarComunidade, criarComunidade } from '@/services/comunidades';
import { errorMessage } from '@/utils/errors';

const num = (s: string) => Number(s.replace(',', '.').trim());

export default function ComunidadeForm() {
  const router = useRouter();
  const { isGestor } = useRole();
  const p = useLocalSearchParams<{ id?: string; nome?: string; latitude?: string; longitude?: string }>();
  const editando = !!p.id;
  const [nome, setNome] = useState(p.nome ?? '');
  const [lat, setLat] = useState(p.latitude ?? '');
  const [lng, setLng] = useState(p.longitude ?? '');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroApi, setErroApi] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isGestor) {
    return (
      <View style={styles.flex}>
        <ScreenHeader title="Comunidade" onBack={() => router.back()} />
        <EmptyState title="Acesso restrito" />
      </View>
    );
  }

  async function salvar() {
    const e: Record<string, string> = {};
    const la = num(lat);
    const lo = num(lng);
    if (nome.trim().length < 2) e.nome = 'Informe o nome da comunidade.';
    if (lat.trim() === '' || isNaN(la) || la < -90 || la > 90) e.lat = 'Latitude entre -90 e 90.';
    if (lng.trim() === '' || isNaN(lo) || lo < -180 || lo > 180) e.lng = 'Longitude entre -180 e 180.';
    setErros(e);
    if (Object.keys(e).length > 0) return;

    setBusy(true);
    setErroApi('');
    try {
      const payload = { nome: nome.trim(), latitude: la, longitude: lo };
      if (editando) await atualizarComunidade(Number(p.id), payload);
      else await criarComunidade(payload);
      router.back();
    } catch (err) {
      setErroApi(errorMessage(err, 'Não foi possível salvar.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.flex}>
      <ScreenHeader title={editando ? 'Editar comunidade' : 'Nova comunidade'} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Nome" value={nome} onChangeText={setNome} autoCapitalize="words" error={erros.nome} placeholder="Ex.: Santa Luzia" />
        <Input label="Latitude" value={lat} onChangeText={setLat} error={erros.lat} placeholder="Ex.: -3.35" />
        <Input label="Longitude" value={lng} onChangeText={setLng} error={erros.lng} placeholder="Ex.: -64.71" />
        <Text style={styles.hint}>Use ponto ou vírgula para decimais. Coordenadas em graus.</Text>
        {!!erroApi && <Text style={styles.erro} accessibilityLiveRegion="polite">{erroApi}</Text>}
        <Button title="Salvar" onPress={salvar} loading={busy} />
        <Button title="Cancelar" variant="secondary" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  hint: { fontSize: 12, color: colors.muted },
  erro: { fontSize: 14, color: colors.danger },
});