import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  useTheme,
} from '@mui/material';
import { useUserSettings } from '../contexts/SettingsContext';
import {
  Settings as SettingsIcon,
  Palette,
  Notifications as Bell,
  Description as FileText,
  Email as Mail,
  Save,
  RestartAlt as RotateCcw,
  People as Users,
  Chat as MessageSquare,
  Person as User,
  Link as ExternalLink,
} from '@mui/icons-material';
import GestureIcon from '@mui/icons-material/Gesture';
import { useNavigate } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { useSnackbar } from '../contexts/SnackbarContext';

// Define the cursor types to match your backend enum
type CursorType = 'default' | 'text' | 'resize-corner' | 'nesw-rotate';

export default function SettingsPage() {
  const theme = useTheme();
  const userSettings = useUserSettings();
  const navigate = useNavigate();
  const { toggleTheme, mode: currentTheme } = useCustomTheme();

  // Initialize settings state with default values
  const [settings, setSettings] = useState({
    showGrid: false,
    defaultBrushSize: 3,
    defaultCursorType: 'default' as CursorType,
    fontSize: 14,
    lineHeight: 1.5,
    emailNotifications: true,
    themeMode: 'light' as 'light' | 'dark',
    accentColor: 'primary',
  });

  const snackBar = useSnackbar();

  useEffect(() => {
    userSettings.reloadSettings();
  }, []);

  useEffect(() => {
    if (userSettings.settings) {
      setSettings({
        showGrid: userSettings.settings.showGrid ?? false,
        defaultBrushSize: userSettings.settings.defaultBrushSize ?? 3,
        defaultCursorType: userSettings.settings.defaultCursorType ?? 'default',
        fontSize: userSettings.settings.fontSize ?? 14,
        lineHeight: userSettings.settings.lineHeight ?? 1.5,
        emailNotifications: userSettings.settings.emailNotifications ?? true,
        themeMode: userSettings.settings.themeMode ?? 'light',
        accentColor: 'primary',
      });
    }
  }, [userSettings.settings]);

  const handleSaveSettings = () => {
    userSettings.updateSettings({
      showGrid: settings.showGrid,
      defaultBrushSize: settings.defaultBrushSize,
      defaultCursorType: settings.defaultCursorType,
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
      emailNotifications: settings.emailNotifications,
      themeMode: settings.themeMode,
    });

    snackBar.showSnackbar('Settings saved!', 'success');
  };

  const handleResetSettings = () => {
    // Reset settings to default values from your entity
    setSettings({
      // Whiteboard settings
      showGrid: true,
      defaultBrushSize: 3,
      defaultCursorType: 'default' as CursorType,

      // Document editor preferences
      fontSize: 14,
      lineHeight: 1.1,

      // Notifications
      emailNotifications: true,

      // Theme preferences
      themeMode: 'light',
      accentColor: 'primary',
    });

    // If the theme was reset, you might want to update the actual theme
    if (currentTheme !== 'light') {
      toggleTheme();
    }

    snackBar.showSnackbar('Settings Reset to Defaults!', 'success');
  };

  return (
    <Box>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <SettingsIcon
                sx={{
                  color: 'primary.main',
                  fontSize: 32,
                }}
              />
              <Typography variant="h4" fontWeight={700}>
                Settings
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Customize your collaborative learning experience with personalized
              preferences for Learni.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Whiteboard Settings */}
            <Card sx={{ boxShadow: 1 }}>
              <CardHeader
                avatar={
                  <GestureIcon
                    sx={{ color: theme.palette.primary.main, fontSize: 20 }}
                  />
                }
                title={
                  <Typography variant="h6">Whiteboard Settings</Typography>
                }
                subheader={
                  <Typography variant="body2">
                    Configure your collaborative whiteboard experience
                  </Typography>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Show Grid
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.showGrid}
                        onChange={(_, checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            showGrid: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Default Brush Size: {settings.defaultBrushSize}px
                      </Typography>
                      <Slider
                        value={settings.defaultBrushSize}
                        onChange={(_, value) =>
                          setSettings((prev) => ({
                            ...prev,
                            defaultBrushSize: value as number,
                          }))
                        }
                        max={10}
                        min={1}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="cursor-type-label">
                        Cursor Type
                      </InputLabel>
                      <Select
                        labelId="cursor-type-label"
                        id="cursor-type-select"
                        value={settings.defaultCursorType}
                        label="Cursor Type"
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            defaultCursorType: e.target.value as CursorType,
                          }))
                        }
                      >
                        <MenuItem value="default" disableRipple>
                          Default
                        </MenuItem>
                        <MenuItem value="text" disableRipple>
                          Text
                        </MenuItem>
                        <MenuItem value="resize-corner" disableRipple>
                          Resize
                        </MenuItem>
                        <MenuItem value="nesw-rotate" disableRipple>
                          Rotate
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Document Editor Settings */}
            <Card sx={{ boxShadow: 1 }}>
              <CardHeader
                avatar={
                  <FileText
                    sx={{ color: theme.palette.primary.main, fontSize: 20 }}
                  />
                }
                title={
                  <Typography variant="h6">
                    Document Editor Preferences
                  </Typography>
                }
                subheader={
                  <Typography variant="body2">
                    Customize your collaborative document editing experience
                  </Typography>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Font Size: {settings.fontSize}px
                      </Typography>
                      <Slider
                        value={settings.fontSize || 14}
                        onChange={(_, value) =>
                          setSettings((prev) => ({
                            ...prev,
                            fontSize: value as number,
                          }))
                        }
                        max={24}
                        min={10}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Line Height: {settings.lineHeight}
                      </Typography>
                      <Slider
                        value={settings.lineHeight || 1.5}
                        onChange={(_, value) =>
                          setSettings((prev) => ({
                            ...prev,
                            lineHeight: value as number,
                          }))
                        }
                        max={3}
                        min={1}
                        step={0.1}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Auto Save
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Automatically save document changes
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(_, checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Theme Preferences */}
            <Card sx={{ boxShadow: 1 }}>
              <CardHeader
                avatar={
                  <Palette
                    sx={{ color: theme.palette.primary.main, fontSize: 20 }}
                  />
                }
                title={<Typography variant="h6">Theme Preferences</Typography>}
                subheader={
                  <Typography variant="body2">
                    Personalize the visual appearance of your workspace
                  </Typography>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>Accent Color</InputLabel>
                      <Select
                        value={settings.accentColor}
                        label="Accent Color"
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            accentColor: e.target.value,
                          }))
                        }
                      >
                        <MenuItem value="primary" disableRipple>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: theme.palette.primary.main,
                              }}
                            />
                            Primary Blue
                          </Box>
                        </MenuItem>
                        <MenuItem value="fuchsia" disableRipple>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: '#ff00ff',
                              }}
                            />
                            Fuchsia
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      pt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Dark Theme
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.themeMode === 'dark'}
                        onChange={(_, checked) => {
                          const newMode = checked ? 'dark' : 'light';
                          setSettings((prev) => ({
                            ...prev,
                            themeMode: newMode,
                          }));
                          const themeMode = checked ? 'dark' : 'light';
                          if (currentTheme !== themeMode) {
                            toggleTheme();
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card sx={{ boxShadow: 1 }}>
              <CardHeader
                avatar={
                  <Bell
                    sx={{ color: theme.palette.primary.main, fontSize: 20 }}
                  />
                }
                title={
                  <Typography variant="h6">Notification Settings</Typography>
                }
                subheader={
                  <Typography variant="body2">
                    Control how and when you receive notifications
                  </Typography>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                  >
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        letterSpacing: 1,
                      }}
                    >
                      Delivery Methods
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Mail sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={500}>
                          Email Notifications
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(_, checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <MessageSquare
                          sx={{ fontSize: 16, color: 'text.secondary' }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          Push Notifications
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(_, checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                  >
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        letterSpacing: 1,
                      }}
                    >
                      Notification Types
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Users sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={500}>
                          Collaborator Joined
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(_, checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Weekly Upcoming Quizzes
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(_, checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Weekly Activity Digest
                        </Typography>
                      </Box>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(_, checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* User Profile Link */}
            <Card sx={{ boxShadow: 1 }}>
              <CardHeader
                avatar={
                  <User
                    sx={{ color: theme.palette.primary.main, fontSize: 20 }}
                  />
                }
                title={<Typography variant="h6">User Profile</Typography>}
                subheader={
                  <Typography variant="body2">
                    Manage your personal information and account settings
                  </Typography>
                }
              />
              <CardContent>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/user-profile')}
                  sx={{ width: { xs: '100%', md: 'auto' } }}
                >
                  <ExternalLink sx={{ mr: 1, fontSize: 16 }} />
                  Go to Profile Settings
                </Button>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                pt: 3,
              }}
            >
              <Button
                onClick={handleSaveSettings}
                variant="contained"
                sx={{ flex: { xs: 1, sm: 'none' } }}
              >
                <Save sx={{ mr: 1, fontSize: 16 }} />
                Save Settings
              </Button>
              <Button
                variant="outlined"
                onClick={handleResetSettings}
                sx={{ flex: { xs: 1, sm: 'none' } }}
              >
                <RotateCcw sx={{ mr: 1, fontSize: 16 }} />
                Reset to Defaults
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
