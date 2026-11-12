import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Input } from '@/components/Input';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/constants/theme';
import { listarComunidades, register } from '@/services/auth';
import { Comunidade, RegisterPayload } from '@/types/auth';
import { errorMessage } from '@/utils/errors';

type PapelCadastro = RegisterPayload['papel'];
const PAPEIS: { value: PapelCadastro; label: string }[] = [
  { value: 'MORADOR', label: 'Morador' },
  { value: 'LIDERANCA', label: 'Liderança' },
  { value: 'AGENTE_SAUDE', label: 'Agente de saúde' },
];

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
    <View style={styles.flex}>
      <ScreenHeader cena="palafitas" title="Criar conta" onBack={() => router.replace('/login')} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.lg, gap: space.md },
  label: { fontSize: 12, fontWeight: '600', color: colors.muted },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  hint: { fontSize: 12, color: colors.muted },
  error: { color: colors.danger, fontSize: 14 },
});