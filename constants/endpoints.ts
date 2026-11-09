// Endpoints da API Java. Os de /mapa, /comunidades/{id}/painel e /simulacoes
// estão no PDF. Os demais são suposições: confirmar com quem faz a API.
export const ENDPOINTS = {
  login: '/auth/login', // a confirmar
  register: '/auth/register', // a confirmar
  comunidades: '/comunidades',
  mapa: '/mapa',
  painel: (id: number | string) => `/comunidades/${id}/painel`,
  simulacoes: '/simulacoes',
  relatos: '/relatos', // a confirmar
};