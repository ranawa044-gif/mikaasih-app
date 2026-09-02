// =====================================================
// MIKAASIH — useTheme Hook
// Theme Management (Light ☀️ / Dark 🌙)
// Sinkron dengan localStorage dan system preference
// =====================================================

import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // 1. Cek penyimpanan lokal
    try {
      const saved = localStorage.getItem('mikaasih_theme') as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') return saved;
      // 2. Cek preferensi sistem
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('mikaasih_theme', theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' };
}
