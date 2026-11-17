import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';

export type MiniNome = 'vazio' | 'erro' | 'carregando';

const imagens: Record<MiniNome, ImageSourcePropType> = {
  vazio: require('../../assets/images/river-community-sunset.png') as ImageSourcePropType,
  erro: require('../../assets/images/stilt-village.png') as ImageSourcePropType,
  carregando: require('../../assets/images/supply-boat.png') as ImageSourcePropType,
};

export function Mini({ nome }: { nome: MiniNome }) {
  return <Image source={imagens[nome]} style={styles.image} resizeMode="cover" accessible={false} />;
}

const styles = StyleSheet.create({
  image: { width: 160, height: 110, borderRadius: 16 },
});
