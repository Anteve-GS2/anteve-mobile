# Pedido de endpoints para a API Java (app Mobile)

**Projeto:** Vazante + Saberes · Global Solution 2026/2
**De:** time do app Mobile · **Para:** quem faz a API Java

O app já está pronto para consumir os endpoints abaixo. Os nomes e os formatos são o que o front **espera hoje**. Se a API usar outro formato, **responda o que mudar** (ou ajuste este arquivo) e nós adaptamos o app. O que mais nos ajuda é a API respeitar este contrato, porque o app já está montado em cima dele.

## Regras gerais

| Item | O que esperamos |
|---|---|
| URL base | Uma URL pública, no ar durante a avaliação (nada de `localhost`) |
| Autenticação | `Authorization: Bearer <token JWT>` em todos os endpoints, menos login, cadastro e a lista de comunidades do cadastro |
| Papéis | `MORADOR`, `LIDERANCA`, `AGENTE_SAUDE` e `GESTOR` |
| Formato | JSON, datas em ISO 8601 (`2026-11-09T14:30:00Z`), números com ponto decimal |
| Estado de risco | Sempre um destes textos: `NORMAL`, `ATENCAO`, `ELEVADO`, `IMINENTE` |
| Erros | Status HTTP correto e corpo `{ "message": "texto em português" }`. O app mostra esse texto ao usuário |
| Sessão | `401` quando o token faltar ou expirar (o app faz logout) e `403` quando o papel não puder usar o recurso |
| CORS | Liberado para a origem do app (precisamos disso só para testes pela web) |
| Paginação | Se a lista vier paginada, devolver o formato do Spring (`content: [...]`) |

## Resumo

| # | Método e caminho | Quem usa | Para quê |
|---|---|---|---|
| 1 | `POST /auth/login` | todos | Entrar |
| 2 | `POST /auth/register` | todos | Criar conta |
| 3 | `GET /comunidades` | todos | Lista do cadastro e CRUD |
| 4 | `POST /comunidades` | Gestor | Criar comunidade |
| 5 | `PUT /comunidades/{id}` | Gestor | Editar comunidade |
| 6 | `DELETE /comunidades/{id}` | Gestor | Excluir comunidade |
| 7 | `GET /mapa` | todos | Mapa de risco e fila de prioridades |
| 8 | `GET /comunidades/{id}/painel` | todos | Detalhe da comunidade |
| 9 | `POST /simulacoes` | Gestor | Simulador de cenários |
| 10 | `POST /relatos` | todos | Enviar relato por voz ou texto |
| 11 | `GET /relatos` | todos | Meus relatos |
| 12 | `PUT /relatos/{id}` | dono do relato | Editar relato |
| 13 | `DELETE /relatos/{id}` | dono do relato | Excluir relato |
| 14 | `POST /comunidades/{id}/plano` | Gestor | Gerar plano de abastecimento (opcional) |

## 1. `POST /auth/login`

Entra no app e devolve o token e o papel do usuário.

```json
// Pedido
{ "email": "gestor@exemplo.com", "senha": "********" }

// Resposta 200
{ "token": "eyJhbGciOi...", "nome": "Maria Souza", "papel": "GESTOR" }
```
Erro de credencial: `401` com `message`.

## 2. `POST /auth/register`

Cria a conta. O perfil `GESTOR` **não** pode ser criado por aqui (a Defesa Civil cria).

```json
// Pedido
{ "nome": "João Lima", "email": "joao@exemplo.com", "senha": "mín. 8 caracteres",
  "papel": "MORADOR", "comunidadeId": 2 }
// Resposta: 201, sem corpo obrigatório. E-mail repetido: 409 com message.
```
`comunidadeId` é opcional.

## 3. `GET /comunidades`

Lista as comunidades. Precisa funcionar **sem token** para o cadastro mostrar a escolha de comunidade (se for exigir token, nos avise).

```json
// Resposta 200
[ { "id": 2, "nome": "Santa Luzia", "latitude": -3.0, "longitude": -61.3 } ]
```

## 4. `POST /comunidades` · 5. `PUT /comunidades/{id}` · 6. `DELETE /comunidades/{id}`

CRUD de comunidades, só para o `GESTOR`.

```json
// Pedido (POST e PUT)
{ "nome": "Santa Luzia", "latitude": -3.0, "longitude": -61.3 }
```
- Validação: nome obrigatório, latitude entre -90 e 90, longitude entre -180 e 180. Fora disso, `400` com `message`.
- `DELETE` com dados vinculados: `409` com `message` explicando o motivo.

## 7. `GET /mapa`

Uma linha por comunidade monitorada, já com o índice e o estado calculados. Alimenta o mapa colorido e a fila de prioridades.

```json
[ { "id": 2, "nome": "Santa Luzia", "latitude": -3.0, "longitude": -61.3,
    "indice": 0.62, "diasPrevistos": 3, "estado": "ELEVADO" } ]
```
- `indice` entre 0 e 1. Faixas: `NORMAL` abaixo de 0,25; `ATENCAO` até 0,50; `ELEVADO` até 0,75; `IMINENTE` a partir de 0,75.
- `diasPrevistos` pode ser `null` quando não há previsão.

## 8. `GET /comunidades/{id}/painel`

Tudo da tela de detalhe, em uma chamada.

```json
{ "id": 2, "nome": "Santa Luzia", "estado": "ELEVADO", "indice": 0.62, "diasPrevistos": 3,
  "nivelAtual": 1.8, "variacaoDiaria": 14, "vulneraveis": 37,
  "historico": [ { "data": "2026-11-03", "nivel": 2.6 }, { "data": "2026-11-09", "nivel": 1.8 } ],
  "relatosRecentes": [ { "texto": "O igarapé não passa mais barco", "data": "2026-11-09T08:10:00Z" } ],
  "indicadores": [ { "nome": "Igarapé sem passagem de barco", "acertos": 7, "tentativas": 10 } ],
  "necessidades": [ "água filtrada", "combustível" ] }
```
- `nivelAtual` em metros, `variacaoDiaria` em cm/dia, `historico` com os últimos 7 dias (do mais antigo ao mais novo).
- `vulneraveis` é só a **contagem**, sem identificar pessoas (LGPD).

## 9. `POST /simulacoes` (Gestor)

Recalcula o índice com os ajustes e devolve o atual e o simulado. **Não pode alterar dados reais.**

```json
// Pedido
{ "comunidadeId": 2, "variacaoNivelCmDia": 20, "chuvaMm3Dias": 0,
  "rotaInterrompida": false, "atrasoHoras": 48 }

// Resposta 200
{ "atual":    { "indice": 0.62, "diasPrevistos": 3, "estado": "ELEVADO",
                "contribuicoes": { "N": 0.20, "T": 0.16, "R": 0.12, "V": 0.14 } },
  "simulado": { "indice": 0.78, "diasPrevistos": 2, "estado": "IMINENTE",
                "contribuicoes": { "N": 0.28, "T": 0.24, "R": 0.12, "V": 0.14 } } }
```
- Faixas que o app respeita e a API deve validar (`400` fora delas): `variacaoNivelCmDia` de 0 a 100, `chuvaMm3Dias` de 0 a 300, `atrasoHoras` de 0 a 168.
- `contribuicoes` mostra o peso de cada termo (N nível, T tendência, R relatos, V vulnerabilidade), para a decisão ser explicável.
- Coerência: piorar o cenário nunca pode melhorar o estado.

## 10. `POST /relatos`

Recebe o relato por voz (ou por texto), a IA transcreve e extrai o indicador. Enviado como `multipart/form-data`.

| Campo | Tipo | Obrigatório |
|---|---|---|
| `comunidadeId` | número | sim |
| `audio` | arquivo `.m4a`, até 60 s | um dos dois |
| `texto` | texto | um dos dois |

```json
// Resposta 201
{ "id": 15, "comunidadeId": 2, "comunidadeNome": "Santa Luzia",
  "texto": "O igarapé não passa mais barco", "data": "2026-11-09T14:30:00Z",
  "indicador": "sem navegação", "antecedencia": "5 dias", "confianca": "alta" }
```
O app mostra `indicador`, `antecedencia` e `confianca` como "o que a IA entendeu". Se algum vier vazio, tudo bem.

## 11. `GET /relatos`

Devolve **só os relatos do usuário logado**, do mais novo ao mais antigo, no mesmo formato da resposta do item 10 (lista).

## 12. `PUT /relatos/{id}` · 13. `DELETE /relatos/{id}`

Só o dono do relato (ou `GESTOR`). Se não for o dono, `403`.

```json
// PUT, pedido
{ "texto": "Texto corrigido do relato" }
```

## 14. `POST /comunidades/{id}/plano` (Gestor, opcional)

Gera o plano priorizado de água, combustível e medicamentos (IA com RAG). O app ainda não chama este endpoint. Se for existir, diga o formato e nós ligamos o botão "Gerar plano" da fila.

```json
// Resposta sugerida
{ "necessidades": [ "água filtrada", "combustível" ],
  "justificativa": "Texto curto em linguagem simples." }
```

## O que precisamos de volta

- [ ] URL base da API e confirmação de que fica no ar durante a avaliação
- [ ] Usuários de teste: um `GESTOR` e um `MORADOR` (e-mail e senha)
- [ ] Confirmação ou correção de cada formato acima
- [ ] Se `GET /comunidades` funciona sem token
- [ ] CORS liberado
- [ ] Se existe série por dia para o slider de tempo (opcional): `GET /mapa/timeline?dias=30`, devolvendo para cada dia a lista do item 7. Hoje o app projeta localmente.
