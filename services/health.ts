import { ENDPOINTS } from '@/constants/endpoints';
import { api } from './api';

export interface ApiHealth {
  status: 'UP';
  service: string;
}

export async function verificarApi(): Promise<ApiHealth> {
  const { data } = await api.get<ApiHealth>(ENDPOINTS.health);
  return data;
}
