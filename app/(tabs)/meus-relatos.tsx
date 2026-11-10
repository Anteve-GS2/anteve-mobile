import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/Input';
import { Loader } from '@/components/Loader';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';
import { useAsync } from '@/hooks/useAsync';
import { atualizarRelato, enviarFila, excluirRelato, listarMeusRelatos } from '@/services/relatos';
import { lerFila } from '@/storage/filaRelatos';
import { RelatoFila } from '@/types/relato';
import { confirmar } from '@/utils/confirm';
import { errorMessage } from '@/utils/errors';

function formatarData(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function MeusRelatos() {
  const router = useRouter();
  const { data, loading, error, reload } = useAsync(listarMeusRelatos);
  const [fila, setFila] = useState<RelatoFila[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTexto, setEditTexto] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState('');

  const carregarFila = useCallback(async () => setFila(await lerFila()), []);

  useFocusEffect(
    useCallback(() => {
      carregarFila();
      reload();
    }, [carregarFila, reload])
  );

  async function enviarAgora() {
    const n = await enviarFila();
    await carregarFila();
    if (n > 0) reload();
    setMsg(n > 0 ? `${n} relato(s) enviado(s).` : 'Ainda sem conexão. Tentaremos de novo.');
  }

  async function salvarEdicao() {
    if (editId === null) return;
    setSalvando(true);
    try {
      await atualizarRelato(editId, editTexto.trim());
      setEditId(null);
      reload();
    } catch (e) {
      setMsg(errorMessage(e, 'Não foi possível salvar.'));
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: number) {
    if (!(await confirmar('Excluir relato?', 'Essa ação não pode ser desfeita.'))) return;
    try {
      await excluirRelato(id);
      reload();
    } catch (e) {
      setMsg(errorMessage(e, 'Não foi possível excluir.'));
    }
  }

  const header = (
    <View style={{ gap: 10 }}>
      {!!msg && <Text style={styles.msg} accessibilityLiveRegion="polite">{msg}</Text>}
      {fila.length > 0 && (
        <Card>
          <Text style={styles.nome}>Na fila ({fila.length})</Text>
          {fila.map((f) => (
            <Text key={f.localId} style={styles.sub}>
              {f.comunidadeNome ?? 'Relato'} · {formatarData(f.criadoEm)} · aguardando sinal
            </Text>
          ))}
          <Button title="Enviar agora" variant="secondary" onPress={enviarAgora} />
        </Card>
      )}
    </View>
  );

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Meus relatos" right={<Chip label="＋ Novo" onPress={() => router.navigate('/relatar')} />} />
      {loading && !data ? (
        <Loader />
      ) : error && !data ? (
        <View style={styles.errorState}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Tentar novamente" onPress={reload} />
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(r) => String(r.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
          ListHeaderComponent={header}
          ListEmptyComponent={<EmptyState title="Nenhum relato ainda" hint="Toque em “Novo” para gravar o primeiro." />}
          renderItem={({ item: r }) => (
            <Card>
              <View style={styles.row}>
                <Text style={styles.nome}>{r.comunidadeNome ?? 'Relato'}</Text>
                <Text style={styles.sub}>{formatarData(r.data)}</Text>
              </View>
              {editId === r.id ? (
                <>
                  <Input label="Texto do relato" value={editTexto} onChangeText={setEditTexto} multiline autoCapitalize="sentences" />
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}><Button title="Salvar" onPress={salvarEdicao} loading={salvando} /></View>
                    <View style={{ flex: 1 }}><Button title="Cancelar" variant="secondary" onPress={() => setEditId(null)} /></View>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.texto}>{r.texto ? `"${r.texto}"` : '(áudio sem transcrição)'}</Text>
                  {!!r.indicador && <Chip label={`Indicador: ${r.indicador}`} />}
                  <View style={styles.row}>
                    <Chip label="Editar" onPress={() => { setEditId(r.id); setEditTexto(r.texto ?? ''); }} />
                    <Chip label="Excluir" onPress={() => excluir(r.id)} />
                  </View>
                </>
              )}
            </Card>
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
  nome: { fontSize: 16, fontWeight: '700', color: colors.ink },
  sub: { fontSize: 12, color: colors.muted },
  texto: { fontSize: 14, color: colors.ink, marginVertical: 4 },
  msg: { fontSize: 14, color: colors.ink, backgroundColor: '#FFF4D6', padding: 10, borderRadius: 8 },
  errorState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, gap: 12 },
  errorText: { fontSize: 14, color: colors.ink, textAlign: 'center' },
});