import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function Sobre() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const cfg = Constants.expoConfig;
  const commit = (cfg?.extra?.commitHash as string | undefined) ?? 'indisponível';

  return (
    <View style={[styles.flex, { backgroundColor: themeColors.bg }]}>
      <ScreenHeader cena="sobre" title="Sobre o app" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={[styles.titulo, { color: themeColors.teal }]}>Vazante + Saberes</Text>
          <Text style={[styles.text, { color: themeColors.ink }]}>Global Solution 2026/2 · CitizenTech · FIAP</Text>
        </Card>
        <Card>
          <Text style={[styles.label, { color: themeColors.muted }]}>Versão</Text>
          <Text style={[styles.text, { color: themeColors.ink }]}>{cfg?.version ?? '—'}</Text>
          <Text style={[styles.label, { color: themeColors.muted }]}>Commit</Text>
          <Text style={[styles.mono, { color: themeColors.ink }]}>{commit}</Text>
        </Card>
        <Card>
          <Text style={[styles.label, { color: themeColors.muted }]}>Dados</Text>
          <Text style={[styles.text, { color: themeColors.ink }]}>
            As comunidades, as coordenadas, os níveis e os relatos deste ambiente são fictícios e servem apenas para demonstração.
          </Text>
        </Card>
        <Card>
          <Text style={[styles.label, { color: themeColors.muted }]}>Uso de IA</Text>
          <Text style={[styles.text, { color: themeColors.ink }]}>
            A IA generativa transcreve relatos e redige planos de abastecimento. O índice de isolamento é explicável e a decisão final é do gestor.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 10 },
  titulo: { fontSize: 20, fontWeight: '800', color: colors.teal },
  label: { fontSize: 12, color: colors.muted },
  text: { fontSize: 14, color: colors.ink },
  mono: { fontSize: 14, color: colors.ink, fontFamily: 'monospace' },
});