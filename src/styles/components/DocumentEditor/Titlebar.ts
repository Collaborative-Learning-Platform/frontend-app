import type { Theme } from "@mui/material";

export const getAppBarStyling = (theme: Theme) => ({
  width: "100%",
  background:
    theme.palette.mode === "dark"
      ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
      : `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)`,
  backdropFilter: "blur(20px)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
});

export const getDocNameWrapper = (theme: Theme) => ({
  display: "flex",
  alignItems: "center",
  gap: { xs: 0.5, sm: 1, md: 1.5 },
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
  borderRadius: { xs: 2, md: 3 },
  px: { xs: 1, sm: 1.5, md: 2 },
  py: { xs: 0.5, md: 1 },
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? `0 2px 12px rgba(0,0,0,0.3)`
      : `0 2px 12px rgba(0,0,0,0.04)`,
  flex: 1,
  minWidth: 0,
  maxWidth: { xs: "100%", sm: 300, md: 400, lg: 500 },
});

export const toolBarStyles = {
  minHeight: { xs: 56, sm: 64, md: 72 },
  px: { xs: 1, sm: 2, md: 3 },
  py: { xs: 0.5, sm: 1 },
};

export const responsiveLayoutWrapper = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: { xs: "row" },
  gap: { xs: 0.5, sm: 1, md: 2 },
};

export const documentInfoWrapper = {
  display: "flex",
  alignItems: "center",
  gap: { xs: 0.5, sm: 1, md: 2 },
  flex: { md: "none" },
  flexShrink: 1,
  flexGrow: 0,
};

export const customAnimations = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  @media (max-width: 600px) {
    .MuiAppBar-root .MuiToolbar-root {
      min-height: 56px !important;
    }
  }

  @media (max-width: 400px) {
    .MuiAppBar-root .MuiToolbar-root {
      padding-left: 8px !important;
      padding-right: 8px !important;
    }
  }

  /* Ensure proper text overflow handling on mobile */
  @media (max-width: 480px) {
    .MuiTextField-root .MuiInputBase-input {
      text-overflow: ellipsis;
    }
  }
`;

export const docNameInputProps = {
  fontSize: { xs: "0.875rem", sm: "1rem" },
  color: "text.primary",
  width: "100%",
  minWidth: 0,
};

export const textFieldWrapper = {
  flex: 1,
  minWidth: 0,
  "& .MuiInputBase-input": {
    padding: { xs: "2px 0", md: "4px 0" },
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
};

export const getSaveStatusWrapper = (isSaving: boolean) => ({
  display: { xs: "none", lg: "flex" },
  alignItems: "center",
  gap: 1,
  backgroundColor: isSaving ? "background.paper" : "background.paper",
  borderRadius: 3,
  px: 2,
  py: 1,
  border: `1px solid ${
    isSaving ? "rgba(33, 150, 243, 0.2)" : "rgba(76, 175, 80, 0.2)"
  }`,
  transition: "all 0.3s ease-in-out",
  minWidth: 120,
  justifyContent: "center",
});
export const getShareButtonStyles = (theme: Theme) => ({
  borderRadius: { xs: 2, md: 3 },
  textTransform: "none",
  fontSize: { xs: "0.75rem", md: "0.875rem" },
  px: { xs: 1, md: 2 },
  py: { xs: 0.5, md: 1 },
  minWidth: { xs: 80, sm: 90, md: 100 },
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: "primary.main",
    color: "primary.main",
  },
});

export const getSaveButtonStyles = (theme: Theme) => ({
  borderRadius: { xs: 2, md: 3 },
  textTransform: "none",
  fontSize: { xs: "0.75rem", md: "0.875rem" },
  px: { xs: 1, md: 2 },
  py: { xs: 0.5, md: 1 },
  minWidth: { xs: 80, sm: 90, md: 100 },
  background:
    theme.palette.mode === "dark"
      ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
      : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
  boxShadow: `0 2px 8px ${theme.palette.primary.main}40`,
  "&:hover": {
    background:
      theme.palette.mode === "dark"
        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
        : "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
    boxShadow: `0 4px 12px ${theme.palette.primary.main}66`,
  },
});

export const syncIconStyles = {
  fontSize: 16,
  color: "info.main",
  animation: "spin 1s linear infinite",
};

export const actionsAndCollaborators = {
  display: "flex",
  alignItems: "center",
  gap: { xs: 0.75, sm: 1, md: 2 },
  flexShrink: 0,
};

export const actionStyles = {
  display: { xs: "flex", sm: "flex" },
  gap: { xs: 1, sm: 1, md: 2 },
};

export const shareIconStyles = { fontSize: { xs: 16, md: 18 } };

export const getCollaboratorsBoxStyles = (theme: Theme) => ({
  display: { xs: "none", md: "flex", sm: "flex" },
  alignItems: "center",
  gap: { xs: 0.5, md: 1.5 },
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
  borderRadius: { xs: 2, md: 3 },
  px: { xs: 1, md: 2 },
  py: { xs: 0.5, md: 1 },
  border: `1px solid ${theme.palette.divider}`,
});

export const getAvatarGroupStyles = (theme: Theme) => ({
  "& .MuiAvatar-root": {
    width: { xs: 24, sm: 28, md: 32 },
    height: { xs: 24, sm: 28, md: 32 },
    fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
    fontWeight: 600,
    border: `2px solid ${theme.palette.background.paper}`,
    boxShadow:
      theme.palette.mode === "dark"
        ? `0 2px 8px rgba(0,0,0,0.4)`
        : `0 2px 8px rgba(0,0,0,0.1)`,
  },
});

export const getAvatarStyles = (index: number, theme: Theme) => ({
  background: `linear-gradient(135deg, ${
    [
      theme.palette.error.main,
      theme.palette.info.main,
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ][index % 5]
  }, ${
    [
      theme.palette.error.light,
      theme.palette.info.light,
      theme.palette.primary.light,
      theme.palette.success.light,
      theme.palette.warning.light,
    ][index % 5]
  })`,
  animation: "pulse 2s infinite",
});

export const getMoreOptionsButtonStyles = (theme: Theme) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",

  width: { xs: 32, sm: 36, md: 40 },
  height: { xs: 32, sm: 36, md: 40 },
  display: { xs: "flex", sm: "flex", md: "none" },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
});

export const getMoreVertIconStyle = (theme: Theme) => ({
  color: theme.palette.text.primary,
});

export const getMobileMenuTheme = (theme: Theme) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    minWidth: 200,
  },
});
