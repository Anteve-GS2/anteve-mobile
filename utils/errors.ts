import { AxiosError } from 'axios';

export function errorMessage(
  error: unknown,
  fallback = 'Algo deu errado. Tente de novo.'
): string {
  const e = error as AxiosError<{ message?: string }>;
  if (!e.response) {
    return 'Sem conexão com o servidor. Verifique a internet e tente de novo.';
  }
  return e.response.data?.message ?? fallback;
}