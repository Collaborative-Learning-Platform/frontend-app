import type { Theme } from "@mui/material";

//Style Object for button groups
export const getButtonGroupStyles = (theme: Theme) => ({
  "& .MuiToggleButton-root, & .MuiButton-root": {
    minWidth: 40,
    height: 36,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    color: theme.palette.text.secondary,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(0,0,0,0.2)"
        : "rgba(255,255,255,0.8)",
    backdropFilter: "blur(8px)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      borderColor: "primary.main",
      color: "primary.main",
      transform: "translateY(-1px)",
      boxShadow:
        theme.palette.mode === "dark"
          ? `0 2px 8px rgba(0,0,0,0.4)`
          : `0 2px 8px rgba(0,0,0,0.1)`,
    },
    "&.Mui-selected": {
      backgroundColor: "primary.main",
      color: theme.palette.primary.contrastText,
      borderColor: "primary.main",
      boxShadow:
        theme.palette.mode === "dark"
          ? `0 2px 8px rgba(0,0,0,0.5)`
          : `0 2px 8px rgba(0,0,0,0.15)`,
      "&:hover": {
        backgroundColor: "primary.dark",
        color: theme.palette.primary.contrastText,
      },
    },
    "& .MuiSvgIcon-root": {
      fontSize: 18,
    },
  },
  gap: 0.5,
});

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

export const toolBarStyles = { minHeight: 56, px: 3, py: 1 };

export const responsiveLayoutWrapper = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: { xs: 1, sm: 2 },
  flexWrap: { xs: "wrap", lg: "nowrap" },
  justifyContent: { xs: "flex-start", lg: "space-between" },
};

export const buttonGroupWrapper = {
  display: "flex",
  alignItems: "center",
  gap: 2,
};

export const getMoreIconStyles = (theme: Theme) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
  width: 36,
  height: 36,
  display: { xs: "flex", md: "none" },
  transition: "all 0.2s ease-in-out",
  "& .MuiSvgIcon-root": {
    transition: "all 0.2s ease-in-out",
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
});

export const getMiniAppBarCardStyles = (theme: Theme) => ({
  position: "absolute",
  top: 45,
  right: 0,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(0,0,0,0.95)"
      : "rgba(255,255,255,0.95)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 2,
  zIndex: 999,
  maxWidth: 300,
  p: 2,
});

export const desktopToolsWrapper = {
  display: { xs: "none", md: "flex" },
  alignItems: "center",
  gap: 2,
};
