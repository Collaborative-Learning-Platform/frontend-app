import { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  AvatarGroup,
  Chip,
  Fade,
  Tooltip,
  IconButton,
  useTheme,
  Button,
  Divider,
} from "@mui/material";
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Print as PrintIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
// import { Formatbar } from "../components/DocumentEditor/Toolbars/Formatbar";
import { Titlebar } from "../components/DocumentEditor/Toolbars/Titlebar";

interface Page {
  id: string;
  content: string;
}

export const DocumentEditor = () => {
  const theme = useTheme();
  const [pages, setPages] = useState<Page[]>([{ id: "1", content: "" }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const textAreaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalContent = pages
    .map((p) => p.content.replace(/<[^>]*>/g, ""))
    .join(" ");

  useEffect(() => {
    const words = totalContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(totalContent.length);
  }, [totalContent]);

  const handleContentChange = useCallback(
    (pageIndex: number, content: string) => {
      setPages((prev) =>
        prev.map((page, index) =>
          index === pageIndex ? { ...page, content } : page
        )
      );
      setIsTyping(true);

      // Auto page break - check if content exceeds page capacity
      const element = textAreaRefs.current[pageIndex];
      if (element) {
        const maxHeight = 550; // Fixed height for page content area (accounting for padding)

        if (element.scrollHeight > maxHeight) {
          // Get text content for splitting
          const textContent = element.textContent || "";
          const words = textContent.split(" ");
          let pageContent = "";
          let overflowContent = "";

          // Find the breaking point by testing text length
          for (let i = 0; i < words.length; i++) {
            const testText = words.slice(0, i + 1).join(" ");
            // Create temporary element to test height
            const tempDiv = document.createElement("div");
            tempDiv.style.cssText = window.getComputedStyle(element).cssText;
            tempDiv.style.height = "auto";
            tempDiv.style.position = "absolute";
            tempDiv.style.visibility = "hidden";
            tempDiv.textContent = testText;
            document.body.appendChild(tempDiv);

            if (tempDiv.scrollHeight > maxHeight) {
              pageContent = words.slice(0, i).join(" ").replace(/\n/g, "<br>");
              overflowContent = words.slice(i).join(" ").replace(/\n/g, "<br>");
              document.body.removeChild(tempDiv);
              break;
            }
            document.body.removeChild(tempDiv);
          }

          if (overflowContent) {
            setPages((prev) => {
              const newPages = [...prev];
              newPages[pageIndex] = {
                ...newPages[pageIndex],
                content: pageContent,
              };

              // Add new page with overflow content
              if (pageIndex === newPages.length - 1) {
                newPages.push({
                  id: Date.now().toString(),
                  content: overflowContent,
                });
              } else {
                newPages[pageIndex + 1] = {
                  ...newPages[pageIndex + 1],
                  content:
                    overflowContent + " " + newPages[pageIndex + 1].content,
                };
              }

              return newPages;
            });

            // Focus next page
            setTimeout(() => {
              if (textAreaRefs.current[pageIndex + 1]) {
                textAreaRefs.current[pageIndex + 1]?.focus();
                setCurrentPageIndex(pageIndex + 1);
              }
            }, 100);
          }
        }
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    },
    []
  );

  const addNewPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      content: "",
    };
    setPages((prev) => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const deletePage = (pageIndex: number) => {
    if (pages.length > 1) {
      setPages((prev) => prev.filter((_, index) => index !== pageIndex));
      if (currentPageIndex >= pageIndex && currentPageIndex > 0) {
        setCurrentPageIndex((prev) => prev - 1);
      }
    }
  };

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
        width: "100%",
      }}
    >
      {/* Enhanced Header */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 100 }}>
        <Titlebar />
        {/* <Formatbar /> */}
      </Box>

      {/* Document Container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          p: { xs: 2, md: 4 },
          pt: 3,
          overflow: "auto",
          maxHeight: "calc(100vh - 120px)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "10in" },
            position: "relative",
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
              py: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {wordCount} words • {characterCount} characters • {pages.length}{" "}
                pages
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
              <Tooltip title="Add new page">
                <IconButton size="small" onClick={addNewPage}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
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

          {/* Document Pages */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {pages.map((page, pageIndex) => (
              <Paper
                key={page.id}
                elevation={8}
                sx={{
                  position: "relative",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: { xs: 2, md: 3 },
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 10px 40px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)"
                      : "0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)",
                  border: `1px solid ${theme.palette.divider}`,
                  transform: { xs: "none", lg: `scale(${zoomLevel / 100})` },
                  transformOrigin: "top center",
                  transition: "transform 0.2s ease-in-out",
                  height: "950px",
                  width: "750px",
                  aspectRatio: "8.5 / 11",
                  margin: "0 auto",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.main} 100%)`,
                    opacity: isTyping && currentPageIndex === pageIndex ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                  },
                }}
              >
                {/* Page Delete Button */}
                {pages.length > 1 && (
                  <Tooltip title="Delete page">
                    <IconButton
                      size="small"
                      onClick={() => deletePage(pageIndex)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 10,
                        backgroundColor: theme.palette.error.main,
                        color: "white",
                        "&:hover": {
                          backgroundColor: theme.palette.error.dark,
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Document Content */}
                <Box
                  ref={(el: HTMLDivElement | null) => {
                    textAreaRefs.current[pageIndex] = el;
                  }}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const content = e.currentTarget.innerHTML || "";
                    handleContentChange(pageIndex, content);
                    setCurrentPageIndex(pageIndex);
                  }}
                  onFocus={() => setCurrentPageIndex(pageIndex)}
                  sx={{
                    width: "100%",
                    height: "650px",
                    border: "none",
                    outline: "none",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    fontSize: { xs: "14px", md: "16px" },
                    lineHeight: 1.6,
                    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
                    color: "text.primary",
                    backgroundColor: "transparent",
                    padding: {
                      xs: "16px",
                      sm: "24px",
                      md: "72px",
                    },
                    paddingTop:
                      pages.length > 1
                        ? "48px"
                        : { xs: "16px", sm: "24px", md: "72px" },
                    paddingBottom: "100px",
                    "&:empty::before": {
                      content:
                        pageIndex === 0
                          ? '"Type something amazing..."'
                          : '"Continue writing..."',
                      color: theme.palette.text.disabled,
                      fontStyle: "normal",
                      fontSize: { xs: "14px", md: "16px" },
                      fontWeight: 400,
                      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />

                {/* Page Footer */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    pointerEvents: "none",
                  }}
                >
                  {/* Footer divider line */}
                  <Box
                    sx={{
                      height: "1px",
                      backgroundColor: theme.palette.divider,
                      mx: "1in",
                      mb: 1,
                      opacity: 0.3,
                    }}
                  />

                  {/* Footer content */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: "1in",
                      pb: "24px",
                      opacity: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Document Editor
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Page {pageIndex + 1}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Page Management */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addNewPage}
              size="small"
            >
              Add Page
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Collaboration Status */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              pb: 2,
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
