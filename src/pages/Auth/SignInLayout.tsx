import { Box, Paper, Typography, useTheme } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SignInForm from "../../components/signIn/SignInForm";
import loginPageImage from "../../assets/login_page_image.png";

export default function SignInLayout() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left Side - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundImage: `url(${loginPageImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          color: "white",
          px: 8,
          py: 6,
          '&::before': {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDarkMode 
              ? "rgba(21, 101, 192, 0.7)"
              : "rgba(25, 118, 210, 0.6)",
            zIndex: 1,
          },
          '& > *': {
            position: "relative",
            zIndex: 2,
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 8 }}>
          <MenuBookIcon sx={{ fontSize: 48 }} />
          <Typography variant="h4" fontWeight="700">
            Learni
          </Typography>
        </Box>

        {/* Main Tagline */}
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 700,
            fontSize: { md: "3.5rem", lg: "4.5rem" },
            lineHeight: 1.2,
            mb: 3,
          }}
        >
          Collaborate.
          <br />
          Learn. Grow.
        </Typography>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
          backgroundColor: isDarkMode ? "background.default" : "#f5f5f5",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            backgroundColor: "background.paper",
            border: isDarkMode ? '1px solid' : 'none',
            borderColor: 'divider',
          }}
        >
          {/* Mobile Logo */}
          <Box 
            sx={{ 
              display: { xs: "flex", md: "none" },
              alignItems: "center", 
              gap: 1.5, 
              mb: 4,
              justifyContent: "center"
            }}
          >
            <MenuBookIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h5" fontWeight="700" color="primary.main">
              Learni
            </Typography>
          </Box>

          <Typography 
            variant="h4" 
            fontWeight="600" 
            sx={{ mb: 1, color: "text.primary" }}
          >
            Welcome back,
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ mb: 4, color: "text.primary", fontWeight: 400 }}
          >
            let's continue learning
          </Typography>

          <SignInForm />
        </Paper>
      </Box>
    </Box>
  );
}
