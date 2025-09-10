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
import { Chats } from "../Buttons/Chats";
import { ThemeToggle } from "../Buttons/ThemeToggle";
import { BackButton } from "../Buttons/BackButton";
import { NotificationsButton } from "../Buttons/NotificationsButton";
import { docEditorToolbar } from "../../styles/components/DocumentEditor/common";
import {
  actionsAndCollaborators,
  actionStyles,
  customAnimations,
  docNameInputProps,
  documentInfoWrapper,
  getAppBarStyling,
  getAvatarGroupStyles,
  getAvatarStyles,
  getCollaboratorsBoxStyles,
  getDocNameWrapper,
  getMobileMenuTheme,
  getMoreOptionsButtonStyles,
  getMoreVertIconStyle,
  getSaveButtonStyles,
  getSaveStatusWrapper,
  getShareButtonStyles,
  responsiveLayoutWrapper,
  shareIconStyles,
  syncIconStyles,
  textFieldWrapper,
  toolBarStyles,
} from "../../styles/components/DocumentEditor/Titlebar";

export const Titlebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loggedInUsers, setLoggedInUsers] = useState<string[]>([]);
  const [documentName, setDocumentName] = useState<string>("Untitled Document");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const appBarStyles = getAppBarStyling(theme);
  const docNameWrapper = getDocNameWrapper(theme);
  const shareButtonStyles = getShareButtonStyles(theme);
  const saveButtonStyles = getSaveButtonStyles(theme);
  const collaboratorsBoxStyles = getCollaboratorsBoxStyles(theme);
  const avatarGroupStyles = getAvatarGroupStyles(theme);

  // Remove static saveStatusWrapper - will be calculated inline
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
    <Box sx={docEditorToolbar}>
      <AppBar position="static" elevation={0} sx={appBarStyles}>
        <Toolbar sx={toolBarStyles}>
          <Box sx={responsiveLayoutWrapper}>
            {/* Left Section - Document Info */}
            <Box sx={documentInfoWrapper}>
              <Box sx={docNameWrapper}>
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
                    sx: docNameInputProps,
                  }}
                  sx={textFieldWrapper}
                />
              </Box>

              {/* Save Status - Hidden on mobile and small tablets */}
              <Box sx={getSaveStatusWrapper(isSaving)}>
                <Fade in={!isSaving}>
                  <CloudDoneIcon sx={{ fontSize: 16, color: "success.main" }} />
                </Fade>
                <Fade in={isSaving}>
                  <SyncIcon sx={syncIconStyles} />
                </Fade>
                <Typography
                  variant="body2"
                  color={isSaving ? "info.main" : "success.main"}
                >
                  {isSaving
                    ? "Saving..."
                    : `Saved ${lastSaved.toLocaleTimeString()}`}
                </Typography>
              </Box>
            </Box>

            {/* Right Section - Actions & Collaborators */}
            <Box sx={actionsAndCollaborators}>
              {/* Action Buttons - Responsive display */}
              <Box sx={actionStyles}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShareIcon sx={shareIconStyles} />}
                  sx={shareButtonStyles}
                >
                  Share
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon sx={{ fontSize: { xs: 16, md: 18 } }} />}
                  sx={saveButtonStyles}
                >
                  Save
                </Button>
              </Box>

              {/* Collaborators - Responsive */}
              <Box sx={collaboratorsBoxStyles}>
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
                  sx={avatarGroupStyles}
                >
                  {loggedInUsers.map((user, index) => (
                    <Tooltip key={index} title={`${user} (online)`}>
                      <Avatar sx={getAvatarStyles(index, theme)}>
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
                  sx={getMoreOptionsButtonStyles(theme)}
                >
                  <MoreVertIcon
                    fontSize="small"
                    sx={getMoreVertIconStyle(theme)}
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
        sx={getMobileMenuTheme(theme)}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Chats size="small" showTooltip={false} badgeContent={3} />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <NotificationsButton
              size="small"
              showTooltip={false}
              badgeContent={3}
            />
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
      <style>{customAnimations}</style>
    </Box>
  );
};
