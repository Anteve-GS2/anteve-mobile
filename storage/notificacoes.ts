import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notificacao } from '@/types/notificacao';

const KEY = 'vazante.notificacoes';

export async function listarNotificacoes(): Promise<Notificacao[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Notificacao[]) : [];
}

async function salvar(items: Notificacao[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function criarNotificacao(input: Omit<Notificacao, 'id' | 'criadaEm' | 'lida'>) {
  const items = await listarNotificacoes();
  const item: Notificacao = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    criadaEm: new Date().toISOString(),
    lida: false,
  };
  await salvar([item, ...items].slice(0, 50));
  return item;
}

export async function marcarNotificacaoLida(id: string) {
  await salvar((await listarNotificacoes()).map((item) => (item.id === id ? { ...item, lida: true } : item)));
}

export async function marcarTodasNotificacoesLidas() {
  await salvar((await listarNotificacoes()).map((item) => ({ ...item, lida: true })));
}

export async function garantirNotificacaoInicial() {
  const items = await listarNotificacoes();
  if (items.length > 0) return;
  await criarNotificacao({
    titulo: 'Bem-vindo ao Vazante + Saberes',
    mensagem: 'Acompanhe o risco das comunidades e registre relatos mesmo quando estiver sem conexão.',
    tipo: 'info',
  });
}
