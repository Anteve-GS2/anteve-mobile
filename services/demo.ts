// Modo demonstração: dados 100% FICTÍCIOS, em memória, para apresentar sem internet nem API.
import { ComunidadeCrud, ComunidadeInput } from '@/types/comunidade';
import { ComunidadeMapa } from '@/types/mapa';
import { Painel } from '@/types/painel';
import { NovoRelato, Relato } from '@/types/relato';
import { Cenario, SimulacaoInput, SimulacaoResultado } from '@/types/simulacao';
import { estadoPorIndice } from '@/utils/risk';

let ativo = false;
export const isDemo = () => ativo;
export const setDemo = (v: boolean) => {
  ativo = v;
};

interface Base {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  indice: number;
  dias: number | null;
}

let comunidades: Base[] = [
  { id: 1, nome: 'Ilha Grande', latitude: -3.1, longitude: -63.36, indice: 0.86, dias: 1 },
  { id: 2, nome: 'Santa Luzia', latitude: -3.0, longitude: -61.3, indice: 0.62, dias: 3 },
  { id: 3, nome: 'São José', latitude: -2.8, longitude: -62.6, indice: 0.41, dias: 8 },
  { id: 4, nome: 'Boa Vista', latitude: -4.0, longitude: -64.0, indice: 0.36, dias: 9 },
  { id: 5, nome: 'Vila Nova', latitude: -3.6, longitude: -65.4, indice: 0.12, dias: 20 },
  { id: 6, nome: 'Nova Esperança', latitude: -2.6, longitude: -64.9, indice: 0.18, dias: 24 },
];
let proximoId = 100;

const horasAtras = (h: number) => new Date(Date.now() - h * 3600e3).toISOString();
let relatos: Relato[] = [
  { id: 1, comunidadeId: 2, comunidadeNome: 'Santa Luzia', texto: 'O igarapé não passa mais barco', data: horasAtras(6), indicador: 'sem navegação', antecedencia: '5 dias', confianca: 'alta' },
  { id: 2, comunidadeId: 2, comunidadeNome: 'Santa Luzia', texto: 'Os peixes sumiram do lago', data: horasAtras(30), indicador: 'fauna', antecedencia: '7 dias', confianca: 'média' },
];
let proximoRelato = 100;

export function demoMapa(): ComunidadeMapa[] {
  return comunidades.map((c) => ({
    id: c.id,
    nome: c.nome,
    latitude: c.latitude,
    longitude: c.longitude,
    indice: c.indice,
    diasPrevistos: c.dias,
    estado: estadoPorIndice(c.indice),
  }));
}

export function demoPainel(id: number): Painel {
  const c = comunidades.find((x) => x.id === id) ?? comunidades[0];
  const nivelAtual = Number((3.2 - c.indice * 2.2).toFixed(1));
  const variacao = Math.round(6 + c.indice * 12);
  return {
    id: c.id,
    nome: c.nome,
    indice: c.indice,
    diasPrevistos: c.dias,
    nivelAtual,
    variacaoDiaria: variacao,
    vulneraveis: Math.round(10 + c.indice * 40),
    historico: Array.from({ length: 7 }, (_, i) => ({
      nivel: Number((nivelAtual + ((6 - i) * variacao) / 100).toFixed(2)),
    })),
    relatosRecentes: relatos
      .filter((r) => r.comunidadeId === c.id)
      .map((r) => ({ texto: r.texto ?? '', data: new Date(r.data ?? '').toLocaleDateString('pt-BR') })),
    indicadores: [
      { nome: 'Igarapé sem passagem de barco', acertos: 7, tentativas: 10 },
      { nome: 'Peixes migrando do lago', acertos: 6, tentativas: 9 },
    ],
    necessidades: c.indice >= 0.5 ? ['água filtrada', 'combustível', 'medicamentos'] : c.indice >= 0.25 ? ['combustível'] : [],
  };
}

// Modelo simplificado só para a demonstração (o real vive na API Java).
function cenario(indice: number, dias: number | null, k: { N: number; T: number; R: number; V: number }): Cenario {
  return { indice, diasPrevistos: dias, estado: estadoPorIndice(indice), contribuicoes: k };
}

export function demoSimular(input: SimulacaoInput): SimulacaoResultado {
  const c = comunidades.find((x) => x.id === input.comunidadeId) ?? comunidades[0];
  const base = { N: c.indice * 0.4, T: c.indice * 0.3, R: c.indice * 0.15, V: c.indice * 0.15 };
  const fator = input.variacaoNivelCmDia / 14;
  const N = Math.min(0.5, base.N * (1 + 0.5 * (fator - 1)));
  const T = Math.max(0, Math.min(0.5, base.T * (1 + 0.5 * (fator - 1)) * (1 - input.chuvaMm3Dias / 600) + (input.rotaInterrompida ? 0.1 : 0)));
  const sim = N + T + base.R + base.V;
  const dias = c.dias === null ? null : Math.max(0, Math.round(c.dias * (1 - (sim - c.indice))));
  return { atual: cenario(c.indice, c.dias, base), simulado: cenario(sim, dias, { N, T, R: base.R, V: base.V }) };
}

export function demoListarRelatos(): Relato[] {
  return [...relatos];
}

export function demoCriarRelato(n: NovoRelato): Relato {
  const r: Relato = {
    id: proximoRelato++,
    comunidadeId: n.comunidadeId,
    comunidadeNome: comunidades.find((c) => c.id === n.comunidadeId)?.nome,
    texto: n.texto ?? 'O igarapé não passa mais barco',
    data: new Date().toISOString(),
    indicador: 'sem navegação',
    antecedencia: '5 dias',
    confianca: 'alta',
  };
  relatos = [r, ...relatos];
  return r;
}

export function demoAtualizarRelato(id: number, texto: string) {
  relatos = relatos.map((r) => (r.id === id ? { ...r, texto } : r));
}

export function demoExcluirRelato(id: number) {
  relatos = relatos.filter((r) => r.id !== id);
}

export function demoListarComunidades(): ComunidadeCrud[] {
  return comunidades.map(({ id, nome, latitude, longitude }) => ({ id, nome, latitude, longitude }));
}

export function demoCriarComunidade(i: ComunidadeInput) {
  comunidades = [...comunidades, { ...i, id: proximoId++, indice: 0.1, dias: 30 }];
}

export function demoAtualizarComunidade(id: number, i: ComunidadeInput) {
  comunidades = comunidades.map((c) => (c.id === id ? { ...c, ...i } : c));
}

export function demoExcluirComunidade(id: number) {
  comunidades = comunidades.filter((c) => c.id !== id);
}