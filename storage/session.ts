// storage/session.ts
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types/auth';

const TOKEN_KEY = 'vazante.token';
const USER_KEY = 'vazante.user';

const isWeb = Platform.OS === 'web';

async function getItem(key: string): Promise<string | null> {
  if (isWeb) return localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string): Promise<void> {
  if (isWeb) {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function getToken() {
  return getItem(TOKEN_KEY);
}

export async function getUser(): Promise<User | null> {
  const raw = await getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function saveSession(token: string, user: User) {
  await setItem(TOKEN_KEY, token);
  await setItem(USER_KEY, JSON.stringify(user));
}

export async function clearSession() {
  await removeItem(TOKEN_KEY);
  await removeItem(USER_KEY);
}