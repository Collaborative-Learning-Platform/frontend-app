import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Fade,
  LinearProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, LockReset as LockResetIcon } from "@mui/icons-material";
import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function FirstTimeLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePassword = (pw: string) => {
    if (!pw) return "Password is required";
    if (pw.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pw)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pw)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pw)) return "Password must contain at least one number";
    return "";
  };


  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; 
    
    // Determine label and color
    if (strength <= 35) {
      return { strength, label: "Weak", color: "#f44336" }; 
    } else if (strength <= 65) {
      return { strength, label: "Medium", color: "#ff9800" }; 
    } else if (strength <= 85) {
      return { strength, label: "Strong", color: "#4caf50" }; 
    } else {
      return { strength, label: "Very Strong", color: "#2196f3" }; 
    }
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const pwError = validatePassword(password);
    if (pwError) return setError(pwError);
    if (password !== confirm) return setError("Passwords do not match");

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/first-time-login", {
        user_id: userId,
        new_password: password,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response.data.message || "Failed to update password");
      }
    } catch (err: any) {
      setError(`Something went wrong. Try again. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 450, width: "100%", boxShadow: 6, borderRadius: 3 }}>
        <CardHeader
          title={
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                Welcome to{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 900,
                  }}
                >
                  Learni
                </Box>{" "}
                🎓
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontStyle: "italic",
                  mb: 2,
                }}
              >
                "Every expert was once a beginner"
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mt: 2,
                }}
              >
                Set Your New Password
              </Typography>
            </Box>
          }
          subheader="This is your first time logging in. Let's secure your account with a strong password."
          sx={{ textAlign: "center", pb: 1, pt: 4 }}
          subheaderTypographyProps={{
            sx: { mt: 1 }
          }}
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Indicator */}
            {password && (
              <Box sx={{ mt: 1, mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography variant="caption" sx={{ mr: 1, color: "text.secondary" }}>
                    Password Strength:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: "bold",
                      color: passwordStrength.color,
                    }}
                  >
                    {passwordStrength.label}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength.strength}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: passwordStrength.color,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              helperText="Must be 8+ characters, include uppercase, lowercase, and a number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm((prev) => !prev)}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Fade in={!!error}>
              <Box mt={2}>{error && <Alert severity="error">{error}</Alert>}</Box>
            </Fade>
            <Fade in={success}>
              <Box mt={2}>
                {success && <Alert severity="success">Password updated! Redirecting...</Alert>}
              </Box>
            </Fade>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, py: 1.3, fontWeight: "bold" }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockResetIcon />}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>

            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
              After updating, you’ll be redirected to login.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
