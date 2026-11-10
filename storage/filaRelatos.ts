import AsyncStorage from '@react-native-async-storage/async-storage';
import { NovoRelato, RelatoFila } from '@/types/relato';

const KEY = 'vazante.filaRelatos';

export async function lerFila(): Promise<RelatoFila[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as RelatoFila[]) : [];
}

async function salvar(fila: RelatoFila[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(fila));
}

export async function enfileirar(novo: NovoRelato) {
  const fila = await lerFila();
  fila.push({ ...novo, localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, criadoEm: new Date().toISOString() });
  await salvar(fila);
}

export async function removerDaFila(localId: string) {
  await salvar((await lerFila()).filter((r) => r.localId !== localId));
}