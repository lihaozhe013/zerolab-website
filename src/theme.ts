import { createTheme } from '@mui/material/styles';
import type { ThemeMode } from '@/ThemeModeProvider';

export const createAppTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#08b4ce',
        contrastText: '#071013',
      },
      background: {
        default: mode === 'dark' ? '#07090c' : '#f3f7f8',
        paper: mode === 'dark' ? '#111419' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f2f8f9' : '#10191c',
        secondary: mode === 'dark' ? '#9ba5a8' : '#536166',
      },
    },
    typography: {
      fontFamily: '"Avenir Next", "Noto Sans SC", sans-serif',
      h1: {
        fontWeight: 600,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 800,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none' as const,
            borderRadius: 0,
          },
        },
      },
    },
  });
