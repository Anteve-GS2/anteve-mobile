import { ENDPOINTS } from '@/constants/endpoints';
import { lerFila, removerDaFila } from '@/storage/filaRelatos';
import { NovoRelato, Relato } from '@/types/relato';
import { api } from './api';

function mapRelato(r: any): Relato {
  const ind = r?.indicador;
  return {
    id: r?.id,
    comunidadeId: r?.comunidadeId ?? r?.comunidade?.id,
    comunidadeNome: r?.comunidadeNome ?? r?.comunidade?.nome,
    texto: r?.texto ?? r?.transcricao,
    data: r?.data ?? r?.criadoEm,
    indicador: typeof ind === 'string' ? ind : ind?.nome ?? ind?.descricao ?? null,
    antecedencia: r?.antecedencia ?? r?.antecedenciaDias ?? ind?.antecedencia ?? null,
    confianca: r?.confianca ?? ind?.confianca ?? null,
  };
}

function toFormData(n: NovoRelato) {
  const f = new FormData();
  f.append('comunidadeId', String(n.comunidadeId));
  if (n.texto) f.append('texto', n.texto);
  if (n.audioUri) {
    f.append('audio', { uri: n.audioUri, name: 'relato.m4a', type: 'audio/m4a' } as any);
  }
  return f;
}

export async function criarRelato(novo: NovoRelato): Promise<Relato> {
  const { data } = await api.post(ENDPOINTS.relatos, toFormData(novo), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return mapRelato(data);
}

export async function listarMeusRelatos(): Promise<Relato[]> {
  const { data } = await api.get(ENDPOINTS.relatos);
  const lista: any[] = Array.isArray(data) ? data : data.content ?? [];
  return lista.map(mapRelato);
}

export async function atualizarRelato(id: number, texto: string) {
  await api.put(`${ENDPOINTS.relatos}/${id}`, { texto });
}

export async function excluirRelato(id: number) {
  await api.delete(`${ENDPOINTS.relatos}/${id}`);
}

// Envia a fila guardada offline. Para na primeira falha de rede.
export async function enviarFila(): Promise<number> {
  let enviados = 0;
  for (const item of await lerFila()) {
    try {
      await criarRelato(item);
      await removerDaFila(item.localId);
      enviados += 1;
    } catch (e: any) {
      if (!e?.response) break;
    }
  }
  return enviados;
}