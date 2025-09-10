import {
  Box,

} from "@mui/material";

import { Outlet } from "react-router-dom";
import WelcomeHeader from "../components/WelcomeHeader";

// const mockUser = {
//   name: "Vinuka Buddhima",
//   role: "Student",
//   avatar: "/placeholder.svg?height=40&width=40",
//   workspaces: 3,
//   groups: 8,
//   completedQuizzes: 24,
//   studyStreak: 7,
// };

export default function UserDashboard() {
  return (
    <Box sx={{ minHeight: "100%", bgcolor: "background.default" }}>
      <WelcomeHeader />

      <Box sx={{ flex: 1, paddingTop: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
