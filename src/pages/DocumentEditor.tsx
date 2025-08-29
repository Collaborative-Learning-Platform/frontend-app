import { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Avatar,
  AvatarGroup,
  Chip,
  Fade,
  Tooltip,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { Formatbar } from "../components/DocumentEditor/Formatbar";
import { Titlebar } from "../components/DocumentEditor/Titlebar";

export const DocumentEditor = () => {
  const theme = useTheme();
  const [documentContent, setDocumentContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const words = documentContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(documentContent.length);
  }, [documentContent]);

  const handleContentChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDocumentContent(event.target.value);
      setIsTyping(true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        backgroundImage:
          theme.palette.mode === "dark"
            ? `
            radial-gradient(circle at 25px 25px, rgba(255,255,255,0.02) 1px, transparent 0),
            radial-gradient(circle at 75px 75px, rgba(255,255,255,0.01) 1px, transparent 0)
          `
            : `
            radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0),
            radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 1px, transparent 0)
          `,
        backgroundSize: "100px 100px",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      {/* Enhanced Header */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 100 }}>
        <Titlebar />
        <Formatbar />
      </Box>

      {/* Document Container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          p: { xs: 2, md: 4 },
          pt: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "8.5in" },
            position: "relative",
            mx: "auto",
          }}
        >
          {/* Document Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              px: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {wordCount} words • {characterCount} characters
              </Typography>
              {isTyping && (
                <Fade in={isTyping}>
                  <Chip
                    size="small"
                    label="Typing..."
                    color="info"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem" }}
                  />
                </Fade>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {zoomLevel}%
              </Typography>
              <Tooltip title="Zoom out">
                <IconButton size="small" onClick={handleZoomOut}>
                  <ZoomOutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom in">
                <IconButton size="small" onClick={handleZoomIn}>
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton size="small">
                  <PrintIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Document Paper */}
          <Paper
            elevation={8}
            sx={{
              position: "relative",
              backgroundColor: theme.palette.background.paper,
              borderRadius: { xs: 2, md: 3 },
              overflow: "hidden",
              boxShadow:
                theme.palette.mode === "dark"
                  ? {
                      xs: "0 4px 20px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)",
                      md: "0 10px 40px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)",
                    }
                  : {
                      xs: "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
                      md: "0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)",
                    },
              border: `1px solid ${theme.palette.divider}`,
              transform: { xs: "none", lg: `scale(${zoomLevel / 100})` },
              transformOrigin: "top center",
              transition: "transform 0.2s ease-in-out",
              minHeight: {
                xs: "calc(100vh - 220px)",
                sm: "calc(100vh - 200px)",
                md: "11in",
              },
              width: {
                xs: "100%",
                sm: "100%",
                md: "8.5in",
                lg: "8.5in",
              },
              maxWidth: {
                xs: "100%",
                sm: "100%",
                md: "8.5in",
              },
              margin: "0 auto",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.main} 100%)`,
                opacity: isTyping ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              },
            }}
          >
            {/* Document Content */}
            <TextField
              multiline
              fullWidth
              value={documentContent}
              onChange={handleContentChange}
              placeholder="Type something amazing..."
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: { xs: "14px", md: "16px" },
                  lineHeight: 1.6,
                  fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
                  color: "text.primary",
                  padding: {
                    xs: "16px",
                    sm: "24px",
                    md: "1in",
                  },
                  minHeight: {
                    xs: "calc(100vh - 280px)",
                    sm: "calc(100vh - 260px)",
                    md: "9in",
                  },
                  display: "flex",
                  alignItems: "flex-start",
                  "& textarea": {
                    resize: "none",
                    verticalAlign: "top",
                    textAlign: "left",
                  },
                },
              }}
              sx={{
                height: "100%",
                "& .MuiInputBase-root": {
                  height: "100%",
                  alignItems: "flex-start",
                },
                "& .MuiInputBase-input": {
                  height: "100% !important",
                  "&::placeholder": {
                    color: theme.palette.text.disabled,
                    fontStyle: "normal",
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 400,
                    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
                  },
                },
              }}
            />

            {/* Page Footer */}
            <Box
              sx={{
                position: "absolute",
                bottom: 24,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: "1in",
                opacity: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Document Editor
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Page 1
              </Typography>
            </Box>
          </Paper>

          {/* Collaboration Status */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              1 person editing
            </Typography>
            <AvatarGroup
              max={5}
              sx={{
                "& .MuiAvatar-root": {
                  width: 24,
                  height: 24,
                  fontSize: "0.7rem",
                  border: `2px solid ${theme.palette.background.paper}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 2px 8px rgba(0,0,0,0.4)"
                      : "0 2px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>Y</Avatar>
            </AvatarGroup>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
