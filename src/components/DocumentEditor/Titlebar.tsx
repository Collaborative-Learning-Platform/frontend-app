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
} from "@mui/icons-material";
import { Chats } from "../Chats";
import { ThemeToggle } from "../ThemeToggle";
import { BackButton } from "../BackButton";
import { NotificationsButton } from "../NotificationsButton";

export const Titlebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loggedInUsers, setLoggedInUsers] = useState<string[]>([]);
  const [documentName, setDocumentName] = useState<string>("Untitled Document");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const simulateAutoSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1500);
  };

  const handleDocumentNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDocumentName(event.target.value);
    simulateAutoSave();
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
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64, md: 72 },
            px: { xs: 1, sm: 2, md: 3 },
            py: { xs: 0.5, sm: 1 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: { xs: "row" },
              gap: { xs: 0.5, sm: 1, md: 2 },
            }}
          >
            {/* Left Section - Document Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1, md: 2 },
                flex: { md: "none" },
                flexShrink: 1,
                flexGrow: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 1, md: 1.5 },
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(255,255,255,0.8)",
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
                }}
              >
                <DocumentIcon
                  sx={{
                    color: "primary.main",
                    fontSize: { xs: 18, sm: 20 },
                    display: {
                      md: "block",
                      sm: "block",
                    },
                  }}
                />
                <TextField
                  value={documentName}
                  onChange={handleDocumentNameChange}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: "text.primary",
                      width: "100%",
                      minWidth: 0, // Allow shrinking
                    },
                  }}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    "& .MuiInputBase-input": {
                      padding: { xs: "2px 0", md: "4px 0" },
                      "&:focus": {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                />
              </Box>

              {/* Save Status - Hidden on mobile and small tablets */}
              <Box
                sx={{
                  display: { xs: "none", lg: "flex" },
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: isSaving
                    ? "background.paper"
                    : "background.paper",
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
                gap: { xs: 0.75, sm: 1, md: 2 },
                flexShrink: 0,
              }}
            >
              {/* Action Buttons - Responsive display */}
              <Box
                sx={{
                  display: { xs: "flex", sm: "flex" },
                  gap: { xs: 1, sm: 1, md: 2 },
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={
                    <ShareIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                  }
                  sx={{
                    borderRadius: { xs: 2, md: 3 },
                    textTransform: "none",
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                    px: { xs: 1, md: 2 },
                    py: { xs: 0.5, md: 1 },
                    minWidth: { xs: 80, sm: 90, md: 100 },
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0,0,0,0.2)"
                        : "rgba(255,255,255,0.8)",
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      borderColor: "primary.main",
                      color: "primary.main",
                    },
                  }}
                >
                  {isTablet ? "" : "Share"}
                </Button>
                <Button
                  variant="contained"
                  size={isTablet ? "medium" : "small"}
                  startIcon={<SaveIcon sx={{ fontSize: { xs: 16, md: 18 } }} />}
                  sx={{
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
                  }}
                >
                  {isTablet ? "" : "Save"}
                </Button>
              </Box>

              {/* Collaborators - Responsive */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex", sm: "flex" },
                  alignItems: "center",
                  gap: { xs: 0.5, md: 1.5 },
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(255,255,255,0.8)",
                  borderRadius: { xs: 2, md: 3 },
                  px: { xs: 1, md: 2 },
                  py: { xs: 0.5, md: 1 },
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    display: { xs: "none", md: "block" },
                    fontSize: { xs: "0.6rem", md: "0.75rem" },
                  }}
                >
                  {loggedInUsers.length} online
                </Typography>
                <AvatarGroup
                  max={isSmallMobile ? 2 : isMobile ? 3 : 4}
                  sx={{
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

              {/* More Options - Visible on small screens */}
              <Tooltip title="More options">
                <IconButton
                  size="small"
                  onClick={handleMenuClick}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0,0,0,0.2)"
                        : "rgba(255,255,255,0.8)",

                    width: { xs: 32, sm: 36, md: 40 },
                    height: { xs: 32, sm: 36, md: 40 },
                    display: { xs: "flex", sm: "flex", md: "none" },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <MoreVertIcon
                    fontSize="small"
                    sx={{
                      color: theme.palette.text.primary,
                    }}
                  />
                </IconButton>
              </Tooltip>

              {/* Messages, Notifications, and Theme Toggle - Desktop only */}
              <Stack
                direction="row"
                spacing={{ sm: 0.5, md: 1 }}
                sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
              >
                <Chats size="small" showTooltip={true} badgeContent={3} />
                <NotificationsButton
                  size="small"
                  showTooltip={true}
                  badgeContent={3}
                />
                <ThemeToggle size="small" showTooltip={true} />
              </Stack>
              <BackButton size="small" showTooltip={true} />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Chats size="small" showTooltip={false} badgeContent={3} />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <NotificationsButton size="small" showTooltip={false} badgeContent={3} />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ThemeToggle size="small" showTooltip={false} />
          </ListItemIcon>
          <ListItemText primary="Toggle Theme" />
        </MenuItem>
      </Menu>

      {/* Custom Animations and Responsive Styles */}
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
        `}
      </style>
    </Box>
  );
};
