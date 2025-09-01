import ChatIcon from "@mui/icons-material/Chat";
import React from "react";
import { IconButton, Tooltip, Badge } from "@mui/material";
import { useTheme } from "../theme";

interface ChatsProps {
  size?: "small" | "medium" | "large";
  showTooltip?: boolean;
  variant?: "default" | "contained" | "outlined";
  badgeContent?: number;
  onClick?: () => void;
}

export const Chats: React.FC<ChatsProps> = ({
  size = "medium",
  showTooltip = true,
  variant = "default",
  badgeContent = 0,
  onClick,
}) => {
  const { mode } = useTheme();

  const getBackgroundSx = () => {
    if (variant === "contained") {
      return {
        backgroundColor: mode === "light" ? "primary.main" : "secondary.main",
        color:
          mode === "light" ? "primary.contrastText" : "secondary.contrastText",
        "&:hover": {
          backgroundColor: mode === "light" ? "primary.dark" : "secondary.dark",
        },
      };
    }
    if (variant === "outlined") {
      return {
        border: "1px solid",
        borderColor: mode === "light" ? "primary.main" : "secondary.main",
        color: mode === "light" ? "primary.main" : "secondary.main",
        "&:hover": {
          backgroundColor:
            mode === "light" ? "primary.light" : "secondary.light",
          opacity: 0.1,
        },
      };
    }
    return {
      color: mode === "light" ? "text.primary" : "text.primary",
      "&:hover": {
        backgroundColor: "action.hover",
      },
    };
  };

  const chatsButton = (
    <IconButton
      onClick={onClick}
      size={size}
      aria-label="SeeChats"
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
      <Badge badgeContent={badgeContent} color="error" variant="dot">
        <ChatIcon />
      </Badge>
    </IconButton>
  );

  if (showTooltip) {
    return <Tooltip title="Chats">{chatsButton}</Tooltip>;
  }
  return chatsButton;
};
