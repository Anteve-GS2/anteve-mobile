import { ENDPOINTS } from '@/constants/endpoints';
import { ComunidadeCrud, ComunidadeInput } from '@/types/comunidade';
import { api } from './api';

// Se a API paginar (Spring Page), isto traz só a primeira página.
export async function listarComunidadesCrud(): Promise<ComunidadeCrud[]> {
  const { data } = await api.get(ENDPOINTS.comunidades);
  const lista: any[] = Array.isArray(data) ? data : data.content ?? [];
  return lista.map((c) => ({
    id: c.id,
    nome: c.nome,
    latitude: Number(c.latitude),
    longitude: Number(c.longitude),
  }));
}

export async function criarComunidade(input: ComunidadeInput) {
  await api.post(ENDPOINTS.comunidades, input);
}

export async function atualizarComunidade(id: number, input: ComunidadeInput) {
  await api.put(`${ENDPOINTS.comunidades}/${id}`, input);
}

export async function excluirComunidade(id: number) {
  await api.delete(`${ENDPOINTS.comunidades}/${id}`);
}