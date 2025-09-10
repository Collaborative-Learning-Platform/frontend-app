import { createTheme } from "@mui/material/styles";



export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {

      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',

    },
    success: {
      main: '#10b981',
      dark: '#059669',
      light: '#34d399',
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    divider: "#e0e0e0",
    action: {
      hover: "rgba(240, 228, 228, 0.04)",
      selected: "rgba(0, 0, 0, 0.08)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {

      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1rem',

    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {

          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.12)',

          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,

          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',

          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 1,
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});
