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
      <Card sx={{ maxWidth: 420, width: "100%", boxShadow: 6, borderRadius: 3 }}>
        <CardHeader
          title="Set Your New Password"
          subheader="First-time login requires updating your password"
          sx={{ textAlign: "center", pb: 0 }}
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
