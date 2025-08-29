import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Outlet />
    </Box>
  );
};

export default AdminDashboard;
