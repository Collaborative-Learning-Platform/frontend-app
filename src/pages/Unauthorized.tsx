import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" color="error">
        🚫 Access Denied
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        You do not have permission to view this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => navigate("/user-dashboard")}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}
