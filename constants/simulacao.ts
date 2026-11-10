// Faixas válidas dos ajustes do simulador (valores iniciais: calibrar com a API).
export const FAIXAS = {
  queda: { min: 0, max: 100, step: 5, padrao: 14, unidade: 'cm/dia' },
  chuva: { min: 0, max: 300, step: 10, padrao: 0, unidade: 'mm em 3 dias' },
  atraso: { min: 0, max: 168, step: 12, padrao: 0, unidade: 'h' },
};