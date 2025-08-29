import { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  TextField,
  Typography,
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  Fade,
  Stack,
  Badge,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Share as ShareIcon,
  Save as SaveIcon,
  CloudDone as CloudDoneIcon,
  Sync as SyncIcon,
  MoreVert as MoreVertIcon,
  InsertDriveFile as DocumentIcon,
  Search,
  Notifications,
  LightMode,
  DarkMode,
  ArrowBack,
} from "@mui/icons-material";
import { ThemeToggle, useTheme as useAppTheme } from "../../theme";

export const Titlebar = () => {
  const theme = useTheme();
  const { toggleTheme } = useAppTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loggedInUsers, setLoggedInUsers] = useState<string[]>([]);
  const [documentName, setDocumentName] = useState<string>("Untitled Document");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBackClick = () => {
    // Navigate back to previous page or documents list
    window.history.back();
  };

  const handleThemeToggle = () => {
    toggleTheme();
    handleMenuClose();
  };

  const handleDocumentNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDocumentName(event.target.value);
    // Simulate auto-save trigger
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1500);
  };

  useEffect(() => {
    // Fetch logged in users from backend
    const fetchLoggedInUsers = async () => {
      // Mock data for demo
      setLoggedInUsers(["Sarah", "Mike", "Alex", "Emma"]);
    };

    fetchLoggedInUsers();
  }, []);

  return (
    <Box sx={{ width: "100%", flexGrow: 1, padding: 0 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          width: "100%",
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
              : `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ minHeight: 72, px: 3 }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Left Section - Document Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(255,255,255,0.8)",
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 2px 12px rgba(0,0,0,0.3)`
                      : `0 2px 12px rgba(0,0,0,0.04)`,
                }}
              >
                <DocumentIcon sx={{ color: "primary.main", fontSize: 20 }} />
                <TextField
                  value={documentName}
                  onChange={handleDocumentNameChange}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontSize: "1rem",
                      color: "text.primary",
                      width: { xs: 140, sm: 200, md: 280 },
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "4px 0",
                      "&:focus": {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                />
              </Box>

              {/* Save Status */}
              <Box
                sx={{
                  display: { xs: "none", lg: "flex" },
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: isSaving
                    ? "rgba(33, 150, 243, 0.08)"
                    : "rgba(76, 175, 80, 0.08)",
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  border: `1px solid ${
                    isSaving
                      ? "rgba(33, 150, 243, 0.2)"
                      : "rgba(76, 175, 80, 0.2)"
                  }`,
                  transition: "all 0.3s ease-in-out",
                  minWidth: 120,
                  justifyContent: "center",
                }}
              >
                <Fade in={!isSaving}>
                  <CloudDoneIcon sx={{ fontSize: 16, color: "success.main" }} />
                </Fade>
                <Fade in={isSaving}>
                  <SyncIcon
                    sx={{
                      fontSize: 16,
                      color: "info.main",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                </Fade>
                <Typography
                  variant="caption"
                  color={isSaving ? "info.main" : "success.main"}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  {isSaving
                    ? "Saving..."
                    : `Saved ${lastSaved.toLocaleTimeString()}`}
                </Typography>
              </Box>
            </Box>

            {/* Right Section - Actions & Collaborators */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShareIcon />}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0,0,0,0.2)"
                        : "rgba(255,255,255,0.8)",
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      borderColor: "primary.main",
                    },
                  }}
                >
                  Share
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon />}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
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
                  }}
                >
                  Save
                </Button>
              </Box>

              {/* Collaborators */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(255,255,255,0.8)",
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {loggedInUsers.length} online
                </Typography>
                <AvatarGroup
                  max={3}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      border: `2px solid ${theme.palette.background.paper}`,
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? `0 2px 8px rgba(0,0,0,0.4)`
                          : `0 2px 8px rgba(0,0,0,0.1)`,
                    },
                  }}
                >
                  {loggedInUsers.map((user, index) => (
                    <Tooltip key={index} title={`${user} (online)`}>
                      <Avatar
                        sx={{
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
                        }}
                      >
                        {user.charAt(0)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </Box>

              {/* More Options - Only visible on mobile */}
              {isMobile && (
                <Tooltip title="More options">
                  <IconButton
                    size="small"
                    onClick={handleMenuClick}
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(0,0,0,0.2)"
                          : "rgba(255,255,255,0.8)",
                      border: `1px solid ${theme.palette.divider}`,
                      width: 40,
                      height: 40,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {/* Menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 180,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 8px 32px rgba(0,0,0,0.4)"
                        : "0 8px 32px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <Search fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Search</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <Badge badgeContent={3} color="error" variant="dot">
                      <Notifications fontSize="small" />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText>Notifications</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleThemeToggle}>
                  <ListItemIcon>
                    {theme.palette.mode === "light" ? (
                      <DarkMode fontSize="small" />
                    ) : (
                      <LightMode fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    Switch to{" "}
                    {theme.palette.mode === "light" ? "Dark" : "Light"} Mode
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { handleBackClick(); handleMenuClose(); }}>
                  <ListItemIcon>
                    <ArrowBack fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Go Back</ListItemText>
                </MenuItem>
              </Menu>

              {/* Search, Notifications, and Theme Toggle - Only visible on desktop */}
              {!isMobile && (
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Search">
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(0,0,0,0.2)"
                            : "rgba(255,255,255,0.8)",
                        border: `1px solid ${theme.palette.divider}`,
                        width: 40,
                        height: 40,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <Search fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Notifications">
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(0,0,0,0.2)"
                            : "rgba(255,255,255,0.8)",
                        border: `1px solid ${theme.palette.divider}`,
                        width: 40,
                        height: 40,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <Badge badgeContent={3} color="error" variant="dot">
                        <Notifications fontSize="small" />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <ThemeToggle size="small" showTooltip={true} />
                </Stack>
              )}

              {/* Back Button - Always visible */}
              <Tooltip title="Go Back">
                <IconButton
                  size="small"
                  onClick={handleBackClick}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0,0,0,0.2)"
                        : "rgba(255,255,255,0.8)",
                    border: `1px solid ${theme.palette.divider}`,
                    width: 40,
                    height: 40,
                    ml: isMobile ? 0 : 1,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ArrowBack fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `}
      </style>
    </Box>
  );
};
