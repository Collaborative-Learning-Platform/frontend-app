import { Box, Paper, Typography } from "@mui/material";
import SignInPage from "./SignInPage";
import LoginIllustration from "../../assets/login_illustration.png";

export default function SignInLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left Image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "flex", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1976d2, #1565c0)",
          color: "white",
          textAlign: "center",
          p: 6,
        }}
      >
        <Box component="img" src={LoginIllustration} alt="Illustration" sx={{ maxWidth: "80%", mb: 3 }} />
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          Welcome to Learni
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 400, opacity: 0.9 }}>
          A collaborative learning platform for students and tutors to grow together.
        </Typography>
      </Box>

      {/* Right Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
          backgroundColor: "#ffffffff",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 3,
            p: { xs: 4, md: 5 },
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: "center" }}>
            Sign in to Learni
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
            Continue your learning journey
          </Typography>

          <SignInPage />
        </Paper>
      </Box>
    </Box>
  );
}
