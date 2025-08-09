import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6', // Vibrant sky blue
      light: '#90caf9',
      dark: '#42a5f5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff80ab', // Brighter pink
      light: '#ffb2dd',
      dark: '#f06292',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f0f0f', // Deeper black for contrast
      paper: '#1a1a1a',   // Slightly lighter for cards/surfaces
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#b0b0b0',
    },
    divider: '#2d2d2d',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.12)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 500, fontSize: '1.5rem' },
    h5: { fontWeight: 500, fontSize: '1.25rem' },
    h6: { fontWeight: 500, fontSize: '1rem' },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.43 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(255,255,255,0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1a1a1a',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
        },
      },
    },

  },
  shape: {
    borderRadius: 8,
  },
});
