import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./theme";
import { AuthProvider } from "./contexts/Authcontext.tsx";
import { SnackbarProvider } from "./contexts/SnackbarContext.tsx";
import { GlobalSnackbar } from "./components/GlobalSnackbar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SnackbarProvider>
            <App />
            <GlobalSnackbar />
          </SnackbarProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
