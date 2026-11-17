import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, darkColors, ThemeColors } from '@/constants/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  dark: boolean;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
}

const KEY = 'vazante.theme';
const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (saved === 'dark' || saved === 'light') setMode(saved);
    });
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    await AsyncStorage.setItem(KEY, next);
  }, [mode]);

  const value = useMemo(() => ({
    dark: mode === 'dark',
    colors: mode === 'dark' ? darkColors : colors,
    toggleTheme,
  }), [mode, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return context;
}
