import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { ESTADOS, RISK } from '@/constants/risk';
import { colors, space } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { ComunidadeMapa } from '@/types/mapa';

export function DashboardSummary({ items }: { items: ComunidadeMapa[] }) {
  const { colors: themeColors } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: themeColors.teal }]}>VISÃO GERAL</Text>
            <Text style={[styles.title, { color: themeColors.ink }]}>Risco das comunidades</Text>
          </View>
          <Text style={[styles.total, { color: themeColors.teal }]}>{items.length}</Text>
        </View>
        <Text style={[styles.caption, { color: themeColors.muted }]}>
          {items.filter((item) => item.estado === 'ELEVADO' || item.estado === 'IMINENTE').length} comunidade(s) exigem atenção imediata
        </Text>
        <View style={styles.metrics}>
          {ESTADOS.map((estado) => (
            <View key={estado} style={styles.metric}>
              <View style={[styles.dot, { backgroundColor: RISK[estado].color }]} />
              <Text style={[styles.count, { color: themeColors.ink }]}>{items.filter((item) => item.estado === estado).length}</Text>
              <Text style={[styles.label, { color: themeColors.muted }]}>{RISK[estado].label}</Text>
            </View>
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: colors.teal, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { color: colors.ink, fontSize: 16, fontWeight: '800', marginTop: 2 },
  total: { color: colors.teal, fontSize: 28, fontWeight: '800' },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  metric: { flex: 1, gap: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, marginBottom: 2 },
  count: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  label: { color: colors.muted, fontSize: 10 },
  caption: { fontSize: 12, marginTop: -6 },
});
