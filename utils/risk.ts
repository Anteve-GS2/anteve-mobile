import { EstadoRisco } from '@/types/mapa';

// Faixas iniciais do PDF: <0,25 verde · <0,50 amarelo · <0,75 laranja · resto vermelho.
export function estadoPorIndice(indice: number): EstadoRisco {
  if (indice < 0.25) return 'NORMAL';
  if (indice < 0.5) return 'ATENCAO';
  if (indice < 0.75) return 'ELEVADO';
  return 'IMINENTE';
}

export function normalizarEstado(raw: unknown, indice: number): EstadoRisco {
  const s = String(raw ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  if (s === 'NORMAL' || s === 'VERDE') return 'NORMAL';
  if (s === 'ATENCAO' || s === 'AMARELO') return 'ATENCAO';
  if (s === 'ELEVADO' || s === 'RISCO_ELEVADO' || s === 'LARANJA') return 'ELEVADO';
  if (s === 'IMINENTE' || s === 'ISOLAMENTO_IMINENTE' || s === 'VERMELHO') return 'IMINENTE';
  return estadoPorIndice(indice);
}

export function formatarDias(dias?: number | null): string {
  if (dias === null || dias === undefined) return 'sem previsão';
  return dias === 1 ? '1 dia' : `${dias} dias`;
}