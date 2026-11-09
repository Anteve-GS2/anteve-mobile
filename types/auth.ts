export type Papel = 'MORADOR' | 'LIDERANCA' | 'AGENTE_SAUDE' | 'GESTOR';

export interface User {
  nome: string;
  papel: Papel;
}

// Formato suposto da resposta do login: confirmar no api_endpoints.md.
export interface LoginResponse extends User {
  token: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  papel: Exclude<Papel, 'GESTOR'>;
  comunidadeId?: number;
}

export interface Comunidade {
  id: number;
  nome: string;
}