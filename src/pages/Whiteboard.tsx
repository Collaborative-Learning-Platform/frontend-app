import { Paper, Card, alpha } from "@mui/material";
import {
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  Fab,
  Stack,
  Box,
  Popover,
  IconButton,
} from "@mui/material";
import { Reply, LightMode, DarkMode, Close } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import Toolbar from "../components/Whiteboard/Toolbar";
import { useTheme } from "../theme";

export const Whiteboard = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedTool, setSelectedTool] = useState<String | null>(null);
  const [loggedInUsers, setLoggedInUsers] = useState<String[]>([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  // const [brushSize, setBrushSize] = useState(3);
  const brushSize = 3;
  const [isDrawing, setIsDrawing] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#A52A2A",
    "#808080",
    "#008000",
    "#000080",
    "#800000",
  ];

  useEffect(() => {
    // Initialize canvas
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth - 16;
      canvas.height = window.innerHeight - 16;

      const context = canvas.getContext("2d");
      if (context) {
        context.scale(1, 1);
        context.lineCap = "round";
        context.strokeStyle = selectedColor;
        context.lineWidth = brushSize;
        contextRef.current = context;
      }
    }

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
    setLoggedInUsers(["User2", "User3", "James", "Brandon"]);
    // fetchLoggedInUsers();
  }, [selectedColor]); //,brushSize

  const handleBackClick = () => {
    window.history.back();
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool !== "Draw") return;

    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (canvas && rect && contextRef.current) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (contextRef.current) {
      contextRef.current.closePath();
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool !== "Draw") return;

    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (canvas && rect && contextRef.current) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
    setShowColorPalette(false);
    setColorAnchorEl(null);
  };

  const handleSelectedTool = (
    event: React.MouseEvent<HTMLElement>,
    updatedSelectedTool: String
  ) => {
    if (updatedSelectedTool === "Clear") {
      clearCanvas();
      setSelectedTool("");
    } else if (updatedSelectedTool === "Color") {
      setColorAnchorEl(event.currentTarget);
      setShowColorPalette(true);
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
        cursor: "default",
      }}
      elevation={0}
    >
      {/* Canvas for drawing */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          cursor: selectedTool === "Draw" ? "crosshair" : "default",
          zIndex: 1,
        }}
      />

      {/* Color Palette Popover */}
      <Popover
        open={showColorPalette}
        anchorEl={colorAnchorEl}
        onClose={() => {
          setShowColorPalette(false);
          setColorAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle2" sx={{ mr: 1 }}>
              Choose Color
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                setShowColorPalette(false);
                setColorAnchorEl(null);
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
              width: 200,
            }}
          >
            {colors.map((color) => (
              <Box
                key={color}
                onClick={() => handleColorSelect(color)}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: color,
                  borderRadius: 1,
                  cursor: "pointer",
                  border:
                    selectedColor === color
                      ? "3px solid #000"
                      : "1px solid #ccc",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              />
            ))}
          </Box>
        </Box>
      </Popover>
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
          zIndex: 10,
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
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        gap={2}
        sx={{
          position: "absolute",
          bottom: theme.spacing(2),
          right: theme.spacing(2),
          zIndex: 10,
        }}
      >
        <Fab
          size="small"
          aria-label="Go back"
          color="primary"
          onClick={handleBackClick}
        >
          <Reply />
        </Fab>
        <Fab
          size="small"
          aria-label="Toggle theme"
          color="primary"
          onClick={toggleTheme}
        >
          {theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />}
        </Fab>
      </Stack>

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
          zIndex: 10,
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
          zIndex: 10,
        }}
      >
        {theme.palette.mode === "dark" ? "Blackboard" : "Whiteboard"}
      </Typography>
    </Paper>
  );
};
