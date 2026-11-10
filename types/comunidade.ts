// Campos supostos para o CRUD de comunidades: confirmar no api_endpoints.md.
export interface ComunidadeCrud {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
}

export type ComunidadeInput = Omit<ComunidadeCrud, 'id'>;