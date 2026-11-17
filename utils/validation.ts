export function validarNome(nome: string): string | undefined {
  if (!nome.trim()) return 'Informe seu nome.';
  if (nome.trim().length < 2) return 'Use pelo menos 2 caracteres.';
  return undefined;
}

export function validarEmail(email: string): string | undefined {
  if (!email.trim()) return 'Informe seu e-mail.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Digite um e-mail válido.';
  return undefined;
}

export function validarSenha(senha: string): string | undefined {
  if (!senha) return 'Informe sua senha.';
  if (senha.length < 8) return 'Use pelo menos 8 caracteres.';
  return undefined;
}
