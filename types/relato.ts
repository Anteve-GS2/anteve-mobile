// Formatos supostos: confirmar no api_endpoints.md.
export interface Relato {
  id: number;
  comunidadeId?: number;
  comunidadeNome?: string;
  texto?: string;
  data?: string;
  indicador?: string | null;
  antecedencia?: string | null;
  confianca?: string | null;
}

export interface NovoRelato {
  comunidadeId: number;
  comunidadeNome?: string; // só para exibir na fila, não é enviado
  texto?: string;
  audioUri?: string;
}

export interface RelatoFila extends NovoRelato {
  localId: string;
  criadoEm: string;
}