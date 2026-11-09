import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { colors } from '@/constants/theme';

export function LineChart({ values, height = 80 }: { values: number[]; height?: number }) {
  const [w, setW] = useState(0);
  if (values.length < 2) {
    return <Text style={{ color: colors.muted, fontSize: 13 }}>Sem leituras suficientes.</Text>;
  }
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = height - 4 - ((v - min) / span) * (height - 8);
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <Svg width={w} height={height}>
          <Polyline points={points} fill="none" stroke={colors.teal} strokeWidth={3} />
        </Svg>
      )}
    </View>
  );
}