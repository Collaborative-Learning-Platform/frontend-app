import { useEffect, useState, useRef } from 'react';
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
  Skeleton,
  CircularProgress,
} from '@mui/material';
import {
  Key,
  Shield,
  Visibility as Eye,
  VisibilityOff as EyeOff,
  CameraAlt as Camera,
  AccountCircle as CircleUser,
  Settings as SettingsIcon,
  ChangeCircle,
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../contexts/Authcontext';
import { useSnackbar } from '../contexts/SnackbarContext';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  profile_picture?: string;
}

export default function ProfilePage() {
  const auth = useAuth();
  const { showSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    role: '',
    profile_picture: '',
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    activityTracking: false,
    dataSharing: false,
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [loadingProfileData, setLoadingProfileData] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordChangeSubmit = async () => {
    if (!auth?.user_id) {
      showSnackbar('User ID not available', 'error');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      showSnackbar('Please fill all password fields', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showSnackbar('New password and confirmation do not match', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showSnackbar('Password must be at least 8 characters long', 'error');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await axiosInstance.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (response.data?.success) {
        showSnackbar('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showSnackbar(
          response.data?.message || 'Failed to update password',
          'error'
        );
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.response?.data?.message) {
        showSnackbar(error.response.data.message, 'error');
      } else if (error.response?.status === 404) {
        showSnackbar('User not found', 'error');
      } else if (error.response?.status === 401) {
        showSnackbar('Current password is incorrect', 'error');
      } else {
        showSnackbar('Failed to change password. Please try again', 'error');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleProfilePictureUpload = () => {
    if (!auth?.user_id) {
      showSnackbar('User ID not available', 'error');
      return;
    }

    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const setS3DownloadURL = async () => {
    const response = await axiosInstance.post(
      '/storage/generate-profile-pic-download-url',
      { userId: auth.user_id }
    );
    console.log('Generated profile pic download URL', response.data);
    setProfileData({
      ...profileData,
      profile_picture: response.data.downloadUrl,
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showSnackbar('Please select an image file', 'error');
      return;
    }

    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showSnackbar('File size must be less than 5MB', 'error');
      return;
    }

    setUploadingProfilePicture(true);

    try {
      // Generate upload URL
      const uploadUrlResponse = await axiosInstance.post(
        '/storage/generate-profile-pic-upload-url',
        {
          userId: auth.user_id,
          fileName: file.name,
          contentType: file.type,
        }
      );

      if (uploadUrlResponse.data.success) {
        const { uploadUrl } = uploadUrlResponse.data;

        // Upload file to the generated URL
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (uploadResponse.ok) {
          showSnackbar('Profile picture updated successfully!', 'success');
          await fetchProfileData();
          await setS3DownloadURL();
        } else {
          showSnackbar('Failed to upload image', 'error');
        }
      } else {
        showSnackbar('Failed to generate upload URL', 'error');
      }
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      if (error.response?.data?.message) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Failed to upload profile picture', 'error');
      }
    } finally {
      setUploadingProfilePicture(false);
      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoadingProfileData(true);
      const res = await axiosInstance.get(`/auth/get-user/${auth.user_id}`);
      if (res.data.success) {
        console.log('Fetched profile info', res.data);
        setProfileData({
          name: res.data.user.name || '',
          email: res.data.user.email || '',
          role: res.data.user.role || '',
        });
        setS3DownloadURL();
      } else {
        console.error('API response not successful:', res.data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoadingProfileData(false);
    }
  };

  useEffect(() => {
    console.log('Auth in ProfilePage:', auth);
    if (auth?.user_id) {
      fetchProfileData();
    } else {
      console.warn('No user_id available, skipping profile fetch');
      setLoadingProfileData(false);
    }
  }, [auth?.user_id]);

  // // Update profile data when auth context data changes
  // useEffect(() => {
  //   if (auth && !auth.loading) {
  //     console.log("Auth context data:", { name: auth.name, email: auth.email, role: auth.role });
  //     // Use auth context as fallback if profile data is empty
  //     if (auth.name && auth.email && auth.role) {
  //       setProfileData(prevData => ({
  //         ...prevData,
  //         name: prevData.name || auth.name || "",
  //         email: prevData.email || auth.email || "",
  //         role: prevData.role || auth.role || "",
  //       }));
  //     }
  //   }
  // }, [auth?.name, auth?.email, auth?.role, auth?.loading]);

  const handleUpdateProfile = async () => {
    if (!auth?.user_id) {
      showSnackbar('User ID not available', 'error');
      return;
    }

    if (!profileData.name || profileData.name.trim() === '') {
      showSnackbar('Name cannot be empty', 'error');
      return;
    }

    setUpdatingProfile(true);

    try {
      const response = await axiosInstance.put(
        `/users/update-user/${auth.user_id}`,
        {
          name: profileData.name.trim(),
        }
      );

      if (response.data.success) {
        showSnackbar('Profile updated successfully!', 'success');
        // Optionally refresh the profile data
        await fetchProfileData();
      } else {
        showSnackbar('Failed to update profile', 'error');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);

      if (error.response?.data?.message) {
        showSnackbar(error.response.data.message, 'error');
      } else if (error.response?.status === 404) {
        showSnackbar('User not found', 'error');
      } else if (error.response?.status === 500) {
        showSnackbar('Server error. Please try again later', 'error');
      } else {
        showSnackbar('Failed to update profile. Please try again', 'error');
      }
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <Box>
      {/* Hidden file input for profile picture upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container>
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
              avatar={<CircleUser sx={{ color: '#1976d2', fontSize: 30 }} />}
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
                      display: 'flex',
                      alignItems: 'center',
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
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{ width: 80, height: 80, fontSize: 32 }}
                      src={profileData.profile_picture}
                    >
                      JS
                    </Avatar>
                    <Box>
                      <Typography variant="body2">Profile Picture</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleProfilePictureUpload}
                        disabled={uploadingProfilePicture}
                        sx={{ mt: 1 }}
                      >
                        <Camera sx={{ mr: 0.75, fontSize: 16 }} />
                        {uploadingProfilePicture
                          ? 'Uploading...'
                          : 'Change Picture'}
                      </Button>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Name"
                      defaultValue={profileData.name || auth?.name || ''}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      fullWidth
                    />
                    <TextField
                      disabled
                      label="Email Address"
                      type="email"
                      value={profileData.email || auth?.email || ''}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                    <TextField
                      disabled
                      label="Role"
                      value={profileData.role || auth?.role || ''}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Box>
                  <Button
                    onClick={handleUpdateProfile}
                    variant="contained"
                    disabled={updatingProfile}
                    sx={{ mt: 3 }}
                  >
                    {updatingProfile ? 'Updating...' : 'Save Profile Changes'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Privacy Checkup Card */}
          <Card sx={{ mb: 4 }}>
            <CardHeader
              avatar={<Shield sx={{ color: '#1976d2', fontSize: 20 }} />}
              title={<Typography variant="h6">Privacy Checkup</Typography>}
              subheader={
                <Typography variant="body2">
                  Review and manage your privacy settings
                </Typography>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                onClick={() =>
                  showSnackbar('Privacy settings updated!', 'success')
                }
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
              avatar={<Key sx={{ color: '#1976d2', fontSize: 20 }} />}
              title={<Typography variant="h6">Security Settings</Typography>}
              subheader={
                <Typography variant="body2">
                  Manage your account security and authentication
                </Typography>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3, gap: 1 }}>
                <Box>
                  <Typography variant="subtitle1">Change Password</Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setOpenPasswordDialog(true)}
                  sx={{ mt: 1, mb: 1 }}
                >
                  Change Password
                </Button>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Update your account password
                  </Typography>
                </Box>
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
                type={showCurrentPassword ? 'text' : 'password'}
                fullWidth
                margin="dense"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      size="small"
                    >
                      {showCurrentPassword ? (
                        <EyeOff sx={{ fontSize: 16 }} />
                      ) : (
                        <Eye sx={{ fontSize: 16 }} />
                      )}
                    </Button>
                  ),
                }}
              />
              <TextField
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      size="small"
                    >
                      {showNewPassword ? (
                        <EyeOff sx={{ fontSize: 16 }} />
                      ) : (
                        <Eye sx={{ fontSize: 16 }} />
                      )}
                    </Button>
                  ),
                }}
              />
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        <EyeOff sx={{ fontSize: 16 }} />
                      ) : (
                        <Eye sx={{ fontSize: 16 }} />
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
                  handlePasswordChangeSubmit(), setOpenPasswordDialog(false);
                }}
                variant="contained"
                disabled={changingPassword}
                startIcon={
                  changingPassword ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <ChangeCircle />
                  )
                }
              >
                {changingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}
