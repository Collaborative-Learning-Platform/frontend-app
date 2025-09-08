// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Button,
//   Checkbox,
//   Container,
//   CssBaseline,
//   FormControlLabel,
//   TextField,
//   Typography,
//   Box,
//   Paper,
//   Link,
//   IconButton,
//   InputAdornment,
//   useTheme,
//   useMediaQuery,
//   Alert,
//   Fade,
//   CircularProgress,
// } from "@mui/material";
// import {
//   Visibility,
//   VisibilityOff,
//   School as SchoolIcon,
//   CheckCircle as CheckCircleIcon,
// } from "@mui/icons-material";
// import axiosInstance from "../../api/axiosInstance";
// import { useAuth } from "../../contexts/Authcontext";

// // Validation functions
// const validateEmail = (email: string): string => {
//   if (!email) return "Email is required";
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) return "Please enter a valid email address";
//   return "";
// };

// const validatePassword = (password: string): string => {
//   if (!password) return "Password is required";
//   if (password.length < 8) return "Password must be at least 8 characters";
//   return "";
// };

// export default function SignInPage() {
//   const [showPassword, setShowPassword] = React.useState(false);
//   const [error, setError] = React.useState<string>("");
//   const [loading, setLoading] = React.useState<boolean>(false);
//   const [success, setSuccess] = React.useState<boolean>(false);

//   const [formData, setFormData] = React.useState({
//     email: "",
//     password: "",
//   });

//   const [fieldErrors, setFieldErrors] = React.useState({
//     email: "",
//     password: "",
//   });

//   const [touched, setTouched] = React.useState({
//     email: false,
//     password: false,
//   });

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const navigate = useNavigate();
//   const { setAuth } = useAuth();

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     setError("");

//     if (touched[field as keyof typeof touched]) {
//       validateField(field, value);
//     }
//   };

//   const handleInputBlur = (field: string) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//     validateField(field, formData[field as keyof typeof formData]);
//   };

//   const validateField = (field: string, value: string) => {
//     let errorMessage = "";

//     switch (field) {
//       case "email":
//         errorMessage = validateEmail(value);
//         break;
//       case "password":
//         errorMessage = validatePassword(value);
//         break;
//     }

//     setFieldErrors((prev) => ({ ...prev, [field]: errorMessage }));
//     return errorMessage === "";
//   };

//   const validateForm = (): boolean => {
//     const emailError = validateEmail(formData.email);
//     const passwordError = validatePassword(formData.password);

//     setFieldErrors({
//       email: emailError,
//       password: passwordError,
//     });

//     setTouched({
//       email: true,
//       password: true,
//     });

//     return !emailError && !passwordError;
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       setError("Please fix the errors above");
//       return;
//     }

//     setError("");
//     setSuccess(false);
//     setLoading(true);

//     try {
//       const response = await axiosInstance.post("/auth/login", {
//         email: formData.email,
//         password: formData.password,
//       });

//       console.log(response);

//       if (response.data.success) {
//         setAuth(response.data.role, response.data.user_id);
//         setSuccess(true);

//         setTimeout(() => {
//           if (response.data.role === "user") {
//             navigate("/user-dashboard");
//           } else if (response.data.role === "admin") {
//             navigate("/admin-dashboard");
//           } else if (response.data.role === "tutor") {
//             navigate("/tutor-dashboard");
//           }
//         }, 1000);
//       } else {
//         setError("Login failed. Please check your credentials.");
//       }
//     } catch (error: any) {
//       console.error("Login error:", error);

//       // Handle different types of errors
//       if (error.response) {
//         const status = error.response.status;
//         const message =
//           error.response.data?.message || error.response.data?.error;

//         if (status === 401) {
//           setError("Invalid email or password. Please try again.");
//         } else if (status === 400) {
//           setError("Invalid credentials. Please try again.");
//         } else if (status === 404) {
//           setError("User not found. Please check your email.");
//         } else if (status >= 500) {
//           setError("Server error. Please try again later.");
//         } else if (message) {
//           setError(message);
//         } else {
//           setError("Login failed. Please try again.");
//         }
//       } else if (error.request) {
//         setError("Network error. Please check your connection and try again.");
//       } else {
//         setError("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const isFormValid =
//     !fieldErrors.email &&
//     !fieldErrors.password &&
//     formData.email &&
//     formData.password;

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: { xs: 1, sm: 2, md: 3 },
//         backgroundImage: {
//           xs: "none",
//           sm: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[200]} 100%)`,
//         },
//         backgroundColor: {
//           xs: theme.palette.background.default,
//           sm: "transparent",
//         },
//       }}
//     >
//       <Container
//         component="main"
//         maxWidth={false}
//         sx={{
//           maxWidth: { xs: "100%", sm: "70%", md: "35%" },
//           px: { xs: 0, sm: 2 },
//         }}
//       >
//         <CssBaseline />
//         <Paper
//           elevation={isMobile ? 0 : 12}
//           sx={{
//             borderRadius: { xs: 0, sm: 3 },
//             overflow: "hidden",
//             background: theme.palette.background.paper,
//             backdropFilter: { xs: "none", sm: "blur(10px)" },
//             minHeight: { xs: "100vh", sm: "auto" },
//             display: "flex",
//             flexDirection: "column",
//             transition: "all 0.3s ease-in-out",
//             ...(success && {
//               border: `2px solid ${theme.palette.success.main}`,
//               boxShadow: `0 0 20px ${theme.palette.success.main}40`,
//             }),
//           }}
//         >
//           <Box
//             sx={{
//               background: success
//                 ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
//                 : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//               color: theme.palette.common.white,
//               textAlign: "center",
//               py: { xs: 3, sm: 4 },
//               px: { xs: 2, sm: 3 },
//               transition: "all 0.5s ease-in-out",
//             }}
//           >
//             {success ? (
//               <Fade in={success} timeout={500}>
//                 <CheckCircleIcon
//                   sx={{
//                     fontSize: { xs: 40, sm: 48 },
//                     mb: 1,
//                     opacity: 0.9,
//                   }}
//                 />
//               </Fade>
//             ) : (
//               <SchoolIcon
//                 sx={{
//                   fontSize: { xs: 40, sm: 48 },
//                   mb: 1,
//                   opacity: 0.9,
//                 }}
//               />
//             )}
//             <Typography
//               component="h1"
//               variant={isMobile ? "h5" : "h4"}
//               sx={{
//                 fontWeight: "bold",
//                 letterSpacing: 1,
//                 fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
//               }}
//             >
//               {success ? "Welcome!" : "Learni"}
//             </Typography>
//             <Typography
//               variant={isMobile ? "body2" : "subtitle1"}
//               sx={{
//                 opacity: 0.9,
//                 mt: 0.5,
//                 fontSize: { xs: "0.875rem", sm: "1rem" },
//               }}
//             >
//               {success
//                 ? "Login successful! Redirecting..."
//                 : "Welcome back to your learning journey"}
//             </Typography>
//           </Box>

//           {/* Form */}
//           <Box
//             sx={{
//               p: { xs: 2, sm: 3, md: 4 },
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               flex: 1,
//               justifyContent: { xs: "flex-start", sm: "center" },
//             }}
//           >
//             <Box
//               component="form"
//               onSubmit={handleSubmit}
//               noValidate
//               sx={{
//                 width: "100%",
//                 maxWidth: { xs: "100%", sm: "400px" },
//               }}
//             >
//               {/* Email Field */}
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email"
//                 name="email"
//                 autoComplete="email"
//                 autoFocus
//                 variant="outlined"
//                 size="medium"
//                 disabled={loading || success}
//                 value={formData.email}
//                 error={touched.email && !!fieldErrors.email}
//                 helperText={touched.email && fieldErrors.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 onBlur={() => handleInputBlur("email")}
//                 sx={{
//                   mb: { xs: 2, sm: 1 },
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     backgroundColor: theme.palette.action.hover,
//                     transition: "all 0.3s ease",
//                     "&:hover": {
//                       backgroundColor: theme.palette.action.selected,
//                     },
//                     "&.Mui-focused": {
//                       backgroundColor: theme.palette.background.paper,
//                       boxShadow: theme.shadows[4],
//                     },
//                     "&.Mui-disabled": {
//                       backgroundColor: theme.palette.action.disabledBackground,
//                     },
//                   },
//                 }}
//               />

//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 autoComplete="current-password"
//                 variant="outlined"
//                 size="medium"
//                 disabled={loading || success}
//                 value={formData.password}
//                 error={touched.password && !!fieldErrors.password}
//                 helperText={touched.password && fieldErrors.password}
//                 onChange={(e) => handleInputChange("password", e.target.value)}
//                 onBlur={() => handleInputBlur("password")}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={handleClickShowPassword}
//                         edge="end"
//                         size={isMobile ? "large" : "medium"}
//                         disabled={loading || success}
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{
//                   mb: { xs: 2, sm: 1 },
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                     backgroundColor: theme.palette.action.hover,
//                     transition: "all 0.3s ease",
//                     "&:hover": {
//                       backgroundColor: theme.palette.action.selected,
//                     },
//                     "&.Mui-focused": {
//                       backgroundColor: theme.palette.background.paper,
//                       boxShadow: theme.shadows[4],
//                     },
//                     "&.Mui-disabled": {
//                       backgroundColor: theme.palette.action.disabledBackground,
//                     },
//                   },
//                 }}
//               />

//               <Fade in={!!error} timeout={300}>
//                 <Box sx={{ mb: 2 }}>
//                   {error && (
//                     <Alert
//                       severity="error"
//                       onClose={() => setError("")}
//                       sx={{
//                         borderRadius: 2,
//                         "& .MuiAlert-message": {
//                           fontSize: "0.875rem",
//                         },
//                       }}
//                     >
//                       {error}
//                     </Alert>
//                   )}
//                 </Box>
//               </Fade>

//               {/* Success Message */}
//               <Fade in={success} timeout={300}>
//                 <Box sx={{ mb: 2 }}>
//                   {success && (
//                     <Alert
//                       severity="success"
//                       sx={{
//                         borderRadius: 2,
//                         "& .MuiAlert-message": {
//                           fontSize: "0.875rem",
//                         },
//                       }}
//                     >
//                       Login successful! Redirecting to your dashboard...
//                     </Alert>
//                   )}
//                 </Box>
//               </Fade>

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "baseline",
//                   flexDirection: { xs: "column", sm: "row" },
//                   gap: { xs: 2, sm: 0 },
//                   mt: 1,
//                 }}
//               >
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       name="remember"
//                       color="primary"
//                       size={isMobile ? "medium" : "small"}
//                       disabled={loading || success}
//                     />
//                   }
//                   label={<Typography variant="body2">Remember me</Typography>}
//                 />
//                 <Link
//                   href="#"
//                   variant="body2"
//                   sx={{
//                     color: theme.palette.primary.main,
//                     fontWeight: 500,
//                     "&:hover": { textDecoration: "underline" },
//                     ...((loading || success) && {
//                       pointerEvents: "none",
//                       opacity: 0.5,
//                     }),
//                   }}
//                 >
//                   Forgot password?
//                 </Link>
//               </Box>

//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 size="large"
//                 disabled={loading || success || !isFormValid}
//                 sx={{
//                   mt: 2,
//                   py: { xs: 2, sm: 1.5 },
//                   borderRadius: 2,
//                   fontWeight: "bold",
//                   textTransform: "none",
//                   background: success
//                     ? theme.palette.success.main
//                     : theme.palette.primary.main,
//                   boxShadow: theme.shadows[4],
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     background: success
//                       ? theme.palette.success.dark
//                       : theme.palette.primary.dark,
//                     boxShadow: theme.shadows[6],
//                     transform: "translateY(-1px)",
//                   },
//                   "&:disabled": {
//                     backgroundColor: loading
//                       ? theme.palette.primary.main
//                       : theme.palette.action.disabledBackground,
//                     color: loading
//                       ? theme.palette.primary.contrastText
//                       : theme.palette.action.disabled,
//                   },
//                 }}
//                 startIcon={
//                   loading ? (
//                     <CircularProgress size={20} color="inherit" />
//                   ) : success ? (
//                     <CheckCircleIcon />
//                   ) : null
//                 }
//               >
//                 {loading ? "Signing in..." : success ? "Success!" : "Login"}
//               </Button>
//             </Box>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }
// SignInPage.tsx
import React from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Fade,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../contexts/Authcontext";
import { useNavigate } from "react-router-dom";

// Validation functions
const validateEmail = (email: string) => {
  if (!email) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Please enter a valid email";
  return "";
};

const validatePassword = (password: string) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return "";
};

export default function SignInPage() {
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = React.useState({ email: "", password: "" });
  const [touched, setTouched] = React.useState({ email: false, password: false });
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field as keyof typeof touched]) validateField(field, value);
  };

  const handleInputBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = (field: string, value: string) => {
    let errorMessage = "";
    if (field === "email") errorMessage = validateEmail(value);
    else if (field === "password") errorMessage = validatePassword(value);

    setFieldErrors((prev) => ({ ...prev, [field]: errorMessage }));
    return errorMessage === "";
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setFieldErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });
    return !emailError && !passwordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Please fix the errors above");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await axiosInstance.post("/auth/login", formData);
      if (response.data.success) {
        setAuth(response.data.role, response.data.user_id);
        setSuccess(true);

        setTimeout(() => {
          if (response.data.role === "user") navigate("/user-dashboard");
          else if (response.data.role === "admin") navigate("/admin-dashboard");
          else if (response.data.role === "tutor") navigate("/tutor-dashboard");
        }, 1000);
      } else {
        setError("Login failed. Check your credentials.");
      }
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message || err.response.data?.error;
        if (status === 401) setError("Invalid email or password.");
        else if (status === 404) setError("User not found.");
        else if (status >= 500) setError("Server error. Try again later.");
        else if (msg) setError(msg);
        else setError("Login failed. Try again.");
      } else if (err.request) setError("Network error. Check your connection.");
      else setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !fieldErrors.email && !fieldErrors.password && formData.email && formData.password;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }} noValidate>
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        onBlur={() => handleInputBlur("email")}
        error={touched.email && !!fieldErrors.email}
        helperText={touched.email && fieldErrors.email}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        margin="normal"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        onBlur={() => handleInputBlur("password")}
        error={touched.password && !!fieldErrors.password}
        helperText={touched.password && fieldErrors.password}
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

      <Fade in={!!error} timeout={300}>
        <Box mt={2}>{error && <Alert severity="error">{error}</Alert>}</Box>
      </Fade>

      <Fade in={success} timeout={300}>
        <Box mt={2}>{success && <Alert severity="success">Login successful! Redirecting...</Alert>}</Box>
      </Fade>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color={success ? "success" : "primary"}
        sx={{ mt: 3 }}
        disabled={loading || !isFormValid}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : success ? <CheckCircleIcon /> : null}
      >
        {loading ? "Signing in..." : success ? "Success!" : "Login"}
      </Button>
    </Box>
  );
}
