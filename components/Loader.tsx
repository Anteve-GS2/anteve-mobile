import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { Mini } from './illustrations/Mini';

export function Loader() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 8 }}>
      <Mini nome="carregando" />
      <ActivityIndicator color={colors.teal} />
      <Text style={{ color: colors.muted, fontSize: 13 }}>Carregando…</Text>
    </View>
  );
}