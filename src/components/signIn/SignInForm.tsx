import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Fade,
  Alert,
  CircularProgress,
  Link,
  Typography,
  Stack,
  useTheme,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  EmailOutlined,
  LockOutlined,
} from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../contexts/Authcontext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, type FormEvent } from 'react';

// Validation functions
const validateEmail = (email: string) => {
  if (!email) return 'Email is required';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'Please enter a valid email';
  return '';
};

const validatePassword = (password: string) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return '';
};

export default function SignInForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field as keyof typeof touched]) validateField(field, value);
  };

  const handleInputBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = (field: string, value: string) => {
    let errorMessage = '';
    if (field === 'email') errorMessage = validateEmail(value);
    else if (field === 'password') errorMessage = validatePassword(value);

    setFieldErrors((prev) => ({ ...prev, [field]: errorMessage }));
    return errorMessage === '';
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setFieldErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });
    return !emailError && !passwordError;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      if (response.data.success) {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        setAuth(response.data.user_id, response.data.role);
        setSuccess(true);

        setTimeout(() => {
          if (response.data.firstTimeLogin) {
            navigate('/first-time-login', {
              state: { userId: response.data.user_id },
            });
          } else {
            if (response.data.role === 'user') navigate('/user-dashboard');
            else if (response.data.role === 'admin')
              navigate('/admin-analytics');
            else if (response.data.role === 'tutor')
              navigate('/tutor-dashboard');
          }
        }, 1000);
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message || err.response.data?.error;
        if (status >= 500) setError('Server error. Try again later.');
        else if (msg) setError(msg);
        else setError('Login failed. Try again.');
      } else if (err.request) setError('Network error. Check your connection.');
      else setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    !fieldErrors.email &&
    !fieldErrors.password &&
    formData.email &&
    formData.password;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: '100%' }}
      noValidate
    >
      <TextField
        fullWidth
        placeholder="Email"
        margin="normal"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        onBlur={() => handleInputBlur('email')}
        error={touched.email && !!fieldErrors.email}
        helperText={touched.email && fieldErrors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailOutlined sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
            borderRadius: 2,
            '& fieldset': {
              borderColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            },
            '&:hover fieldset': {
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#e0e0e0',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />

      <TextField
        fullWidth
        placeholder="Password"
        type={showPassword ? 'text' : 'password'}
        margin="normal"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        onBlur={() => handleInputBlur('password')}
        error={touched.password && !!fieldErrors.password}
        helperText={touched.password && fieldErrors.password}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlined sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
            borderRadius: 2,
            '& fieldset': {
              borderColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            },
            '&:hover fieldset': {
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#e0e0e0',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 1.5 }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              size="small"
              sx={{
                color: isDarkMode
                  ? 'rgba(255, 255, 255, 0.5)'
                  : 'rgba(0, 0, 0, 0.6)',
                '&.Mui-checked': {
                  color: 'primary.main',
                },
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Remember me
            </Typography>
          }
        />
        <Link
          href="/forgot-password"
          underline="hover"
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >
          Forgot password?
        </Link>
      </Stack>

      <Fade in={!!error} timeout={300}>
        <Box mt={2}>{error && <Alert severity="error">{error}</Alert>}</Box>
      </Fade>

      <Fade in={success} timeout={300}>
        <Box mt={2}>
          {success && (
            <Alert severity="success">Login successful! Redirecting...</Alert>
          )}
        </Box>
      </Fade>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color={success ? 'success' : 'primary'}
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        }}
        disabled={loading || !isFormValid}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : success ? (
            <CheckCircleIcon />
          ) : null
        }
      >
        {loading ? 'Signing in...' : success ? 'Success!' : 'Login'}
      </Button>
    </Box>
  );
}
