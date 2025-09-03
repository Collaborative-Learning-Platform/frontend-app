import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useTheme } from "../theme";

interface BackButtonProps {
  size?: "small" | "medium" | "large";
  showTooltip?: boolean;
  variant?: "default" | "contained" | "outlined";
}

export const BackButton: React.FC<BackButtonProps> = ({
  size = "medium",
  showTooltip = true,
  variant = "default",
}) => {
  const theme = useTheme();

  const getBackgroundSx = () => {
    if (variant === "contained") {
      return {
        backgroundColor:
          theme.mode === "light" ? "primary.main" : "secondary.main",
        color:
          theme.mode === "light"
            ? "primary.contrastText"
            : "secondary.contrastText",
        "&:hover": {
          backgroundColor:
            theme.mode === "light" ? "primary.dark" : "secondary.dark",
        },
      };
    }
    if (variant === "outlined") {
      return {
        border: "1px solid",
        borderColor: theme.mode === "light" ? "primary.main" : "secondary.main",
        color: theme.mode === "light" ? "primary.main" : "secondary.main",
        "&:hover": {
          backgroundColor:
            theme.mode === "light" ? "primary.light" : "secondary.light",
          opacity: 0.1,
        },
      };
    }
    return {
      color: theme.mode === "light" ? "text.primary" : "text.primary",
      "&:hover": {
        backgroundColor: "action.hover",
      },
    };
  };

  const handleBackClick = () => {
    setTimeout(() => {
      window.history.back();
    }, 1000);
  };

  const backButton = (
    <IconButton
      onClick={handleBackClick}
      size={size}
      aria-label="Go-back"
      sx={{
        transition: "all 0.3s ease-in-out",
        ...getBackgroundSx(),
        "&:hover": {
          transform: "scale(1.05)",
          ...getBackgroundSx()["&:hover"],
        },
        "& .MuiSvgIcon-root": {
          fontSize:
            size === "small"
              ? "1.25rem"
              : size === "large"
              ? "1.75rem"
              : "1.5rem",
        },
      }}
    >
      <ArrowBack />
    </IconButton>
  );

  if (showTooltip) {
    return <Tooltip title="Go back">{backButton}</Tooltip>;
  }
  return backButton;
};
