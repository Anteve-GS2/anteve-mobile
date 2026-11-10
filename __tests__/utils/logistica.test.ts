import { POLO, VELOCIDADE_KMH } from '@/constants/logistica';
import { ComunidadeMapa } from '@/types/mapa';
import { distanciaKm } from '@/utils/geo';
import { Barco, aplicarLogistica, calcularBarcos, folgaDias, progressoBarco } from '@/utils/logistica';

const com = (over: Partial<ComunidadeMapa> = {}): ComunidadeMapa => ({
  id: 1,
  nome: 'A',
  latitude: POLO.latitude,
  longitude: POLO.longitude + 1,
  indice: 0.6,
  diasPrevistos: 3,
  estado: 'ELEVADO',
  ...over,
});

const barco = (over: Partial<Barco> = {}): Barco => ({
  id: 1,
  nome: 'A',
  origem: { latitude: 0, longitude: 0 },
  destino: { latitude: 0, longitude: 1 },
  etaHoras: 24,
  diasPrevistos: 1,
  ...over,
});

describe('calcularBarcos', () => {
  it('cria barco só para quem não está normal e tem previsão', () => {
    const itens = [
      com({ id: 1 }),
      com({ id: 2, estado: 'NORMAL' }),
      com({ id: 3, diasPrevistos: null }),
    ];
    expect(calcularBarcos(itens).map((b) => b.id)).toEqual([1]);
  });

  it('calcula o tempo de viagem pela distância e pela velocidade', () => {
    const c = com();
    const esperado = distanciaKm(POLO, c) / VELOCIDADE_KMH;
    expect(calcularBarcos([c])[0].etaHoras).toBeCloseTo(esperado, 5);
  });

  it('usa o centro das comunidades quando o polo está longe demais', () => {
    const longe = com({ latitude: 40, longitude: -100 });
    expect(calcularBarcos([longe])[0].origem).toEqual({ latitude: 40, longitude: -100 });
  });
});

describe('folga e logística', () => {
  it('folga = dias até o isolamento menos a viagem e o atraso', () => {
    expect(folgaDias(barco({ diasPrevistos: 5, etaHoras: 24 }), 0)).toBe(4);
    expect(folgaDias(barco({ diasPrevistos: 5, etaHoras: 24 }), 48)).toBe(2);
  });

  it('sem folga a comunidade fica iminente (regra do PDF)', () => {
    const itens = [com({ estado: 'ATENCAO' })];
    const b = [barco()]; // folga 0 sem atraso, -2 com 48 h
    expect(aplicarLogistica(itens, b, 0)[0].estado).toBe('ATENCAO');
    expect(aplicarLogistica(itens, b, 48)[0].estado).toBe('IMINENTE');
  });
});

describe('progressoBarco', () => {
  it('fica entre 0 e 1 e respeita o atraso', () => {
    const b = barco({ etaHoras: 100 });
    expect(progressoBarco(b, 0, 0)).toBe(0);
    expect(progressoBarco(b, 2, 0)).toBeCloseTo(0.48, 5);
    expect(progressoBarco(b, 2, 48)).toBe(0);
    expect(progressoBarco(b, 30, 0)).toBe(1);
  });

  it('viagem de zero hora já chegou', () => {
    expect(progressoBarco(barco({ etaHoras: 0 }), 0, 0)).toBe(1);
  });
});