import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type MiniNome = 'vazio' | 'erro' | 'carregando';

const Agua = () => (
  <>
    <Path d="M0 76 Q30 68 60 76 T120 76 T160 76 V110 H0 Z" fill="#CFE8E8" />
    <Path d="M18 92 Q33 88 48 92 M104 98 Q120 94 136 98" stroke="#9FCFD2" strokeWidth={3} fill="none" strokeLinecap="round" />
  </>
);

export function Mini({ nome }: { nome: MiniNome }) {
  return (
    <Svg width={160} height={110} viewBox="0 0 160 110" accessible={false}>
      {nome !== 'erro' && <Circle cx={120} cy={36} r={15} fill="#F3C677" />}
      {nome === 'erro' ? (
        <>
          <Path d="M40 62 Q36 40 58 38 Q66 20 90 26 Q112 22 116 46 Q134 48 130 64 Z" fill="#DCE5E3" />
          <Path d="M86 44 L72 70 H84 L78 94 L100 64 H88 Z" fill="#E07B00" />
        </>
      ) : (
        <>
          <Agua />
          <Path d="M36 72 Q80 94 128 70 L118 82 Q80 100 46 84 Z" fill="#B5532F" />
          {nome === 'carregando' && (
            <>
              <Path d="M82 80 V40" stroke="#14232B" strokeWidth={2} />
              <Path d="M84 42 L108 62 L84 70 Z" fill="#1C8F94" />
            </>
          )}
        </>
      )}
    </Svg>
  );
}