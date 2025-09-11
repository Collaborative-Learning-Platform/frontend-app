import { useState, useCallback } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  alpha,
  Stack,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, Close } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import { ThemeToggle } from "./Buttons/ThemeToggle";
import { NotificationsButton } from "./Buttons/NotificationsButton";
import { useAuth } from "../contexts/Authcontext";

const DRAWER_WIDTH = 280;
const APPBAR_HEIGHT = 70;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const {clearAuth } = useAuth();
  const navigate = useNavigate();
  // Memoized handlers to prevent unnecessary re-renders
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Modernized AppBar */}
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          background: `${alpha(theme.palette.background.paper, 0.8)}`,
          backdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          zIndex: theme.zIndex.drawer + 1,
          color: theme.palette.text.primary,
          height: APPBAR_HEIGHT,
        }}
      >
        <Toolbar sx={{ minHeight: `${APPBAR_HEIGHT}px !important`, px: 3 }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: "scale(1.05)",
                },
              }}
            >
              {mobileOpen ? <Close /> : <Menu />}
            </IconButton>
          )}

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.3rem",
            }}
          >
            Learni
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/*  header actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon fontSize="small" />
            </IconButton>
            <NotificationsButton size="small" badgeContent={3} />
            <ThemeToggle />
          </Stack>
        </Toolbar>
      </AppBar>

      <Sidebar />

      {/* Enhanced Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar sx={{ minHeight: `${APPBAR_HEIGHT}px !important` }} />
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: { xs: "100%", md: "1400px" }, // Full width on mobile, max width on desktop
            mx: { xs: 0, md: "auto" }, // No centering on mobile, auto-center on desktop
            width: "100%", // Ensure full width utilization
            flexGrow: 1, // Allow content to grow and fill available space
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
