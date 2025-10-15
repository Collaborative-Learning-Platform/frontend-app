import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  // Chip,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { useAuth } from '../contexts/Authcontext';
const mockUser = {
  name: 'user',
  role: 'Student',
  studyStreak: 7,
};
import axiosInstance from '../api/axiosInstance';

export default function WelcomeHeader() {
  const { name, role, user_id } = useAuth();
  const theme = useTheme();
  const [profilePictureURL, setProfilePictureURL] = useState<string | null>(
    null
  );
  const userRole = role === 'user' ? 'Student' : role;
  const user = {
    ...mockUser,
    name: name || mockUser.name,
    role: userRole || mockUser.role,
  };

  const setS3ProfilePictureDownloadURL = async (userId: string) => {
    try {
      const response = await axiosInstance.post(
        '/storage/generate-profile-pic-download-url',
        { userId }
      );
      if (response.data.success) {
        setProfilePictureURL(response.data.downloadUrl);
      }
    } catch (error) {
      console.error('Error fetching S3 profile picture:', error);
    }
  };

  // Fetch profile picture on component mount
  useEffect(() => {
    if (!user_id) return;
    setS3ProfilePictureDownloadURL(user_id);
  }, [user_id]);

  return (
    <Paper
      elevation={4}
      sx={{
        flex: 1,
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        borderRadius: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 100%, ${theme.palette.primary.light} 0%)`,
        color: theme.palette.common.white,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={profilePictureURL || undefined}
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              bgcolor: theme.palette.common.white,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              boxShadow: 2,
            }}
          >
            {user.name
              .split(' ')
              .map((n) => n[0].toUpperCase())
              .join('')}
          </Avatar>

          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Welcome back, {user.name} 👋
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.common.white, 0.9),
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
              }}
            >
              {user.role}
            </Typography>
          </Box>
        </Box>

        {/* Right: Streak Badge
        {role === "user" &&
        <Chip
          label={`${user.studyStreak} day study streak 🔥`}
          sx={{
            bgcolor: alpha(theme.palette.common.white, 0.15),
            color: theme.palette.common.white,
            fontWeight: "bold",
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
            px: 1,
          }}
        /> } */}
      </Box>
    </Paper>
  );
}
