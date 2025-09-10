import { Box, Container, Typography, Avatar, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";

const mockUser = {
  name: "Vinuka Buddhima",
  role: "Student",
  avatar: "/placeholder.svg?height=40&width=40",
  workspaces: 3,
  groups: 8,
  completedQuizzes: 24,
  studyStreak: 7,
};

export default function UserDashboard() {
  const { name } = useAuth();
  console.log(name);
  return (
    <Box sx={{ minHeight: "100%", bgcolor: "background.default" }}>
      <Paper elevation={0} sx={{ borderColor: "divider" }}>
        <Container sx={{ py: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: { xs: "flex-start", sm: "space-between" },
              gap: { xs: 1.5, sm: 0 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 2 },
                justifyContent: { xs: "center", sm: "flex-start" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Avatar
                sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}
              >
                {String(name)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
                >
                  Welcome back, {name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  {mockUser.role} • {mockUser.studyStreak} day study streak 🔥
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Paper>
      <Box sx={{ flex: 1, paddingTop: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
