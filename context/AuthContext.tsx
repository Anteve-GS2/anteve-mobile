import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { setUnauthorizedHandler } from '@/services/api';
import { login } from '@/services/auth';
import { setDemo } from '@/services/demo';
import { clearSession, getToken, getUser, saveSession } from '@/storage/session';
import { User } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(async () => {
    setDemo(false);
    await clearSession();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    (async () => {
      const savedToken = await getToken();
      const savedUser = await getUser();
      if (savedToken && savedUser) {
        setDemo(savedToken === 'demo');
        setToken(savedToken);
        setUser(savedUser);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const signIn = useCallback(async (email: string, senha: string) => {
    const data = await login(email, senha);
    const nextUser: User = { nome: data.nome, papel: data.papel };
    setDemo(false);
    await saveSession(data.token, nextUser);
    setToken(data.token);
    setUser(nextUser);
  }, []);

  const signInDemo = useCallback(async () => {
    const demoUser: User = { nome: 'Gestor (demonstração)', papel: 'GESTOR' };
    setDemo(true);
    await saveSession('demo', demoUser);
    setToken('demo');
    setUser(demoUser);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, signIn, signInDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}