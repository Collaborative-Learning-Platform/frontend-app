import {
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import { useAuth } from "../contexts/Authcontext";

const mockUser = {
  name: "user",
  role: "Student",
  studyStreak: 7,
};

export default function WelcomeHeader() {
  const { name, role } = useAuth();
  const user = {
    ...mockUser,
    name: name || mockUser.name,
    role: role || mockUser.role,
  };

  return (
    <Paper
      elevation={4}
      sx={{
        flex: 1, 
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        borderRadius: 2, 
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Left: Avatar + Greeting */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              bgcolor: "white",
              color: "primary.main",
              fontWeight: "bold",
              boxShadow: 2,
            }}
          >
            {user.name
              .split(" ")
              .map((n) => n[0].toUpperCase())
              .join("")}
          </Avatar>

          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
            >
              Welcome back, {user.name} 👋
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.9)",
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
              }}
            >
              {user.role}
            </Typography>
          </Box>
        </Box>

        {/* Right: Streak Badge */}
        <Chip
          label={`${user.studyStreak} day study streak 🔥`}
          sx={{
            bgcolor: "rgba(255,255,255,0.15)",
            color: "white",
            fontWeight: "bold",
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
            px: 1,
          }}
        />
      </Box>
    </Paper>
  );
}
