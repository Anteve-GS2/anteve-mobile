export type EstadoRisco = 'NORMAL' | 'ATENCAO' | 'ELEVADO' | 'IMINENTE';

// Campos supostos a partir do PDF (GET /mapa): confirmar no api_endpoints.md.
export interface ComunidadeMapa {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  indice: number;
  diasPrevistos: number | null;
  estado: EstadoRisco;
}