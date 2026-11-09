import { EstadoRisco } from './mapa';

// Campos supostos a partir do PDF (GET /comunidades/{id}/painel).
// Tudo opcional para a tela não quebrar se a API usar outros nomes.
export interface Painel {
  id?: number;
  nome?: string;
  estado?: EstadoRisco | string;
  indice?: number;
  diasPrevistos?: number | null;
  nivelAtual?: number;
  variacaoDiaria?: number;
  vulneraveis?: number;
  historico?: { data?: string; nivel: number }[];
  relatosRecentes?: { texto: string; data?: string; local?: string }[];
  indicadores?: { nome: string; acertos?: number; tentativas?: number }[];
  necessidades?: string[];
}