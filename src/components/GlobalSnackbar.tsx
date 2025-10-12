import React from "react";
import { Snackbar, Alert, useTheme } from "@mui/material";
import { useSnackbar } from "../contexts/SnackbarContext";

export const GlobalSnackbar: React.FC = () => {
  const { snackbarState, hideSnackbar } = useSnackbar();
  const theme = useTheme();

  // Define theme-aware background colors for each severity
  const getSeverityStyles = (severity: string) => {
    const isDark = theme.palette.mode === "dark";

    switch (severity) {
      case "success":
        return {
          backgroundColor: isDark ? "#0f2419" : "#f0fdf4", // Dark: solid dark green, Light: pale green
          borderColor: theme.palette.success.main,
        };
      case "error":
        return {
          backgroundColor: isDark ? "#2d1b1b" : "#fef2f2", // Dark: solid dark red, Light: pale red
          borderColor: theme.palette.error.main,
        };
      case "warning":
        return {
          backgroundColor: isDark ? "#2d2411" : "#fffbeb", // Dark: solid dark orange, Light: pale orange
          borderColor: theme.palette.warning.main,
        };
      case "info":
        return {
          backgroundColor: isDark ? "#1e2a3a" : "#eff6ff", // Dark: solid dark blue, Light: pale blue
          borderColor: theme.palette.info.main,
        };
      default:
        return {
          backgroundColor: isDark ? "#0f2419" : "#f0fdf4",
          borderColor: theme.palette.success.main,
        };
    }
  };

  const severityStyles = getSeverityStyles(snackbarState.severity);

  return (
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={4000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={hideSnackbar}
        severity={snackbarState.severity}
        variant="outlined"
        sx={{
          width: "100%",
          backgroundColor: severityStyles.backgroundColor,
          borderColor: severityStyles.borderColor,
          borderWidth: "2px",
          "& .MuiAlert-icon": {
            color: severityStyles.borderColor,
          },
        }}
      >
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
};
