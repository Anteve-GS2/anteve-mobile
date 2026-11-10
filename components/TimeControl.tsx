import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '@/constants/theme';
import { Card } from './Card';
import { Chip } from './Chip';

interface Props {
  dia: number; // pode ser fracionado (0,25 em 0,25)
  max: number;
  playing: boolean;
  onChange: (dia: number) => void;
  onTogglePlay: () => void;
}

export function TimeControl({ dia, max, playing, onChange, onTogglePlay }: Props) {
  const inteiro = Math.floor(dia);
  return (
    <Card>
      <View style={styles.row}>
        <Text style={styles.titulo} accessibilityLiveRegion="polite">
          {inteiro === 0 ? 'Hoje' : `Daqui a ${inteiro} dias`}
        </Text>
        <Chip label={playing ? '❚❚ Pausar' : '▶ Play'} onPress={onTogglePlay} />
      </View>
      <Slider
        minimumValue={0}
        maximumValue={max}
        step={0.25}
        value={dia}
        onValueChange={onChange}
        minimumTrackTintColor={colors.teal}
        thumbTintColor={colors.teal}
        accessibilityLabel="Dia da projeção"
      />
      <Text style={styles.nota}>Projeção feita no app a partir dos dias previstos. Não substitui o cálculo do servidor.</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 16, fontWeight: '800', color: colors.ink },
  nota: { fontSize: 11, color: colors.muted },
});