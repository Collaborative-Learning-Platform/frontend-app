import {
  Box,

} from "@mui/material";

import { Outlet } from "react-router-dom";
import WelcomeHeader from "../components/WelcomeHeader";



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
