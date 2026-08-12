import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme } from '@/theme';

export type ThemeMode = 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
};

const STORAGE_KEY = 'zerolab-theme';

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(
  undefined,
);

const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';

  let savedMode: string | null = null;
  try {
    savedMode = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable in privacy-restricted browsing contexts.
  }
  if (savedMode === 'light' || savedMode === 'dark') return savedMode;

  return 'dark';
};

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // The in-memory preference still works when storage is unavailable.
    }
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  }, []);

  const contextValue = useMemo(
    () => ({ mode, toggleMode }),
    [mode, toggleMode],
  );
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }

  return context;
}
