import { EstadoRisco } from '@/types/mapa';
import { colors } from './theme';

export const RISK: Record<EstadoRisco, { label: string; color: string; text: string }> = {
  NORMAL: { label: 'Normal', color: colors.risk.normal, text: '#FFFFFF' },
  ATENCAO: { label: 'Atenção', color: colors.risk.atencao, text: colors.ink },
  ELEVADO: { label: 'Risco elevado', color: colors.risk.elevado, text: colors.ink },
  IMINENTE: { label: 'Isolamento iminente', color: colors.risk.iminente, text: '#FFFFFF' },
};

export const ESTADOS: EstadoRisco[] = ['NORMAL', 'ATENCAO', 'ELEVADO', 'IMINENTE'];