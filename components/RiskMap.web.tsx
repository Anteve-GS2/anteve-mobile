import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { colors } from '@/constants/theme';
import { ComunidadeMapa } from '@/types/mapa';
import { formatarDias } from '@/utils/risk';

interface Props {
  items: ComunidadeMapa[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
}

// Na web o mapa nativo não existe: mostramos a lista. O mapa roda no Expo Go.
export function RiskMap({ items, onSelect }: Props) {
  return (
    <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={{ padding: 16, gap: 8 }}>
      <Text style={{ color: colors.muted, fontSize: 13 }}>
        O mapa interativo funciona no app (Expo Go, Android e iOS). Na web, veja a lista.
      </Text>
      {items.map((i) => (
        <Pressable key={i.id} onPress={() => onSelect(i.id)}>
          <Card>
            <Text style={{ fontWeight: '700', color: colors.ink }}>{i.nome}</Text>
            <Badge estado={i.estado} />
            <Text style={{ color: colors.muted, fontSize: 13 }}>Isolamento em {formatarDias(i.diasPrevistos)}</Text>
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  );
}