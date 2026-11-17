import AsyncStorage from '@react-native-async-storage/async-storage';
import { NovoRelato, RelatoFila } from '@/types/relato';

const KEY = 'vazante.filaRelatos';
let mutation: Promise<void> = Promise.resolve();

export async function lerFila(): Promise<RelatoFila[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as RelatoFila[]) : [];
}

async function salvar(fila: RelatoFila[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(fila));
}

function serializar<T>(operation: () => Promise<T>): Promise<T> {
  const next = mutation.then(operation, operation);
  mutation = next.then(() => undefined, () => undefined);
  return next;
}

export function enfileirar(novo: NovoRelato) {
  return serializar(async () => {
    const fila = await lerFila();
    const localId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    fila.push({ ...novo, localId, criadoEm: new Date().toISOString() });
    await salvar(fila);
    return localId;
  });
}

export function removerDaFila(localId: string) {
  return serializar(async () => {
    await salvar((await lerFila()).filter((r) => r.localId !== localId));
  });
}