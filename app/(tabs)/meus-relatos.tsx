import React from 'react';
import { View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';

// Tela 8 (meus relatos, CRUD): próxima etapa.
export default function MeusRelatos() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Meus relatos" />
      <EmptyState title="Em construção" hint="A lista e o CRUD de relatos entram na próxima etapa." />
    </View>
  );
}
