import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#42a5f5", // Learni Light Blue for dark theme
      light: "#80d6ff", // Learni Lighter Blue
      dark: "#1976d2", // Learni Primary Blue
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#5e92f3", // Learni Light Secondary for dark theme
      light: "#90c6ff", // Learni Lighter Secondary
      dark: "#1565c0", // Learni Secondary Blue
      contrastText: "#ffffff",
    },
    success: {
      main: "#34d399",
      dark: "#10b981",
      light: "#6ee7b7",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#4a4a4a", // Disabled background for dark theme
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },

    background: {
      default: "#0f0f0f", // Deeper black for contrast
      paper: "#1a1a1a", // Slightly lighter for cards/surfaces
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#b0b0b0",
      disabled: "rgba(255, 255, 255, 0.38)",
    },
    divider: "#2d2d2d",
    action: {
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.12)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem", lineHeight: 1.2 },
    h2: { fontWeight: 600, fontSize: "2rem", lineHeight: 1.25 },
    h3: { fontWeight: 600, fontSize: "1.75rem", lineHeight: 1.3 },
    h4: { fontWeight: 700, fontSize: "1.5rem", lineHeight: 1.35 },
    h5: { fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.4 },
    h6: { fontWeight: 700, fontSize: "1rem", lineHeight: 1.45 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.43 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600,
          padding: "8px 16px",
          boxShadow: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
            backgroundColor: "rgba(255,255,255,0.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,

          backgroundColor: "#1a1a1a",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212",
          boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 1,
          backgroundImage: "none",
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});
