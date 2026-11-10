import { POLO, RAIO_MAX_KM, VELOCIDADE_KMH } from '@/constants/logistica';
import { ComunidadeMapa } from '@/types/mapa';
import { Coord, distanciaKm } from './geo';

export interface Barco {
  id: number;
  nome: string;
  origem: Coord;
  destino: Coord;
  etaHoras: number;
  diasPrevistos: number; // dias até o isolamento, nos dados originais
}

function resolverPolo(items: ComunidadeMapa[]): Coord {
  if (items.length === 0) return POLO;
  const maisPerto = Math.min(...items.map((c) => distanciaKm(POLO, c)));
  if (maisPerto <= RAIO_MAX_KM) return POLO;
  const n = items.length;
  return {
    latitude: items.reduce((s, c) => s + c.latitude, 0) / n,
    longitude: items.reduce((s, c) => s + c.longitude, 0) / n,
  };
}

// Um barco para cada comunidade que já pede atenção e tem previsão.
export function calcularBarcos(items: ComunidadeMapa[]): Barco[] {
  const origem = resolverPolo(items);
  return items
    .filter((c) => c.estado !== 'NORMAL' && c.diasPrevistos !== null)
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      origem,
      destino: { latitude: c.latitude, longitude: c.longitude },
      etaHoras: distanciaKm(origem, c) / VELOCIDADE_KMH,
      diasPrevistos: c.diasPrevistos as number,
    }));
}

export function folgaDias(b: Barco, atrasoHoras: number): number {
  return b.diasPrevistos - (b.etaHoras + atrasoHoras) / 24;
}

export function progressoBarco(b: Barco, tempoDias: number, atrasoHoras: number): number {
  if (b.etaHoras <= 0) return 1;
  return Math.min(1, Math.max(0, (tempoDias * 24 - atrasoHoras) / b.etaHoras));
}

export function textoFolga(b: Barco, atrasoHoras: number): string {
  const f = folgaDias(b, atrasoHoras);
  return f >= 0
    ? `Folga de barco: ${f.toFixed(1)} dias`
    : 'Sem folga: o barco chega depois do isolamento';
}

// Regra do PDF: quando os dias até o isolamento são menores que o tempo logístico, fica vermelho.
export function aplicarLogistica(items: ComunidadeMapa[], barcos: Barco[], atrasoHoras: number): ComunidadeMapa[] {
  const sem = new Set(barcos.filter((b) => folgaDias(b, atrasoHoras) < 0).map((b) => b.id));
  return items.map((c) => (sem.has(c.id) ? { ...c, estado: 'IMINENTE' as const } : c));
}