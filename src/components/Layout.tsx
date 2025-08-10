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
  Badge,
  Stack,
  Tooltip,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { Menu, Close, Notifications, Search } from "@mui/icons-material";
import Sidebar from "./Sidebar";

const DRAWER_WIDTH = 280;
const APPBAR_HEIGHT = 70;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Memoized handlers to prevent unnecessary re-renders
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

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

          {/* Modern header actions */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="Search">
              <IconButton size="small">
                <Search />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton size="small">
                <Badge badgeContent={3} color="error" variant="dot">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
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
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${alpha(
              theme.palette.primary.light,
              0.05
            )} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${alpha(
              theme.palette.secondary.light,
              0.05
            )} 0%, transparent 50%)
          `,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: `${APPBAR_HEIGHT}px !important` }} />
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: "1400px",
            mx: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
