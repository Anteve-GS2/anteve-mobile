import { ESTADOS } from '@/constants/risk';
import { ComunidadeMapa, EstadoRisco } from '@/types/mapa';

// Faixas locais e ilustrativas (dias que faltam até o isolamento → estado).
function estadoPorDias(d: number): EstadoRisco {
  if (d <= 1) return 'IMINENTE';
  if (d <= 5) return 'ELEVADO';
  if (d <= 10) return 'ATENCAO';
  return 'NORMAL';
}

// Projeta o mapa `dia` dias à frente a partir dos dias previstos.
// Regra de coerência: o tempo só piora, nunca melhora o estado.
export function projetar(items: ComunidadeMapa[], dia: number): ComunidadeMapa[] {
  if (dia === 0) return items;
  return items.map((c) => {
    if (c.diasPrevistos === null) return c;
    const restantes = Math.max(0, c.diasPrevistos - dia);
    const proj = estadoPorDias(restantes);
    const estado = ESTADOS.indexOf(proj) > ESTADOS.indexOf(c.estado) ? proj : c.estado;
    return { ...c, diasPrevistos: restantes, estado };
  });
}