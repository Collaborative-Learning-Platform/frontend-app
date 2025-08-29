import { Paper, Card, useTheme, alpha } from "@mui/material";
import {
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  IconButton,
  Badge,
  Fab,
  Collapse,
  Stack,
  ClickAwayListener,
} from "@mui/material";
import {
  Search,
  Notifications,
  ArrowBack,
  KeyboardArrowDown,
  KeyboardArrowUp,
  LightMode,
  DarkMode,
} from "@mui/icons-material";

import { useState, useEffect } from "react";
import Toolbar from "../components/Whiteboard/Toolbar";
import { useTheme as useCustomTheme } from "../contexts/ThemeContext";

export const Whiteboard = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useCustomTheme();
  const [selectedTool, setSelectedTool] = useState<String | null>(null);
  const [loggedInUsers, setLoggedInUsers] = useState<String[]>([]);
  const [miniAppBarOpen, setMiniAppBarOpen] = useState(false);

  useEffect(() => {
    // // Fetch logged in users from backend
    // const fetchLoggedInUsers = async () => {
    //   try {
    //     // Replace with your actual API endpoint
    //     const response = await fetch("/api/logged-in-users");
    //     const users = await response.json();
    //     setLoggedInUsers(users);
    //   } catch (error) {
    //     console.error("Failed to fetch logged in users:", error);
    //     // Mock data for demo

    //   }
    // };
    setLoggedInUsers(["User2", "User3"]);
    // fetchLoggedInUsers();
  }, []);

  const handleBackClick = () => {
    // Navigate back to previous page
    window.history.back();
  };

  const handleSelectedTool = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedTool: String
  ) => {
    if (updatedSelectedTool === "Clear") {
      // Clear the board logic here
      //console.log("Board cleared");
      setSelectedTool("");
    } else {
      // For all other tools, set them as selected
      setSelectedTool(updatedSelectedTool);
    }
  };
  return (
    <Paper
      sx={{
        backgroundColor:
          theme.palette.mode === "dark" ? "#1a1a1a" : theme.palette.grey[50],
        backgroundImage:
          theme.palette.mode === "dark"
            ? `radial-gradient(${theme.palette.grey[700]} 1px, transparent 1px)`
            : `radial-gradient(${theme.palette.grey[300]} 1px, transparent 1px)`,
        backgroundSize: `${theme.spacing(2.5)} ${theme.spacing(2.5)}`,
        position: "fixed",
        top: theme.spacing(1),
        left: theme.spacing(1),
        width: `calc(100vw - ${theme.spacing(2)})`,
        height: `calc(100vh - ${theme.spacing(2)})`,
        padding: 0,
        margin: 0,
        borderRadius: "5",
        boxSizing: "border-box",
        overflow: "hidden",
        boxShadow: theme.shadows[8],
        cursor:
          selectedTool === "Draw"
            ? "crosshair"
            : selectedTool === "Text"
            ? "text"
            : selectedTool === "Clear"
            ? "not-allowed"
            : "default",
      }}
      elevation={0}
    >
      {/* Header with branding and users */}
      <Card
        sx={{
          position: "absolute",
          top: theme.spacing(2),
          right: theme.spacing(2),
          width: "fit-content",
          backgroundColor: theme.palette.background.paper,
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <CardContent
          sx={{
            padding: theme.spacing(2),
            "&:last-child": { paddingBottom: theme.spacing(2) },
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: theme.spacing(1), display: "block" }}
          >
            Collaborators Online
          </Typography>
          <AvatarGroup
            max={4}
            sx={{
              "& .MuiAvatar-root": {
                border: `2px solid ${theme.palette.background.paper}`,
              },
            }}
          >
            {loggedInUsers.map((user, index) => (
              <Avatar
                key={index}
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: theme.typography.caption.fontSize,
                  fontWeight: theme.typography.fontWeightMedium,
                  background: `linear-gradient(45deg, ${
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
                }}
              >
                {user.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
        </CardContent>
      </Card>

      {/* Floating Action Button for Mini AppBar */}
      <ClickAwayListener onClickAway={() => setMiniAppBarOpen(false)}>
        <div>
          <Fab
            size="small"
            sx={{
              position: "absolute",
              top: theme.spacing(15),
              right: theme.spacing(2),
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              transition: "all 0.3s ease-in-out",
            }}
            onClick={() => setMiniAppBarOpen(!miniAppBarOpen)}
          >
            {miniAppBarOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </Fab>

          {/* Collapsible Mini AppBar */}
          <Collapse in={miniAppBarOpen} timeout={400}>
            <Card
              sx={{
                position: "absolute",
                top: theme.spacing(20),
                right: theme.spacing(1.5),
                width: "auto",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.grey[900], 0.95)
                    : alpha(theme.palette.background.paper, 0.95),
                backdropFilter: "blur(10px)",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 20px rgba(255, 255, 255, 0.1)"
                    : theme.shadows[8],
              }}
              elevation={0}
            >
              <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Stack direction="column" spacing={0.5}>
                  <IconButton
                    size="small"
                    sx={{ color: theme.palette.text.primary }}
                    onClick={() => {
                      handleBackClick();
                      setMiniAppBarOpen(false);
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: theme.palette.text.primary }}
                    onClick={() => setMiniAppBarOpen(false)}
                  >
                    <Search />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: theme.palette.text.primary }}
                    onClick={() => setMiniAppBarOpen(false)}
                  >
                    <Badge badgeContent={3} color="error" variant="dot">
                      <Notifications />
                    </Badge>
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: theme.palette.text.primary }}
                    onClick={() => {
                      toggleTheme();
                      setMiniAppBarOpen(false);
                    }}
                  >
                    {mode === "dark" ? <LightMode /> : <DarkMode />}
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Collapse>
        </div>
      </ClickAwayListener>

      {/* Enhanced toolbar */}
      <Card
        sx={{
          width: "fit-content",
          position: "absolute",
          bottom: theme.spacing(3),
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.grey[900], 0.95)
              : alpha(theme.palette.background.paper, 0.95),
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          boxShadow: theme.palette.mode === "dark" ? "none" : theme.shadows[8],
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(255, 255, 255, 0.1)"
                : theme.shadows[12],
          },
        }}
        elevation={0}
      >
        <CardContent sx={{ padding: 1, "&:last-child": { paddingBottom: 1 } }}>
          <Toolbar
            selectedTool={selectedTool}
            onToolChange={handleSelectedTool}
          />
        </CardContent>
      </Card>

      {/* Watermark/Brand */}
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: theme.spacing(3),
          left: theme.spacing(3),
          color:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : theme.palette.action.disabled,
          fontWeight: theme.typography.fontWeightLight,
          letterSpacing: theme.spacing(0.125),
          userSelect: "none",
        }}
      >
        {theme.palette.mode === "dark" ? "Blackboard" : "Whiteboard"}
      </Typography>
    </Paper>
  );
};
