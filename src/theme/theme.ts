import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: {
      chat: string;
      whiteboard: string;
      editor: string;
      quiz: string;
      resources: string;
    };
  }

  interface PaletteOptions {
    accent?: {
      chat?: string;
      whiteboard?: string;
      editor?: string;
      quiz?: string;
      resources?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      dark: '#4f46e5',
      light: '#818cf8',
    },
    secondary: {
      main: '#8b5cf6',
      dark: '#7c3aed',
      light: '#a78bfa',
    },
    success: {
      main: '#10b981',
      dark: '#059669',
      light: '#34d399',
    },
    accent: {
      chat: '#10b981',
      whiteboard: '#3b82f6',
      editor: '#f59e0b',
      quiz: '#8b5cf6',
      resources: '#ef4444',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;