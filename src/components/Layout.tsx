import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  alpha,
  Avatar,
  Chip,
  Badge,
  Stack,
  Tooltip,
} from "@mui/material";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Info,
  Quiz,
  Palette,
  Menu,
  Close,
  School,
  TrendingUp,
  Notifications,
  Search,
  Settings,
} from "@mui/icons-material";
import Sidebar from "./Sidebar";

const DRAWER_WIDTH = 280;
const APPBAR_HEIGHT = 70;

// Memoized navigation items to prevent recreations
const MENU_ITEMS = [
  { text: "Dashboard", path: "/", icon: <Home />, badge: null },
  { text: "About", path: "/about", icon: <Info />, badge: null },
  { text: "Create Quiz", path: "/create-quiz", icon: <Quiz />, badge: "New" },
  { text: "Themes", path: "/theme-demo", icon: <Palette />, badge: null },
];

// Memoized brand section component
const BrandSection = React.memo(() => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        p: 3,
        background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          filter: "blur(20px)",
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={1.5}>
          <Avatar
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              width: 36,
              height: 36,
              backdropFilter: "blur(10px)",
            }}
          >
            <School sx={{ color: "white", fontSize: 20 }} />
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Learni
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            opacity: 0.85,
            fontSize: "0.8rem",
            fontWeight: 300,
            display: "block",
            lineHeight: 1.2,
            pl: 6, // Align with the text above (36px avatar + 16px spacing)
          }}
        >
          Smart Learning Hub
        </Typography>
      </Box>
    </Box>
  );
});

// Memoized stats section
const StatsSection = React.memo(() => (
  <Box sx={{ p: 2.5, bgcolor: "background.paper" }}>
    <Stack spacing={1.5}>
      <Chip
        icon={<TrendingUp sx={{ fontSize: 14 }} />}
        label="85% Complete"
        size="small"
        color="primary"
        variant="outlined"
        sx={{ 
          fontSize: "0.75rem", 
          height: 22,
          alignSelf: "flex-start"
        }}
      />
      <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
        Keep up the momentum! 🚀
      </Typography>
    </Stack>
  </Box>
));


interface NavItemProps {
  item: {
    text: string;
    path: string;
    icon: React.ReactNode;
    badge: string | null;
  };
  isActive: boolean;
  onItemClick: () => void;
}

// Memoized navigation item
const NavItem = React.memo(({ item, isActive, onItemClick }: NavItemProps) => {
  const theme = useTheme();

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        component={Link}
        to={item.path}
        onClick={onItemClick}
        sx={{
          borderRadius: 2,
          minHeight: 44,
          px: 2,
          transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            transform: "translateX(4px)",
            "& .nav-icon": {
              color: theme.palette.primary.main,
              transform: "scale(1.1)",
            },
          },
          ...(isActive && {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: "20%",
              bottom: "20%",
              width: 3,
              backgroundColor: theme.palette.primary.main,
              borderRadius: "0 4px 4px 0",
            },
          }),
        }}
      >
        <ListItemIcon
          className="nav-icon"
          sx={{
            minWidth: 40,
            color: isActive 
              ? theme.palette.primary.main 
              : theme.palette.text.secondary,
            transition: "all 0.2s ease",
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isActive ? 600 : 500,
                  color: isActive 
                    ? theme.palette.primary.main 
                    : theme.palette.text.primary,
                  fontSize: "0.875rem",
                }}
              >
                {item.text}
              </Typography>
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  color="secondary"
                  sx={{
                    height: 16,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              )}
            </Stack>
          }
        />
      </ListItemButton>
    </ListItem>
  );
});

// Memoized user profile section
const UserProfile = React.memo(() => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        p: 2.5,
        mt: "auto",
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(10px)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} mb={1.5}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: theme.palette.primary.main,
            fontSize: "0.8rem",
            fontWeight: 700,
          }}
        >
          JD
        </Avatar>
        <Box flex={1}>
          <Typography variant="body2" fontWeight={600} fontSize="0.8rem">
            John Doe
          </Typography>
          <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
            Student
          </Typography>
        </Box>
        <Tooltip title="Settings">
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <Settings fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          opacity: 0.6,
          fontSize: "0.65rem",
          textAlign: "center",
          display: "block",
        }}
      >
        © 2025 Learni
      </Typography>
    </Box>
  );
});

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Memoized handlers to prevent unnecessary re-renders
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const handleItemClick = useCallback(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  // Memoized drawer content
  const drawerContent = useMemo(() => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <BrandSection />
      <StatsSection />
      <Divider sx={{ mx: 2, opacity: 0.2 }} />
      
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {MENU_ITEMS.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            onItemClick={handleItemClick}
          />
        ))}
      </List>

      <UserProfile />
    </Box>
  ), [location.pathname, handleItemClick]);

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

      <Sidebar/>

      {/* Enhanced Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${alpha(theme.palette.secondary.light, 0.05)} 0%, transparent 50%)
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