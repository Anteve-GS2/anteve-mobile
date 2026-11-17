import { isAxiosError } from 'axios';

interface HttpErrorShape {
  response?: {
    status?: number;
    data?: { message?: string };
  };
}

export function errorMessage(
  error: unknown,
  fallback = 'Algo deu errado. Tente de novo.'
): string {
  const isHttpError = isAxiosError<{ message?: string }>(error)
    || (typeof error === 'object' && error !== null && 'response' in error);
  if (!isHttpError) {
    return 'Sem conexão com o servidor. Verifique a internet e tente de novo.';
  }

  const response = (error as HttpErrorShape).response;
  if (!response) return 'Sem conexão com o servidor. Verifique a internet e tente de novo.';
  if (response.status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (response.status === 403) return 'Você não tem permissão para esta ação.';
  return response.data?.message ?? fallback;
}