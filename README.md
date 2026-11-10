# Vazante + Saberes — App Mobile

App mobile (React Native + Expo) da proposta **Vazante + Saberes**, da Global Solution 2026/2 (CitizenTech, FIAP). Ele prevê em quantos dias cada comunidade ribeirinha ou periférica ficará isolada e mostra ao gestor onde o problema vai acontecer primeiro.


## Integrantes

| Nome completo | RM | Turma |
|---|---|---|
| Arthur Brito da Silva | RM562086 | 2TDSPG |
| Luiz Felipe Flosi dos Santos | RM563197 | 2TDSPG |
| Pedro Henrique Brum Lopes | RM561780 | 2TDSPG |

## O que o app faz

| Tela | O que entrega | Perfil |
|---|---|---|
| Login e cadastro | Autenticação com JWT, sessão guardada com segurança e logout que limpa a sessão | todos |
| Mapa de risco | Marcadores coloridos por estado, legenda que filtra, slider de tempo (hoje a +30 dias), barcos animados e cenário "e se o abastecimento atrasar 48 h?" | todos |
| Fila de abastecimento | Comunidades por urgência, com a folga de barco | todos |
| Detalhe da comunidade | Nível, previsão de isolamento, vulneráveis, gráfico de 7 dias, indicadores, relatos, necessidades e aviso falado | todos |
| Simulador de cenários | Rio baixa mais, chuva, rota interrompida e atraso, com atual × simulado e a contribuição de N, T, R e V | Gestor |
| Gravar relato por voz | Gravação de até 60 s, ouvir antes de enviar, texto opcional e fila offline | todos |
| Meus relatos | CRUD de relatos | todos |
| Comunidades | CRUD de comunidades com validação de coordenadas | Gestor |
| Perfil e Sobre o app | Dados do usuário, versão, hash do commit, aviso de dados fictícios e declaração de uso de IA | todos |

## Como rodar

```bash
npm install
cp .env.example .env      # e preencha a URL da API
npx expo start -c
```

Abra no **Expo Go** (Android ou iOS). O mapa e a gravação de voz não funcionam na web.

Variável de ambiente:

| Nome | Para que serve |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL base da API Java (ex.: `https://sua-api.azurewebsites.net`). No celular físico, não use `localhost` |

### Usuários de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Gestor | _preencher_ | _preencher_ |
| Morador | _preencher_ | _preencher_ |

### Modo demonstração

Na tela de login, o botão **Modo demonstração** entra como Gestor sem internet e sem a API, com seis comunidades fictícias cobrindo os quatro estados de risco. Os dados ficam em memória e uma faixa amarela avisa que são fictícios.

## Endpoints consumidos

| Uso | Endpoint |
|---|---|
| Mapa | `GET /mapa` |
| Detalhe | `GET /comunidades/{id}/painel` |
| Simulação (Gestor) | `POST /simulacoes` |
| CRUD de comunidades (Gestor) | `GET`, `POST`, `PUT`, `DELETE /comunidades` |
| CRUD de relatos | `GET`, `POST`, `PUT`, `DELETE /relatos` |
| Login e cadastro | `POST /auth/login`, `POST /auth/register` |

Os endpoints estão centralizados em `constants/endpoints.ts`. Confira os nomes e o formato dos campos com a API Java.

## Estrutura de pastas

```
app/          rotas (Expo Router): login, cadastro, (tabs), comunidade/[id], simulador, comunidades, sobre
components/   componentes reutilizáveis (Button, Input, Card, Badge, RiskMap, TimeControl...)
constants/    tema, endpoints, estados de risco, faixas do simulador, parâmetros de logística
context/      AuthContext (sessão e papel)
hooks/        useAsync, useRole, useSyncFilaRelatos
services/     chamadas HTTP (api, auth, mapa, simulacoes, relatos, comunidades) e modo demonstração
storage/      sessão (SecureStore) e fila offline de relatos (AsyncStorage)
types/        tipos do domínio
utils/        regras puras: risco, projeção no tempo, logística dos barcos, geo, avisos, erros
__tests__/    testes unitários
```

## Decisões e limites

- **Projeção no tempo e barcos são calculados no app**, a partir dos dias previstos pela API. As faixas (até 1 dia fica vermelho, até 5 laranja, até 10 amarelo), o polo de abastecimento e a velocidade do barco (15 km/h em linha reta) são ilustrativos e não substituem o cálculo do servidor. Ficam em `utils/projecao.ts` e `constants/logistica.ts`.
- **Regra de coerência:** com o passar do tempo, ou ao piorar um cenário, o estado nunca melhora. Há testes para isso.
- **Fila offline:** relatos gravados sem sinal ficam no aparelho e são enviados quando a conexão volta.
- **Acessibilidade:** o estado de risco é sempre escrito, nunca só colorido; botões têm rótulos de acessibilidade e o aviso falado ajuda quem lê pouco.
- **Segurança:** o token fica no `expo-secure-store` no celular, e uma resposta 401 da API encerra a sessão.

## Qualidade

```bash
npm run lint           # ESLint
npx prettier --check . # formatação
npx tsc --noEmit       # tipos
npm test               # testes unitários
```

## Declaração de uso de IA

Ferramenta usada: **Claude (Anthropic)**. Para que foi usada: apoio na estruturação do app, na geração e revisão de código (telas, serviços, utilitários e testes) e na redação deste README. O código foi lido, executado e ajustado pela equipe. Dentro do app, a IA generativa (no backend) só extrai indicadores dos relatos e redige planos de abastecimento; o índice é explicável e a decisão final é do gestor.

## Publicação

Distribuição pelo Firebase App Distribution, com o professor como tester. O hash do commit aparece na tela **Sobre o app**.