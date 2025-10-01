import { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  TextField,
  Typography,
  // Avatar, AvatarGroup removed
  IconButton,
  Tooltip,
  Fade,
  Stack,
  useTheme,
  Popover,
} from "@mui/material";
import {
  Share as ShareIcon,
  Save as SaveIcon,
  CloudDone as CloudDoneIcon,
  Sync as SyncIcon,
  MoreVert as MoreVertIcon,
  InsertDriveFile as DocumentIcon,
} from "@mui/icons-material";
import { ThemeToggle } from "../../Buttons/ThemeToggle";
import { BackButton } from "../../Buttons/BackButton";
import { NotificationsButton } from "../../Buttons/NotificationsButton";
import {
  actionsAndCollaborators,
  actionStyles,
  customAnimations,
  docNameInputProps,
  documentInfoWrapper,
  getAppBarStyling,
  // getAvatarGroupStyles, getAvatarStyles, getCollaboratorsBoxStyles removed
  getDocNameWrapper,
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
} from "../../../styles/components/DocumentEditor/Titlebar";

interface TitlebarProps {
  documentData?: {
    documentId: string;
    title: string;
    groupId: string;
    groupName: string;
  };
}

export const Titlebar = ({ documentData }: TitlebarProps) => {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Removed loggedInUsers state and related logic
  const [documentName, setDocumentName] = useState<string>(
    documentData?.title || "Untitled Document"
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const appBarStyles = getAppBarStyling(theme);
  const docNameWrapper = getDocNameWrapper(theme);
  const shareButtonStyles = getShareButtonStyles(theme);
  const saveButtonStyles = getSaveButtonStyles(theme);
  // const collaboratorsBoxStyles = getCollaboratorsBoxStyles(theme);
  // const avatarGroupStyles = getAvatarGroupStyles(theme);

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

  return (
    <Box sx={{ width: "100%", flexGrow: 1, padding: 0, overflow: "visible" }}>
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

              {/* Collaborators removed as requested */}

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

      {/* Mobile Popover for More Options */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 2,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            borderRadius: 3, // 24px for more rounded edges
          },
        }}
      >
        <Tooltip title="Notifications">
          <Box>
            <NotificationsButton
              size="small"
              showTooltip={false}
              badgeContent={3}
            />
          </Box>
        </Tooltip>
        <Tooltip title="Toggle Theme">
          <Box>
            <ThemeToggle size="small" showTooltip={false} />
          </Box>
        </Tooltip>
        <Tooltip title="Go Back">
          <Box>
            <BackButton
              size="small"
              showTooltip={false}
              // onClick={handleMenuClose}
            />
          </Box>
        </Tooltip>
      </Popover>

      {/* Custom Animations and Responsive Styles */}
      <style>{customAnimations}</style>
    </Box>
  );
};
