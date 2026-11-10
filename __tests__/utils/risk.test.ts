import { estadoPorIndice, formatarDias, normalizarEstado } from '@/utils/risk';

describe('estadoPorIndice (faixas do PDF)', () => {
  it.each([
    [0, 'NORMAL'],
    [0.24, 'NORMAL'],
    [0.25, 'ATENCAO'],
    [0.49, 'ATENCAO'],
    [0.5, 'ELEVADO'],
    [0.74, 'ELEVADO'],
    [0.75, 'IMINENTE'],
    [1, 'IMINENTE'],
  ])('índice %s vira %s', (indice, estado) => {
    expect(estadoPorIndice(indice)).toBe(estado);
  });
});

describe('normalizarEstado', () => {
  it('aceita nomes de estado e de cor, com ou sem acento', () => {
    expect(normalizarEstado('laranja', 0)).toBe('ELEVADO');
    expect(normalizarEstado('Atenção', 0)).toBe('ATENCAO');
    expect(normalizarEstado('ISOLAMENTO_IMINENTE', 0)).toBe('IMINENTE');
  });

  it('calcula pelo índice quando o texto não é reconhecido', () => {
    expect(normalizarEstado('xyz', 0.8)).toBe('IMINENTE');
    expect(normalizarEstado(undefined, 0.1)).toBe('NORMAL');
  });
});

describe('formatarDias', () => {
  it('formata singular, plural e ausência de previsão', () => {
    expect(formatarDias(null)).toBe('sem previsão');
    expect(formatarDias(1)).toBe('1 dia');
    expect(formatarDias(5)).toBe('5 dias');
  });
});