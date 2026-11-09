import { ENDPOINTS } from '@/constants/endpoints';
import { Comunidade, LoginResponse, RegisterPayload } from '@/types/auth';
import { api } from './api';

export async function login(email: string, senha: string) {
  const { data } = await api.post<LoginResponse>(ENDPOINTS.login, { email, senha });
  return data;
}

export async function register(payload: RegisterPayload) {
  await api.post(ENDPOINTS.register, payload);
}

export async function listarComunidades(): Promise<Comunidade[]> {
  const { data } = await api.get(ENDPOINTS.comunidades);
  return Array.isArray(data) ? data : data.content ?? [];
}