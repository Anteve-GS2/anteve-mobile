import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, space } from '@/constants/theme';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useApiStatus } from '@/hooks/useApiStatus';
import { useAuth } from '@/context/AuthContext';

export function NetworkBanner() {
  const { connected, checking } = useNetworkStatus();
  const { token } = useAuth();
  const apiStatus = useApiStatus(connected && !checking && token !== 'demo');

  if (token === 'demo') return null;

  if (!checking && !connected) {
    return (
      <View style={styles.banner} accessibilityRole="alert">
        <Text style={styles.text}>Você está sem internet. Relatos novos serão enviados quando a conexão voltar.</Text>
      </View>
    );
  }

  if (!apiStatus.checking && apiStatus.available === false) {
    return (
      <View style={styles.banner} accessibilityRole="alert">
        <Text style={styles.text}>A API Java está indisponível no momento. Tente novamente em instantes.</Text>
      </View>
    );
  }

  return null;
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
