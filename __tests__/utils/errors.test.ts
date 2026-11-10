import { errorMessage } from '@/utils/errors';

describe('errorMessage', () => {
  it('avisa de problema de conexão quando não há resposta', () => {
    expect(errorMessage({})).toMatch(/conexão/i);
  });

  it('usa a mensagem enviada pela API', () => {
    expect(errorMessage({ response: { data: { message: 'Nível inválido' } } })).toBe('Nível inválido');
  });

  it('usa o texto padrão quando a API não manda mensagem', () => {
    expect(errorMessage({ response: { data: {} } }, 'padrão')).toBe('padrão');
  });
});