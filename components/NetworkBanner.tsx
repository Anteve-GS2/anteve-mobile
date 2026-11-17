import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, space } from '@/constants/theme';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function NetworkBanner() {
  const { connected, checking } = useNetworkStatus();
  if (checking || connected) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>Você está sem internet. Relatos novos serão enviados quando a conexão voltar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.ink,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
  },
  text: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
  },
});
