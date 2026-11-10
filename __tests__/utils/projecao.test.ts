import { ESTADOS } from '@/constants/risk';
import { ComunidadeMapa, EstadoRisco } from '@/types/mapa';
import { projetar } from '@/utils/projecao';

const com = (over: Partial<ComunidadeMapa> = {}): ComunidadeMapa => ({
  id: 1,
  nome: 'A',
  latitude: 0,
  longitude: 0,
  indice: 0.2,
  diasPrevistos: 10,
  estado: 'ATENCAO',
  ...over,
});

describe('projetar', () => {
  it('no dia 0 devolve os mesmos itens', () => {
    const itens = [com()];
    expect(projetar(itens, 0)).toBe(itens);
  });

  it('reduz os dias e nunca deixa negativo', () => {
    expect(projetar([com({ diasPrevistos: 10 })], 4)[0].diasPrevistos).toBe(6);
    expect(projetar([com({ diasPrevistos: 3 })], 5)[0].diasPrevistos).toBe(0);
  });

  it('não mexe em quem não tem previsão', () => {
    const c = com({ diasPrevistos: null });
    expect(projetar([c], 7)[0]).toEqual(c);
  });

  it('faltando 1 dia ou menos fica iminente', () => {
    expect(projetar([com({ diasPrevistos: 5, estado: 'NORMAL' })], 4)[0].estado).toBe('IMINENTE');
  });

  it('o estado nunca melhora com o passar do tempo', () => {
    const estados: EstadoRisco[] = ['NORMAL', 'ATENCAO', 'ELEVADO', 'IMINENTE'];
    for (const estado of estados) {
      for (const dias of [1, 3, 8, 20, 40]) {
        let anterior = ESTADOS.indexOf(estado);
        for (let dia = 0; dia <= 30; dia++) {
          const atual = ESTADOS.indexOf(projetar([com({ estado, diasPrevistos: dias })], dia)[0].estado);
          expect(atual).toBeGreaterThanOrEqual(anterior);
          anterior = atual;
        }
      }
    }
  });
});