import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Fade,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../../api/axiosInstance";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  
  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Please enter a valid email";
    return "";
  };

  const emailError = touched ? validateEmail(email) : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || "Something went wrong. Try again.");
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || "Failed to send reset link.");
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        backgroundColor: "#f5f5f5",
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
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
          Enter your email and we’ll send you a reset link.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            error={!!emailError}
            helperText={emailError}
          />

          <Fade in={!!error} timeout={300}>
            <Box mt={2}>{error && <Alert severity="error">{error}</Alert>}</Box>
          </Fade>

          <Fade in={success} timeout={300}>
            <Box mt={2}>
              {success && (
                <Alert severity="success">
                  Reset link sent! Please check your email.
                </Alert>
              )}
            </Box>
          </Fade>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading || !email}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
