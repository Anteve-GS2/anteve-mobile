import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';

export type CenaNome =
  | 'rio'
  | 'palafitas'
  | 'barco'
  | 'mapa'
  | 'detalhe'
  | 'simulador'
  | 'relato'
  | 'caderno'
  | 'perfil'
  | 'sobre';

const rio = require('../../assets/images/river-community-sunset.png') as ImageSourcePropType;
const palafitas = require('../../assets/images/stilt-village.png') as ImageSourcePropType;
const barco = require('../../assets/images/supply-boat.png') as ImageSourcePropType;

const CENAS: Record<CenaNome, ImageSourcePropType> = {
  rio,
  palafitas,
  barco,
  mapa: rio,
  detalhe: palafitas,
  simulador: rio,
  relato: barco,
  caderno: palafitas,
  perfil: palafitas,
  sobre: rio,
};

export function Cena({ nome }: { nome: CenaNome }) {
  return <Image source={CENAS[nome]} style={styles.image} resizeMode="cover" accessible={false} />;
}

const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
});
