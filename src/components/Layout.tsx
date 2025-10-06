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
        position="fixed"
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
        <Toolbar sx={{ 
          minHeight: `${APPBAR_HEIGHT}px !important`, 
          px: { xs: 2, sm: 3 },
          gap: { xs: 1, sm: 2 } 
        }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: { xs: 1, sm: 2 },
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
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              display: { xs: isMobile && mobileOpen ? "none" : "block", sm: "block" },
            }}
          >
            Learni
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/*  header actions */}
          <Stack 
            direction="row" 
            spacing={{ xs: 0.5, sm: 1 }} 
            alignItems="center"
            sx={{ minWidth: 0 }} // Allow shrinking
          >
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              size={isMobile ? "small" : "medium"}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
            <NotificationsButton 
              size="small" 
              badgeContent={3} 
            />
            <ThemeToggle />
          </Stack>
        </Toolbar>
      </AppBar>

      <Sidebar 
        mobileOpen={mobileOpen} 
        onToggle={handleDrawerToggle} 
        isMobile={isMobile}
      />

      {/* Enhanced Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          width: "100%",
        }}
      >
        <Toolbar sx={{ minHeight: `${APPBAR_HEIGHT}px !important` }} />
        <Box
          sx={{
            p: { xs: 1, sm: 2, md: 3, lg: 4 },
            width: "100%",
            maxWidth: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden", // Prevent horizontal overflow
            minHeight: 0, // Allow content to shrink
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
