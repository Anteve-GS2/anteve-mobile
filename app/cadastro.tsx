import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { errorMessage } from '@/utils/errors';
import { listarComunidades, register } from '@/services/auth';
import { Comunidade, RegisterPayload } from '@/types/auth';
import { colors, radius, space } from '@/constants/theme';

type PapelCadastro = RegisterPayload['papel'];
const PAPEIS: { value: PapelCadastro; label: string }[] = [
  { value: 'MORADOR', label: 'Morador' },
  { value: 'LIDERANCA', label: 'Liderança' },
  { value: 'AGENTE_SAUDE', label: 'Agente de saúde' },
];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, active && styles.chipOn]}
    >
      <Text style={[styles.chipText, active && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState<PapelCadastro>('MORADOR');
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [comunidadeId, setComunidadeId] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pode exigir token na API; se falhar, o cadastro segue sem escolher comunidade.
    listarComunidades().then(setComunidades).catch(() => setComunidades([]));
  }, []);

  async function handleRegister() {
    if (!nome.trim() || !email.trim() || senha.length < 8) {
      setError('Preencha nome, e-mail e uma senha com pelo menos 8 caracteres.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ nome: nome.trim(), email: email.trim(), senha, papel, comunidadeId });
      router.replace('/login');
    } catch (e) {
      setError(errorMessage(e, 'Não foi possível criar a conta.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Criar conta</Text>
      <Input label="Nome completo" value={nome} onChangeText={setNome} autoCapitalize="words" placeholder="Nome" />
      <Input label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="voce@email.com" />
      <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="mín. 8 caracteres" />

      <Text style={styles.label}>Seu papel</Text>
      <View style={styles.row}>
        {PAPEIS.map((p) => (
          <Chip key={p.value} label={p.label} active={papel === p.value} onPress={() => setPapel(p.value)} />
        ))}
      </View>

      {comunidades.length > 0 && (
        <>
          <Text style={styles.label}>Comunidade</Text>
          <View style={styles.row}>
            {comunidades.map((c) => (
              <Chip key={c.id} label={c.nome} active={comunidadeId === c.id} onPress={() => setComunidadeId(c.id)} />
            ))}
          </View>
        </>
      )}

      <Text style={styles.hint}>O perfil de Gestor é criado pela Defesa Civil.</Text>
      {!!error && <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
      <Button title="Cadastrar" onPress={handleRegister} loading={loading} />
      <Button title="Já tenho conta" variant="secondary" onPress={() => router.replace('/login')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.lg, gap: space.md },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink, marginTop: space.lg },
  label: { fontSize: 12, color: colors.muted },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { borderWidth: 1.5, borderColor: colors.field, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.white },
  chipOn: { backgroundColor: colors.teal, borderColor: colors.teal },
  chipText: { fontSize: 13, color: colors.ink },
  hint: { fontSize: 12, color: colors.muted },
  error: { color: colors.danger, fontSize: 14, borderRadius: radius },
});