import { useState } from 'react';
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
} from '@mui/material';
import {
  Share as ShareIcon,
  CloudDone as CloudDoneIcon,
  Sync as SyncIcon,
  MoreVert as MoreVertIcon,
  InsertDriveFile as DocumentIcon,
} from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import { ThemeToggle } from '../../Buttons/ThemeToggle';
import { BackButton } from '../../Buttons/BackButton';
import { NotificationsButton } from '../../Buttons/NotificationsButton';
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
} from '../../../styles/components/DocumentEditor/Titlebar';
import axiosInstance from '../../../api/axiosInstance'; // Adjust the import based on your project structure
import html2pdf from 'html2pdf.js';

interface TitlebarProps {
  documentData?: {
    documentId: string;
    title: string;
    groupId: string;
    groupName: string;
  };
  editor: any;
}

export const Titlebar = ({ documentData, editor }: TitlebarProps) => {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Removed loggedInUsers state and related logic
  const [documentName, setDocumentName] = useState<string>(
    documentData?.title || 'Untitled Document'
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  // const [lastSaved, setLastSaved] = useState<Date>(new Date());
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

  const handleExportToPDF = () => {
    if (!editor) return;

    let html = editor.getHTML();

    // // Replace <br> tags with the class 'ProseMirror-trailingBreak' with <p> tags containing newline characters
    // html = html.replace(/<br class="ProseMirror-trailingBreak">/g, '<p>\n</p>');

    const opt = {
      margin: 0.5,
      filename: `${documentData?.title || 'document'}.pdf`,
      image: { type: 'jpeg' as 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait' as 'portrait',
      },
    };

    const element = document.createElement('div');
    // const isDarkMode = theme.palette.mode === 'dark';
    const editorTextColor = editor.getAttributes('textStyle')?.color;
    const textColor = editorTextColor;
    const fontFamily =
      editor.getAttributes('textStyle')?.fontFamily || 'Gill Sans';

    element.innerHTML = `
      <div style="
    font-family: ${fontFamily};
    padding: 20px;
    color: ${textColor ? textColor : theme.palette.common.black};
    white-space: normal;
    line-height: 1.5;
  ">
    <style>
      p {
        margin: 0 0 10px 0; /* spacing between paragraphs */
      }
      br {
        content: "\\A";
        white-space: pre;
      }
    </style>
    ${html}
  </div>
`;

    html2pdf().from(element).set(opt).save();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDocumentNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDocumentName(event.target.value);
  };

  const handleDocumentNameBlur = async () => {
    if (!documentData?.documentId || documentName === documentData.title) {
      return; // No need to update if the name hasn't changed or documentId is missing
    }

    setIsSaving(true);
    try {
      const response = await axiosInstance.put(
        `/documents/${documentData.documentId}`,
        {
          title: documentName,
        }
      );

      if (response.status !== 200) {
        console.error('Failed to update document metadata');
        return;
      }

      // setLastSaved(new Date());
      console.log('Document metadata updated successfully');
    } catch (error) {
      console.error('Error updating document metadata:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: '100%', flexGrow: 1, padding: 0, overflow: 'visible' }}>
      <AppBar position="static" elevation={0} sx={appBarStyles}>
        <Toolbar sx={toolBarStyles}>
          <Box sx={responsiveLayoutWrapper}>
            {/* Left Section - Document Info */}
            <Box sx={documentInfoWrapper}>
              <Box sx={docNameWrapper}>
                <DocumentIcon
                  sx={{
                    color: 'primary.main',
                    fontSize: { xs: 18, sm: 20 },
                    display: {
                      md: 'block',
                      sm: 'block',
                    },
                  }}
                />
                <TextField
                  value={documentName}
                  onChange={handleDocumentNameChange}
                  onBlur={handleDocumentNameBlur}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudDoneIcon
                      sx={{ fontSize: 16, color: 'success.main' }}
                    />
                    <Typography variant="body2" color="success.main">
                      AutoSave On
                    </Typography>
                  </Box>
                </Fade>
                <Fade in={isSaving}>
                  <SyncIcon sx={syncIconStyles} />
                </Fade>
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
                  startIcon={
                    <DownloadIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                  }
                  sx={saveButtonStyles}
                  onClick={handleExportToPDF}
                >
                  Export (PDF)
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
                sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 2,
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
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
