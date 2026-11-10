import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface Props {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

export function Stepper({ label, value, unit, min, max, step, onChange }: Props) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, v)));
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Diminuir ${label}`} style={styles.btn} onPress={() => set(value - step)}>
          <Text style={styles.btnText}>−</Text>
        </Pressable>
        <Text style={styles.value}>{value} <Text style={styles.unit}>{unit}</Text></Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Aumentar ${label}`} style={styles.btn} onPress={() => set(value + step)}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 12, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  btn: { width: 48, height: 48, borderRadius: radius, borderWidth: 1.5, borderColor: colors.field, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  btnText: { fontSize: 22, color: colors.ink },
  value: { fontSize: 20, fontWeight: '800', color: colors.ink },
  unit: { fontSize: 12, fontWeight: '400', color: colors.muted },
});