import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loader } from '@/components/Loader';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';
import { useAsync } from '@/hooks/useAsync';
import { useRole } from '@/hooks/useRole';
import { excluirComunidade, listarComunidadesCrud } from '@/services/comunidades';
import { confirmar } from '@/utils/confirm';
import { errorMessage } from '@/utils/errors';

export default function Comunidades() {
  const router = useRouter();
  const { isGestor } = useRole();
  const { data, loading, error, reload } = useAsync(listarComunidadesCrud);
  const [msg, setMsg] = useState('');

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  if (!isGestor) {
    return (
      <View style={styles.flex}>
        <ScreenHeader title="Comunidades" onBack={() => router.back()} />
        <EmptyState title="Acesso restrito" hint="Só o perfil Gestor gerencia comunidades." />
      </View>
    );
  }

  async function excluir(id: number) {
    if (!(await confirmar('Excluir comunidade?', 'Os dados ligados a ela podem ser afetados.'))) return;
    try {
      await excluirComunidade(id);
      setMsg('');
      reload();
    } catch (e) {
      setMsg(errorMessage(e, 'Não foi possível excluir. Verifique se há dados vinculados.'));
    }
  }

  return (
    <View style={styles.flex}>
      <ScreenHeader
        title="Comunidades"
        onBack={() => router.back()}
        right={<Chip label="＋ Nova" onPress={() => router.push('/comunidades/form')} />}
      />
      {loading && !data ? (
        <Loader />
      ) : error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
          ListHeaderComponent={!!msg ? <Text style={styles.msg}>{msg}</Text> : null}
          ListEmptyComponent={<EmptyState title="Nenhuma comunidade" hint="Toque em “Nova” para cadastrar." />}
          renderItem={({ item: c }) => (
            <Card>
              <Text style={styles.nome}>{c.nome}</Text>
              <Text style={styles.sub}>{c.latitude}, {c.longitude}</Text>
              <View style={styles.row}>
                <Chip
                  label="Editar"
                  onPress={() =>
                    router.push({
                      pathname: '/comunidades/form',
                      params: { id: String(c.id), nome: c.nome, latitude: String(c.latitude), longitude: String(c.longitude) },
                    })
                  }
                />
                <Chip label="Excluir" onPress={() => excluir(c.id)} />
              </View>
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
  row: { flexDirection: 'row', gap: 8, marginTop: 6 },
  nome: { fontSize: 16, fontWeight: '700', color: colors.ink },
  sub: { fontSize: 12, color: colors.muted },
  msg: { fontSize: 14, color: colors.danger, marginBottom: 8 },
});