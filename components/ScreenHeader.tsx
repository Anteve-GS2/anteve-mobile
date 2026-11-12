import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Hero } from './Hero';
import { CenaNome } from './illustrations/Cena';

interface Props {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  cena?: CenaNome;
  compacto?: boolean;
}

export function ScreenHeader({ title, onBack, right, cena = 'rio', compacto }: Props) {
  return (
    <Hero cena={cena} height={compacto ? 132 : 168}>
      <View style={[styles.content, compacto && { paddingTop: 40 }]}>
        <View style={styles.top}>
          {onBack ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={onBack} hitSlop={10} style={styles.back}>
              <Text style={styles.backText}>←</Text>
            </Pressable>
          ) : (
            <View />
          )}
          {right}
        </View>
        <Text style={styles.title} numberOfLines={2} accessibilityRole="header">
          {title}
        </Text>
      </View>
    </Hero>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: 46, paddingHorizontal: 20, gap: 8 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 40 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 22, color: '#fff', fontWeight: '700' },
  title: {
    maxWidth: '62%',
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowRadius: 6,
  },
});