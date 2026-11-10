import { montarAviso } from '@/utils/aviso';

describe('montarAviso', () => {
  it('inclui nome, situação, prazo e necessidades', () => {
    const texto = montarAviso(
      { nome: 'Santa Luzia', nivelAtual: 1.8, diasPrevistos: 5, necessidades: ['água filtrada'] },
      'ELEVADO'
    );
    expect(texto).toContain('Santa Luzia');
    expect(texto).toContain('Risco elevado');
    expect(texto).toContain('5 dias');
    expect(texto).toContain('água filtrada');
    expect(texto).toContain('previsão');
  });

  it('não fala de prazo quando não há previsão', () => {
    expect(montarAviso({ nome: 'X', diasPrevistos: null }, 'NORMAL')).not.toContain('isolamento é esperado');
  });
});