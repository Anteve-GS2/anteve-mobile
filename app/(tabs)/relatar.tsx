import React from 'react';
import { View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/constants/theme';

// Tela 7 (gravar relato por voz): próxima etapa.
export default function Relatar() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Gravar relato por voz" />
      <EmptyState title="Em construção" hint="A gravação por voz entra na próxima etapa." />
    </View>
  );
}
