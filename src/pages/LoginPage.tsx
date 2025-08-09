import React from "react";
import {
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  TextField,
  Typography,
  Box,
  Paper,
  Link,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
} from "@mui/icons-material";

export default function SignInPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get("Username"),
      password: data.get("Password"),
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 1, sm: 2, md: 3 },
        backgroundImage: {
          xs: "none",
          sm: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[200]} 100%)`,
        },
        backgroundColor: {
          xs: theme.palette.background.default,
          sm: "transparent",
        },
      }}
    >
      <Container
        component="main"
        maxWidth={false}
        sx={{
          maxWidth: { xs: "100%", sm: "70%", md: "35%" },
          px: { xs: 0, sm: 2 },
        }}
      >
        <CssBaseline />
        <Paper
          elevation={isMobile ? 0 : 12}
          sx={{
            borderRadius: { xs: 0, sm: 3 },
            overflow: "hidden",
            background: theme.palette.background.paper, // Use theme color for all modes
            backdropFilter: { xs: "none", sm: "blur(10px)" },
            minHeight: { xs: "100vh", sm: "auto" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: theme.palette.common.white,
              textAlign: "center",
              py: { xs: 3, sm: 4 },
              px: { xs: 2, sm: 3 },
            }}
          >
            <SchoolIcon
              sx={{
                fontSize: { xs: 40, sm: 48 },
                mb: 1,
                opacity: 0.9,
              }}
            />
            <Typography
              component="h1"
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
              }}
            >
              Learni
            </Typography>
            <Typography
              variant={isMobile ? "body2" : "subtitle1"}
              sx={{
                opacity: 0.9,
                mt: 0.5,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Welcome back to your learning journey
            </Typography>
          </Box>

          {/* Form */}
          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              justifyContent: { xs: "flex-start", sm: "center" },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: "400px" },
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="Username"
                label="Username"
                name="Username"
                autoComplete="username"
                autoFocus
                variant="outlined"
                size="medium"
                sx={{
                  mb: { xs: 2, sm: 1 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: theme.palette.action.hover,
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                    "&.Mui-focused": {
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: theme.shadows[4],
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="Password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                variant="outlined"
                size="medium"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        size={isMobile ? "large" : "medium"}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: { xs: 3, sm: 2 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: theme.palette.action.hover,
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                    "&.Mui-focused": {
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: theme.shadows[4],
                    },
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 0 },
                  mt: 1
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="remember"
                      color="primary"
                      size={isMobile ? "medium" : "small"}
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                <Link
                  href="#"
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  py: { xs: 2, sm: 1.5 },
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  background: theme.palette.primary.main,
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    background: theme.palette.primary.dark,
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
