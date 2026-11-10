import { ESTADOS } from '@/constants/risk';
import {
  demoCriarComunidade,
  demoExcluirComunidade,
  demoListarComunidades,
  demoMapa,
  demoSimular,
  isDemo,
  setDemo,
} from '@/services/demo';

const indiceEstado = (e: string) => ESTADOS.indexOf(e as (typeof ESTADOS)[number]);

describe('modo demonstração', () => {
  it('liga e desliga', () => {
    setDemo(true);
    expect(isDemo()).toBe(true);
    setDemo(false);
    expect(isDemo()).toBe(false);
  });

  it('cobre os quatro estados de risco (para o vídeo)', () => {
    const estados = new Set(demoMapa().map((c) => c.estado));
    ESTADOS.forEach((e) => expect(estados.has(e)).toBe(true));
  });

  it('piorar o cenário nunca melhora o estado', () => {
    for (const c of demoMapa()) {
      let anterior = -1;
      for (const queda of [0, 14, 30, 60, 100]) {
        const r = demoSimular({ comunidadeId: c.id, variacaoNivelCmDia: queda, chuvaMm3Dias: 0, rotaInterrompida: false, atrasoHoras: 0 });
        const atual = indiceEstado(r.simulado.estado);
        expect(atual).toBeGreaterThanOrEqual(anterior);
        anterior = atual;
      }
    }
  });

  it('rota interrompida não melhora o índice', () => {
    const base = { comunidadeId: 2, variacaoNivelCmDia: 14, chuvaMm3Dias: 0, atrasoHoras: 0 };
    const sem = demoSimular({ ...base, rotaInterrompida: false }).simulado.indice;
    const com = demoSimular({ ...base, rotaInterrompida: true }).simulado.indice;
    expect(com).toBeGreaterThanOrEqual(sem);
  });

  it('CRUD de comunidades em memória', () => {
    const antes = demoListarComunidades().length;
    demoCriarComunidade({ nome: 'Teste', latitude: -3, longitude: -64 });
    const lista = demoListarComunidades();
    expect(lista.length).toBe(antes + 1);
    demoExcluirComunidade(lista[lista.length - 1].id);
    expect(demoListarComunidades().length).toBe(antes);
  });
});