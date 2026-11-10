import { ENDPOINTS } from '@/constants/endpoints';
import { ComunidadeMapa } from '@/types/mapa';
import { Painel } from '@/types/painel';
import { normalizarEstado } from '@/utils/risk';
import { api } from './api';
import { demoMapa, demoPainel, isDemo } from './demo';

export async function getMapa(): Promise<ComunidadeMapa[]> {
  if (isDemo()) return demoMapa();
  const { data } = await api.get(ENDPOINTS.mapa);
  const lista: any[] = Array.isArray(data) ? data : data.comunidades ?? data.content ?? [];
  return lista.map((c) => {
    const indice = Number(c.indice ?? c.indiceIsolamento ?? 0);
    return {
      id: c.id,
      nome: c.nome,
      latitude: Number(c.latitude),
      longitude: Number(c.longitude),
      indice,
      diasPrevistos: c.diasPrevistos ?? c.diasAteIsolamento ?? null,
      estado: normalizarEstado(c.estado, indice),
    };
  });
}

export async function getPainel(id: number | string): Promise<Painel> {
  if (isDemo()) return demoPainel(Number(id));
  const { data } = await api.get<Painel>(ENDPOINTS.painel(id));
  return data;
}