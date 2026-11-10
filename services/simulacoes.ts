import { ENDPOINTS } from '@/constants/endpoints';
import { Cenario, SimulacaoInput, SimulacaoResultado } from '@/types/simulacao';
import { normalizarEstado } from '@/utils/risk';
import { api } from './api';

function mapCenario(c: any): Cenario {
  const indice = Number(c?.indice ?? 0);
  const k = c?.contribuicoes ?? c?.contribuicao ?? {};
  return {
    indice,
    diasPrevistos: c?.diasPrevistos ?? c?.diasAteIsolamento ?? null,
    estado: normalizarEstado(c?.estado, indice),
    contribuicoes: {
      N: Number(k.N ?? k.n ?? 0),
      T: Number(k.T ?? k.t ?? 0),
      R: Number(k.R ?? k.r ?? 0),
      V: Number(k.V ?? k.v ?? 0),
    },
  };
}

export async function simular(input: SimulacaoInput): Promise<SimulacaoResultado> {
  const { data } = await api.post(ENDPOINTS.simulacoes, input);
  return {
    atual: mapCenario(data.atual ?? data.situacaoAtual),
    simulado: mapCenario(data.simulado ?? data.situacaoSimulada),
  };
}