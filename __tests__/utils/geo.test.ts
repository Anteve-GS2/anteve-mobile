import { distanciaKm, interpolar } from '@/utils/geo';

describe('geo', () => {
  it('distância entre o mesmo ponto é zero', () => {
    expect(distanciaKm({ latitude: -3, longitude: -64 }, { latitude: -3, longitude: -64 })).toBe(0);
  });

  it('um grau de latitude mede cerca de 111 km', () => {
    expect(distanciaKm({ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 0 })).toBeCloseTo(111.19, 0);
  });

  it('interpola o ponto médio', () => {
    expect(interpolar({ latitude: 0, longitude: 0 }, { latitude: 10, longitude: -20 }, 0.5)).toEqual({
      latitude: 5,
      longitude: -10,
    });
  });
});