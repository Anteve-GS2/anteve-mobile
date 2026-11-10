import { EstadoRisco } from './mapa';

// Corpo suposto do POST /simulacoes: confirmar no api_endpoints.md.
export interface SimulacaoInput {
  comunidadeId: number;
  variacaoNivelCmDia: number;
  chuvaMm3Dias: number;
  rotaInterrompida: boolean;
  atrasoHoras: number;
}

export interface Cenario {
  indice: number;
  diasPrevistos: number | null;
  estado: EstadoRisco;
  contribuicoes: { N: number; T: number; R: number; V: number };
}

export interface SimulacaoResultado {
  atual: Cenario;
  simulado: Cenario;
}