import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Avatar,
  TextField,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Skeleton,
} from "@mui/material";
import {
  Key,
  Shield,
  CheckCircle,
  Warning as AlertTriangle,
  Smartphone,
  Visibility as Eye,
  VisibilityOff as EyeOff,
  CameraAlt as Camera,
  AccountCircle as CircleUser,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/Authcontext";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  profile_picture?: string;
}

export default function ProfilePage() {
  const auth = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    role: "",
    profile_picture: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    activityTracking: false,
    dataSharing: false,
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTestingTwoFactor, setIsTestingTwoFactor] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [open2FADialog, setOpen2FADialog] = useState(false);
  const [loadingProfileData, setLoadingProfileData] = useState(true);

  // Minimal toast (replace with your toast hook if needed)
  const toast = (msg: string) => alert(msg);

  const fetchProfileData = async () => {
    try {
      setLoadingProfileData(true);
      const res = await axiosInstance.get(`/auth/get-user/${auth.user_id}`);
      if (res.data.success) {
        console.log("Fetched profile info", res.data);
        setProfileData({
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          profile_picture: res.data.user.profile_picture,
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoadingProfileData(false);
    }
  };

  useEffect(() => {
    console.log("Auth in ProfilePage:", auth);
    if (auth?.user_id) {
      fetchProfileData();
    } else {
      console.warn("No user_id available, skipping profile fetch");
      setLoadingProfileData(false);
    }
  }, [auth?.user_id]);

  return (
    <Box>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container>
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <SettingsIcon
                sx={{
                  color: "primary.main",
                  fontSize: 32,
                }}
              />
              <Typography variant="h4" fontWeight={700}>
                Profile Settings
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your account information and security settings
            </Typography>
          </Box>

          {/* Profile Information Card */}
          <Card sx={{ mb: 4 }}>
            <CardHeader
              avatar={<CircleUser sx={{ color: "#1976d2", fontSize: 30 }} />}
              title={<Typography variant="h6">Profile Information</Typography>}
              subheader={
                <Typography variant="body2">
                  Update your basic profile details
                </Typography>
              }
            />
            <CardContent>
              {loadingProfileData ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      mb: 3,
                    }}
                  >
                    <Skeleton
                      variant="circular"
                      width={80}
                      height={80}
                      animation="wave"
                    />
                    <Box>
                      <Typography variant="body2">Profile Picture</Typography>
                      <Skeleton
                        variant="rectangular"
                        width={120}
                        height={32}
                        sx={{ mt: 1, borderRadius: 1 }}
                        animation="wave"
                      />
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      height={56}
                      sx={{ borderRadius: 1 }}
                      animation="wave"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={56}
                      sx={{ borderRadius: 1 }}
                      animation="wave"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={56}
                      sx={{ borderRadius: 1 }}
                      animation="wave"
                    />
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    width={200}
                    height={36}
                    sx={{ mt: 3, borderRadius: 1 }}
                    animation="wave"
                  />
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{ width: 80, height: 80, fontSize: 32 }}
                      src="/student-profile.png"
                    >
                      JS
                    </Avatar>
                    <Box>
                      <Typography variant="body2">Profile Picture</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => toast("Profile picture updated!")}
                        sx={{ mt: 1 }}
                      >
                        <Camera sx={{ mr: 0.75, fontSize: 16 }} />
                        Change Picture
                      </Button>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Name"
                      value={profileData.name || ""}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      fullWidth
                    />
                    <TextField
                      disabled
                      label="Email Address"
                      type="email"
                      value={profileData.email || ""}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                    <TextField
                      disabled
                      label="Role"
                      value={profileData.role || ""}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Box>
                  <Button
                    onClick={() => toast("Profile updated!")}
                    variant="contained"
                    sx={{ mt: 3 }}
                  >
                    Save Profile Changes
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Privacy Checkup Card */}
          <Card sx={{ mb: 4 }}>
            <CardHeader
              avatar={<Shield sx={{ color: "#1976d2", fontSize: 20 }} />}
              title={<Typography variant="h6">Privacy Checkup</Typography>}
              subheader={
                <Typography variant="body2">
                  Review and manage your privacy settings
                </Typography>
              }
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography>Profile Visibility</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Allow other students to see your profile
                    </Typography>
                  </Box>
                  <Switch
                    checked={privacySettings.profileVisibility}
                    onChange={(_, checked) =>
                      setPrivacySettings({
                        ...privacySettings,
                        profileVisibility: checked,
                      })
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
                    <Typography>Activity Tracking</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Track learning progress and activity
                    </Typography>
                  </Box>
                  <Switch
                    checked={privacySettings.activityTracking}
                    onChange={(_, checked) =>
                      setPrivacySettings({
                        ...privacySettings,
                        activityTracking: checked,
                      })
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
                    <Typography>Data Sharing</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Share anonymized data for research
                    </Typography>
                  </Box>
                  <Switch
                    checked={privacySettings.dataSharing}
                    onChange={(_, checked) =>
                      setPrivacySettings({
                        ...privacySettings,
                        dataSharing: checked,
                      })
                    }
                  />
                </Box>
              </Box>
              <Button
                onClick={() => toast("Privacy settings updated!")}
                variant="contained"
                sx={{ mt: 3 }}
              >
                Update Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings Card */}
          <Card>
            <CardHeader
              avatar={<Key sx={{ color: "#1976d2", fontSize: 20 }} />}
              title={<Typography variant="h6">Security Settings</Typography>}
              subheader={
                <Typography variant="body2">
                  Manage your account security and authentication
                </Typography>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography>Two-Factor Authentication</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Add an extra layer of security to your account
                    </Typography>
                    <Box>
                      {twoFactorEnabled ? (
                        <Button
                          size="small"
                          color="success"
                          sx={{
                            border: "none",
                            pointerEvents: "none",
                            pl: 0,
                            minWidth: "auto",
                          }}
                          startIcon={<CheckCircle sx={{ fontSize: 14 }} />}
                        >
                          Enabled
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          color="error"
                          sx={{
                            border: "none",
                            pointerEvents: "none",
                            pl: 0,
                            minWidth: "auto",
                          }}
                          startIcon={<AlertTriangle sx={{ fontSize: 14 }} />}
                        >
                          Disabled
                        </Button>
                      )}
                    </Box>
                  </Box>
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={(_, checked) => setTwoFactorEnabled(checked)}
                  />
                </Box>
                {twoFactorEnabled && (
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setIsTestingTwoFactor(true);
                        setTimeout(() => {
                          setIsTestingTwoFactor(false);
                          toast("2FA test successful!");
                        }, 2000);
                      }}
                      disabled={isTestingTwoFactor}
                    >
                      <Smartphone sx={{ mr: 0.75, fontSize: 16 }} />
                      {isTestingTwoFactor ? "Testing..." : "Test 2FA"}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setOpen2FADialog(true)}
                    >
                      Change 2FA Settings
                    </Button>
                  </Box>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">Change Password</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Update your account password
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setOpenPasswordDialog(true)}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Password Dialog */}
          <Dialog
            open={openPasswordDialog}
            onClose={() => setOpenPasswordDialog(false)}
          >
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <TextField
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      size="small"
                    >
                      {showCurrentPassword ? (
                        <Eye sx={{ fontSize: 16 }} />
                      ) : (
                        <EyeOff sx={{ fontSize: 16 }} />
                      )}
                    </Button>
                  ),
                }}
              />
              <TextField
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      size="small"
                    >
                      {showNewPassword ? (
                        <Eye sx={{ fontSize: 16 }} />
                      ) : (
                        <EyeOff sx={{ fontSize: 16 }} />
                      )}
                    </Button>
                  ),
                }}
              />
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      size="small"
                    >
                      {showConfirmPassword ? (
                        <Eye sx={{ fontSize: 16 }} />
                      ) : (
                        <EyeOff sx={{ fontSize: 16 }} />
                      )}
                    </Button>
                  ),
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPasswordDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast("Password updated!");
                  setOpenPasswordDialog(false);
                }}
                variant="contained"
              >
                Update Password
              </Button>
            </DialogActions>
          </Dialog>

          {/* 2FA Dialog */}
          <Dialog open={open2FADialog} onClose={() => setOpen2FADialog(false)}>
            <DialogTitle>Two-Factor Authentication Settings</DialogTitle>
            <DialogContent>
              <TextField
                label="Authentication Method"
                select
                defaultValue="app"
                fullWidth
                margin="dense"
              >
                <MenuItem value="app">Authenticator App</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </TextField>
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                Generate New Backup Codes
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen2FADialog(false)}>Cancel</Button>
              <Button variant="contained">Save Changes</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}
