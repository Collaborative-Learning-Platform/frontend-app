import type { Theme } from "@mui/material";

//Style Object for button groups
export const getButtonGroupStyles = (theme: Theme) => ({
  "& .MuiToggleButton-root, & .MuiButton-root": {
    minWidth: { xs: 33, md: 36, lg: 38, xl: 40 },
    height: { xs: 33, md: 36, lg: 38, xl: 40 },
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
      fontSize: { xs: "0.875rem", md: "1.25rem" },
    },
  },
  gap: 0.5,
});
