import React from 'react';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

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

const W = 400;
const H = 200;
const MADEIRA = '#6B4630';

function Fundo({ sol }: { sol: boolean }) {
  return (
    <>
      <Defs>
        <LinearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0B4F5A" />
          <Stop offset="0.62" stopColor="#1C8F94" />
          <Stop offset="1" stopColor="#F3C677" />
        </LinearGradient>
        <LinearGradient id="agua" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#2A9DA3" />
          <Stop offset="1" stopColor="#0B4F5A" />
        </LinearGradient>
      </Defs>
      <Rect width={W} height={H} fill="url(#ceu)" />
      {sol && <Circle cx={318} cy={128} r={26} fill="#FFE2A8" opacity={0.95} />}
      <Path d="M0 140 Q50 130 100 140 T200 140 T300 140 T400 140 V200 H0 Z" fill="url(#agua)" />
      <Path
        d="M20 160 Q40 156 60 160 M150 172 Q175 167 200 172 M290 158 Q315 153 340 158 M330 182 Q350 178 370 182"
        stroke="#fff"
        strokeOpacity={0.35}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <Path d="M0 142 Q30 130 55 138 Q80 126 110 140 L110 146 L0 146 Z" fill="#0B3B2E" opacity={0.85} />
    </>
  );
}

function Casa({ x }: { x: number }) {
  return (
    <G>
      <Rect x={x - 18} y={146} width={3} height={30} fill={MADEIRA} />
      <Rect x={x + 15} y={146} width={3} height={30} fill={MADEIRA} />
      <Rect x={x - 24} y={142} width={48} height={5} fill={MADEIRA} />
      <Rect x={x - 20} y={118} width={40} height={25} fill="#F4E3C3" />
      <Path d={`M${x - 26} 119 L${x} 100 L${x + 26} 119 Z`} fill="#B5532F" />
      <Rect x={x - 5} y={126} width={10} height={17} fill={MADEIRA} />
    </G>
  );
}

function Pino({ x, y, cor }: { x: number; y: number; cor: string }) {
  return (
    <G>
      <Path
        d={`M${x} ${y} C${x - 13} ${y - 13} ${x - 13} ${y - 32} ${x} ${y - 32} C${x + 13} ${y - 32} ${x + 13} ${y - 13} ${x} ${y} Z`}
        fill={cor}
        stroke="#fff"
        strokeWidth={2.5}
      />
      <Circle cx={x} cy={y - 21} r={4.5} fill="#fff" />
    </G>
  );
}

const CENAS: Record<CenaNome, () => React.ReactElement> = {
  rio: () => (
    <>
      <Path d="M210 152 Q240 172 292 150 L284 160 Q246 178 216 162 Z" fill={MADEIRA} />
      <Path d="M244 156 L246 142 Q252 138 258 142 L260 156 Z" fill="#B5532F" />
      <Circle cx={252} cy={134} r={6} fill="#F4E3C3" />
      <Path d="M238 130 Q252 118 266 130 Z" fill="#E0B100" />
      <Path d="M226 150 L278 176" stroke={MADEIRA} strokeWidth={3} strokeLinecap="round" />
      <Path
        d="M330 70 q6 -6 12 0 q6 -6 12 0 M360 90 q5 -5 10 0 q5 -5 10 0"
        stroke="#fff"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
  palafitas: () => (
    <>
      <Casa x={250} />
      <Casa x={330} />
    </>
  ),
  barco: () => (
    <>
      <Path d="M190 150 L350 150 L334 172 L206 172 Z" fill="#B5532F" />
      <Rect x={250} y={122} width={50} height={28} fill="#F4E3C3" />
      <Rect x={258} y={130} width={12} height={10} fill="#1C8F94" />
      <Rect x={278} y={130} width={12} height={10} fill="#1C8F94" />
      <Path d="M245 122 L275 108 L305 122 Z" fill="#14232B" />
      <Rect x={205} y={132} width={20} height={18} fill="#E0B100" />
      <Rect x={228} y={138} width={16} height={12} fill="#fff" />
      <Path d="M215 137 q-4 5 0 8 q4 -3 0 -8 z" fill="#2A9DA3" />
      <Rect x={324} y={100} width={2} height={50} fill="#14232B" />
      <Path d="M326 102 L348 110 L326 118 Z" fill="#C62828" />
    </>
  ),
  mapa: () => (
    <>
      <Path
        d="M215 168 Q260 120 300 140 T372 118"
        stroke="#fff"
        strokeWidth={2.5}
        strokeDasharray="6 6"
        fill="none"
        strokeLinecap="round"
      />
      <Pino x={215} y={168} cor="#2E8B57" />
      <Pino x={258} y={134} cor="#E0B100" />
      <Pino x={300} y={142} cor="#E07B00" />
      <Pino x={372} y={120} cor="#C62828" />
    </>
  ),
  detalhe: () => (
    <>
      <Casa x={322} />
      <Rect x={236} y={104} width={10} height={74} rx={3} fill="#F4E3C3" />
      <Path d="M246 114 h8 M246 126 h8 M246 138 h8 M246 150 h8 M246 162 h8" stroke="#F4E3C3" strokeWidth={2} />
      <Path d="M226 150 L240 143 V157 Z" fill="#E07B00" />
    </>
  ),
  simulador: () => (
    <>
      <Ellipse cx={304} cy={94} rx={46} ry={16} fill="#fff" />
      <Circle cx={280} cy={88} r={18} fill="#fff" />
      <Circle cx={316} cy={80} r={22} fill="#fff" />
      <Path
        d="M282 116 l-6 16 M300 116 l-6 16 M318 116 l-6 16 M336 116 l-6 16"
        stroke="#9FD8DC"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M232 146 L232 176 M223 167 L232 177 L241 167"
        stroke="#F3C677"
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  relato: () => (
    <>
      <Rect x={290} y={96} width={28} height={46} rx={14} fill="#fff" />
      <Path d="M280 120 Q280 152 304 152 Q328 152 328 120" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M304 152 V172 M290 172 H318" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
      <Path
        d="M268 112 Q262 120 268 128 M254 104 Q244 120 254 136 M340 112 Q346 120 340 128 M354 104 Q364 120 354 136"
        stroke="#F3C677"
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
  caderno: () => (
    <>
      <Rect x={236} y={92} width={92} height={44} rx={12} fill="#fff" />
      <Path d="M252 136 L246 150 L268 136 Z" fill="#fff" />
      <Path d="M248 106 H316 M248 118 H296" stroke="#1C8F94" strokeWidth={4} strokeLinecap="round" />
      <Rect x={296} y={140} width={80} height={36} rx={12} fill="#F4E3C3" />
      <Path d="M356 176 L364 188 L342 176 Z" fill="#F4E3C3" />
      <Path d="M308 152 H362 M308 163 H342" stroke="#B5532F" strokeWidth={4} strokeLinecap="round" />
      <Path d="M206 170 Q222 150 242 160 Q232 180 206 170 Z" fill="#2E8B57" />
    </>
  ),
  perfil: () => (
    <>
      <Path d="M268 178 Q268 128 300 128 Q332 128 332 178 Z" fill="#fff" />
      <Path d="M290 128 L300 142 L310 128" stroke="#1C8F94" strokeWidth={3} fill="none" />
      <Circle cx={300} cy={106} r={17} fill="#F4E3C3" />
      <Path d="M280 100 Q300 74 320 100 Z" fill="#E0B100" />
      <Ellipse cx={300} cy={100} rx={30} ry={5} fill="#E0B100" />
    </>
  ),
  sobre: () => (
    <>
      <Path d="M262 178 Q250 120 300 96 Q330 140 262 178 Z" fill="#2E8B57" />
      <Path d="M262 178 Q290 140 300 96" stroke="#CDEBD6" strokeWidth={2.5} fill="none" />
      <Path d="M300 178 Q300 136 346 126 Q352 160 300 178 Z" fill="#3FA56B" />
      <Path d="M236 178 Q232 148 214 142 Q206 166 236 178 Z" fill="#1F7A4D" />
    </>
  ),
};

export function Cena({ nome }: { nome: CenaNome }) {
  const sol = nome !== 'simulador' && nome !== 'relato';
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
      <Fundo sol={sol} />
      {CENAS[nome]()}
    </Svg>
  );
}