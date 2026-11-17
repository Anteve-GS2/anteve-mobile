import { validarEmail, validarNome, validarSenha } from '@/utils/validation';

describe('validação de formulários', () => {
  it('valida nome obrigatório e tamanho mínimo', () => {
    expect(validarNome('')).toBeTruthy();
    expect(validarNome('A')).toBeTruthy();
    expect(validarNome('Ana')).toBeUndefined();
  });

  it('valida formato de e-mail', () => {
    expect(validarEmail('ana')).toBeTruthy();
    expect(validarEmail('ana@rio.org')).toBeUndefined();
  });

  it('exige senha com oito caracteres', () => {
    expect(validarSenha('1234567')).toBeTruthy();
    expect(validarSenha('12345678')).toBeUndefined();
  });
});
