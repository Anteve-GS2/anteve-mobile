import { RISK } from '@/constants/risk';
import { EstadoRisco } from '@/types/mapa';
import { Painel } from '@/types/painel';
import { formatarDias } from '@/utils/risk';

// Texto simples para ser lido em voz alta.
export function montarAviso(p: Painel, estado: EstadoRisco): string {
  const partes = [`Aviso para ${p.nome ?? 'a comunidade'}.`, `Situação: ${RISK[estado].label}.`];
  if (p.nivelAtual !== undefined) partes.push(`O rio está com ${p.nivelAtual} metros.`);
  if (p.diasPrevistos !== null && p.diasPrevistos !== undefined) {
    partes.push(`O isolamento é esperado em ${formatarDias(p.diasPrevistos)}.`);
  }
  if (p.necessidades && p.necessidades.length > 0) {
    partes.push(`Serão priorizados: ${p.necessidades.join(', ')}.`);
  }
  partes.push('Esta é uma previsão. A decisão final é da Defesa Civil.');
  return partes.join(' ');
}