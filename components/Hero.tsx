import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';
import { Cena, CenaNome } from './illustrations/Cena';

interface Props {
  cena: CenaNome;
  height: number;
  children?: React.ReactNode;
}

export function Hero({ cena, height, children }: Props) {
  return (
    <View style={[styles.hero, { height }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Cena nome={cena} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    overflow: 'hidden',
    backgroundColor: colors.tealDark,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
});