import { useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Palette,
  Notifications as Bell,
  Person as User,
  Edit as PenTool,
  Description as FileText,
  DarkMode as Moon,
  LightMode as Sun,
  VolumeUp as Volume2,
  Vibration as Vibrate,
  Email as Mail,
  Chat as MessageSquare,
  People as Users,
  OpenInNew as ExternalLink,
  Save,
  RestartAlt as RotateCcw,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme as useCustomTheme } from "../contexts/ThemeContext";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { toggleTheme, mode: currentTheme } = useCustomTheme();

  const [whiteboardSettings, setWhiteboardSettings] = useState({
    gridEnabled: true,
    snapToGrid: false,
    brushSize: 3,
    autoSave: true,
    collaboratorCursors: true,
    drawingSmoothing: 75,
  });

  const [documentSettings, setDocumentSettings] = useState({
    fontSize: 14,
    lineHeight: 1.5,
    spellCheck: true,
    autoFormat: true,
    trackChanges: true,
    commentNotifications: true,
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: currentTheme,
    accentColor: "blue",
    reducedMotion: false,
    highContrast: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    collaboratorJoined: true,
    documentShared: true,
    mentionNotifications: true,
    weeklyDigest: false,
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleSaveSettings = () => {
    console.log("Settings saved:", {
      whiteboard: whiteboardSettings,
      document: documentSettings,
      theme: themeSettings,
      notifications: notificationSettings,
    });
    setSnackbar({ open: true, message: "Settings saved successfully!" });
  };

  const handleResetSettings = () => {
    setWhiteboardSettings({
      gridEnabled: true,
      snapToGrid: false,
      brushSize: 3,
      autoSave: true,
      collaboratorCursors: true,
      drawingSmoothing: 75,
    });
    setDocumentSettings({
      fontSize: 14,
      lineHeight: 1.5,
      spellCheck: true,
      autoFormat: true,
      trackChanges: true,
      commentNotifications: true,
    });
    setThemeSettings({
      theme: "light",
      accentColor: "blue",
      reducedMotion: false,
      highContrast: false,
    });
    setNotificationSettings({
      emailNotifications: true,
      pushNotifications: false,
      soundEnabled: true,
      vibrationEnabled: true,
      collaboratorJoined: true,
      documentShared: true,
      mentionNotifications: true,
      weeklyDigest: false,
    });
    setSnackbar({ open: true, message: "Settings reset to defaults!" });
  };

  return (
    <Box>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <SettingsIcon sx={{ color: "primary.main", fontSize: 32 }} />
              <Typography variant="h4" fontWeight={700}>
                Settings
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Customize your collaborative learning experience with personalized
              preferences for whiteboard, documents, and notifications.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Whiteboard Settings */}
            <Card sx={{ boxShadow: 1 }}>
              <CardHeader
                avatar={<PenTool sx={{ color: "#1976d2", fontSize: 20 }} />}
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
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Show Grid
                        </Typography>
                      </Box>
                      <Switch
                        checked={whiteboardSettings.gridEnabled}
                        onChange={(_, checked) =>
                          setWhiteboardSettings((prev) => ({
                            ...prev,
                            gridEnabled: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Snap to Grid
                        </Typography>
                      </Box>
                      <Switch
                        checked={whiteboardSettings.snapToGrid}
                        onChange={(_, checked) =>
                          setWhiteboardSettings((prev) => ({
                            ...prev,
                            snapToGrid: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Auto Save
                        </Typography>
                      </Box>
                      <Switch
                        checked={whiteboardSettings.autoSave}
                        onChange={(_, checked) =>
                          setWhiteboardSettings((prev) => ({
                            ...prev,
                            autoSave: checked,
                          }))
                        }
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Show Collaborator Cursors
                        </Typography>
                      </Box>
                      <Switch
                        checked={whiteboardSettings.collaboratorCursors}
                        onChange={(_, checked) =>
                          setWhiteboardSettings((prev) => ({
                            ...prev,
                            collaboratorCursors: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Default Brush Size: {whiteboardSettings.brushSize}px
                      </Typography>
                      <Slider
                        value={whiteboardSettings.brushSize}
                        onChange={(_, value) =>
                          setWhiteboardSettings((prev) => ({
                            ...prev,
                            brushSize: value as number,
                          }))
                        }
                        max={20}
                        min={1}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Drawing Smoothing: {whiteboardSettings.drawingSmoothing}
                        %
                      </Typography>
                      <Slider
                        value={whiteboardSettings.drawingSmoothing}
                        onChange={(_, value) =>
                          setWhiteboardSettings((prev) => ({
                            ...prev,
                            drawingSmoothing: value as number,
                          }))
                        }
                        max={100}
                        min={0}
                        step={5}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Document Editor Settings */}
            <Card sx={{ boxShadow: 1 }}>
              <CardHeader
                avatar={<FileText sx={{ color: "#1976d2", fontSize: 20 }} />}
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
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Font Size: {documentSettings.fontSize}px
                      </Typography>
                      <Slider
                        value={documentSettings.fontSize}
                        onChange={(_, value) =>
                          setDocumentSettings((prev) => ({
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
                        Line Height: {documentSettings.lineHeight}
                      </Typography>
                      <Slider
                        value={documentSettings.lineHeight}
                        onChange={(_, value) =>
                          setDocumentSettings((prev) => ({
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

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Spell Check
                        </Typography>
                      </Box>
                      <Switch
                        checked={documentSettings.spellCheck}
                        onChange={(_, checked) =>
                          setDocumentSettings((prev) => ({
                            ...prev,
                            spellCheck: checked,
                          }))
                        }
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Auto Format
                        </Typography>
                      </Box>
                      <Switch
                        checked={documentSettings.autoFormat}
                        onChange={(_, checked) =>
                          setDocumentSettings((prev) => ({
                            ...prev,
                            autoFormat: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Track Changes
                        </Typography>
                      </Box>
                      <Switch
                        checked={documentSettings.trackChanges}
                        onChange={(_, checked) =>
                          setDocumentSettings((prev) => ({
                            ...prev,
                            trackChanges: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Comment Notifications
                        </Typography>
                      </Box>
                      <Switch
                        checked={documentSettings.commentNotifications}
                        onChange={(_, checked) =>
                          setDocumentSettings((prev) => ({
                            ...prev,
                            commentNotifications: checked,
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
                avatar={<Palette sx={{ color: "#1976d2", fontSize: 20 }} />}
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
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>Theme Mode</InputLabel>
                      <Select
                        value={themeSettings.theme}
                        label="Theme Mode"
                        onChange={(e) => {
                          setThemeSettings((prev) => ({
                            ...prev,
                            theme: e.target.value,
                          }));
                          if (e.target.value !== currentTheme) {
                            toggleTheme();
                          }
                        }}
                      >
                        <MenuItem value="light">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Sun sx={{ fontSize: 16 }} />
                            Light
                          </Box>
                        </MenuItem>
                        <MenuItem value="dark">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Moon sx={{ fontSize: 16 }} />
                            Dark
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Accent Color</InputLabel>
                      <Select
                        value={themeSettings.accentColor}
                        label="Accent Color"
                        onChange={(e) =>
                          setThemeSettings((prev) => ({
                            ...prev,
                            accentColor: e.target.value,
                          }))
                        }
                      >
                        <MenuItem value="blue">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: "blue",
                              }}
                            />
                            Blue
                          </Box>
                        </MenuItem>
                        <MenuItem value="green">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: "green",
                              }}
                            />
                            Green
                          </Box>
                        </MenuItem>
                        <MenuItem value="purple">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: "purple",
                              }}
                            />
                            Purple
                          </Box>
                        </MenuItem>
                        <MenuItem value="orange">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: "orange",
                              }}
                            />
                            Orange
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      pt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Reduced Motion
                        </Typography>
                      </Box>
                      <Switch
                        checked={themeSettings.reducedMotion}
                        onChange={(_, checked) =>
                          setThemeSettings((prev) => ({
                            ...prev,
                            reducedMotion: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          High Contrast
                        </Typography>
                      </Box>
                      <Switch
                        checked={themeSettings.highContrast}
                        onChange={(_, checked) =>
                          setThemeSettings((prev) => ({
                            ...prev,
                            highContrast: checked,
                          }))
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card sx={{ boxShadow: 1 }}>
              <CardHeader
                avatar={<Bell sx={{ color: "#1976d2", fontSize: 20 }} />}
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
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        letterSpacing: 1,
                      }}
                    >
                      Delivery Methods
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Mail sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" fontWeight={500}>
                          Email Notifications
                        </Typography>
                      </Box>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onChange={(_, checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <MessageSquare
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          Push Notifications
                        </Typography>
                      </Box>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onChange={(_, checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            pushNotifications: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Volume2
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          Sound Alerts
                        </Typography>
                      </Box>
                      <Switch
                        checked={notificationSettings.soundEnabled}
                        onChange={(_, checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            soundEnabled: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Vibrate
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          Vibration
                        </Typography>
                      </Box>
                      <Switch
                        checked={notificationSettings.vibrationEnabled}
                        onChange={(_, checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            vibrationEnabled: checked,
                          }))
                        }
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        letterSpacing: 1,
                      }}
                    >
                      Notification Types
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Users sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" fontWeight={500}>
                          Collaborator Joined
                        </Typography>
                      </Box>
                      <Switch
                        checked={notificationSettings.collaboratorJoined}
                        onChange={(_, checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            collaboratorJoined: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Document Shared
                        </Typography>
                      </Box>
                      <Switch
                        checked={notificationSettings.documentShared}
                        onChange={(_, checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            documentShared: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Mentions & Comments
                        </Typography>
                      </Box>
                      <Switch
                        checked={notificationSettings.mentionNotifications}
                        onChange={(_, checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            mentionNotifications: checked,
                          }))
                        }
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          Weekly Activity Digest
                        </Typography>
                      </Box>
                      <Switch
                        checked={notificationSettings.weeklyDigest}
                        onChange={(_, checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            weeklyDigest: checked,
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
                avatar={<User sx={{ color: "#1976d2", fontSize: 20 }} />}
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
                  onClick={() => navigate("/user-profile")}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  <ExternalLink sx={{ mr: 1, fontSize: 16 }} />
                  Go to Profile Settings
                </Button>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                pt: 3,
              }}
            >
              <Button
                onClick={handleSaveSettings}
                variant="contained"
                sx={{ flex: { xs: 1, sm: "none" } }}
              >
                <Save sx={{ mr: 1, fontSize: 16 }} />
                Save Settings
              </Button>
              <Button
                variant="outlined"
                onClick={handleResetSettings}
                sx={{ flex: { xs: 1, sm: "none" } }}
              >
                <RotateCcw sx={{ mr: 1, fontSize: 16 }} />
                Reset to Defaults
              </Button>
            </Box>
          </Box>

          {/* Success Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity="success"
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
}
