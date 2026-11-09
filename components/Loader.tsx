import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/theme';

export function Loader() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <ActivityIndicator color={colors.teal} size="large" />
    </View>
  );
}