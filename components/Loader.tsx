import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { Skeleton } from './Skeleton';

export function Loader() {
  return (
    <View style={{ flex: 1, padding: 20, gap: 14 }} accessibilityLabel="Carregando">
      <Skeleton height={180} style={{ borderRadius: 20 }} />
      <Skeleton width="58%" height={22} />
      <Skeleton width="82%" />
      <Skeleton width="72%" />
      <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>Carregando…</Text>
    </View>
  );
}