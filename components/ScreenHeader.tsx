import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

interface Props {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, onBack, right }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        {onBack && (
          <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={onBack} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
        )}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 10,
    gap: 8,
    backgroundColor: colors.bg,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  back: { fontSize: 24, color: colors.ink },
  title: { fontSize: 20, fontWeight: '800', color: colors.ink, flexShrink: 1 },
});