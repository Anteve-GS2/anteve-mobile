import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/Button';
import { Hero } from '@/components/Hero';
import { Input } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';
import { colors, space } from '@/constants/theme';

export default function Login() {
  const { signIn, signInDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !senha) {
      setError('Preencha o e-mail e a senha.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), senha);
    } catch (e: any) {
      setError(
        e?.response?.status === 401 || e?.response?.status === 403
          ? 'E-mail ou senha inválidos.'
          : 'Não foi possível entrar. Verifique a conexão e tente de novo.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Hero cena="rio" height={250}>
          <View style={styles.brandBox}>
            <Text style={styles.brand}>Vazante{'\n'}+ Saberes</Text>
            <Text style={styles.tagline}>Saiba onde o isolamento começa primeiro.</Text>
          </View>
        </Hero>

        <View style={styles.form}>
          <Text style={styles.titulo}>Entrar</Text>
          <Input label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="voce@email.com" />
          <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="••••••••" />
          {!!error && <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
          <Button title="Entrar" onPress={handleLogin} loading={loading} />
          <Button title="Modo demonstração" variant="secondary" onPress={signInDemo} />
          <Text style={styles.footer}>
            Não tem conta? <Link href="/cadastro" style={styles.link}>Criar conta</Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  brandBox: { paddingTop: 70, paddingHorizontal: 24, maxWidth: '64%', gap: 8 },
  brand: { fontSize: 32, fontWeight: '800', color: '#fff', lineHeight: 36, textShadowColor: 'rgba(0,0,0,0.25)', textShadowRadius: 6 },
  tagline: { fontSize: 13, color: '#E6F4F3' },
  form: { padding: space.lg, gap: space.md },
  titulo: { fontSize: 22, fontWeight: '800', color: colors.ink },
  error: { color: colors.danger, fontSize: 14 },
  footer: { textAlign: 'center', color: colors.muted, fontSize: 13 },
  link: { color: colors.teal, fontWeight: '700' },
});