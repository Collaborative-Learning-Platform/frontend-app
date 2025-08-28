import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Badge,
  Collapse,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  School,
  Analytics,
  Settings,
  ExpandLess,
  ExpandMore,
  Book,
  Quiz,
  VideoLibrary,
  Group,
  Assignment,
} from "@mui/icons-material";
import WorkspacesOutlineIcon from "@mui/icons-material/WorkspacesOutline";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 280;

const navigationItems = [
  {
    text: "Dashboard",
    icon: <Dashboard />,
    path: "/user-dashboard",
    active: true,
  },
  {
    text: "Workspaces",
    icon: <WorkspacesOutlineIcon />,
    path: "/user-workspaces",
    badge: 2,
    urgent: true,
  },
  {
    text: "Study Groups",
    icon: <Group />,
    path: "/study-groups",
  },
  {
    text: "Study Plans",
    icon: <Assignment />,
    path: "/study-plans",
  },
  {
    text: "Resources",
    icon: <VideoLibrary />,
    path: "/resources",
    subItems: [
      { text: "Video Library", icon: <VideoLibrary /> },
      { text: "Documents", icon: <Book /> },
      { text: "Practice Tests", icon: <Quiz /> },
    ],
  },
];

const bottomItems = [
  { text: "Analytics", icon: <Analytics />, path: "/analytics" },
  { text: "Settings", icon: <Settings />, path: "/settings" },
];

export default function UserSidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedItems, setExpandedItems] = useState<string[]>(["My Courses"]);
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleExpandClick = (item: string) => {
    setExpandedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleItemClick = (item: any) => {
    if (item.subItems) {
      handleExpandClick(item.text);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <School
          sx={{
            fontSize: { xs: 40, sm: 48 },
            mb: 1,
            opacity: 0.9,
          }}
        />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Learni
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
        <List sx={{ px: 2 }}>
          {navigationItems.map((item) => {
            const isActive =
              !!item.path && location.pathname.startsWith(item.path);
            return (
              <Box key={item.text}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleItemClick(item)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 48,
                      bgcolor: isActive
                        ? alpha(theme.palette.primary.main, 0.08)
                        : "transparent",
                      color: isActive ? "primary.main" : "text.primary",
                      "&:hover": {
                        bgcolor: isActive
                          ? alpha(theme.palette.primary.main, 0.12)
                          : alpha(theme.palette.action.hover, 0.04),
                      },
                      border: isActive
                        ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                        : "1px solid transparent",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: 40,
                        "& .MuiSvgIcon-root": { fontSize: 22 },
                      }}
                    >
                      {item.badge ? (
                        <Badge
                          badgeContent={item.badge}
                          color={item.urgent ? "error" : "primary"}
                          max={99}
                        >
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "0.9rem",
                      }}
                    />
                    {item.subItems &&
                      (expandedItems.includes(item.text) ? (
                        <ExpandLess sx={{ fontSize: 20 }} />
                      ) : (
                        <ExpandMore sx={{ fontSize: 20 }} />
                      ))}
                  </ListItemButton>
                </ListItem>

                {item.subItems && (
                  <Collapse
                    in={expandedItems.includes(item.text)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List disablePadding sx={{ pl: 2 }}>
                      {item.subItems.map((subItem) => (
                        <ListItem
                          key={subItem.text}
                          disablePadding
                          sx={{ mb: 0.5 }}
                        >
                          <ListItemButton
                            sx={{
                              borderRadius: 2,
                              minHeight: 40,
                              pl: 2,
                              "&:hover": {
                                bgcolor: alpha(
                                  theme.palette.action.hover,
                                  0.04
                                ),
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color: "text.secondary",
                                minWidth: 36,
                                "& .MuiSvgIcon-root": { fontSize: 18 },
                              }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={subItem.text}
                              primaryTypographyProps={{
                                fontSize: "0.85rem",
                                color: "text.secondary",
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>

        <Divider sx={{ mx: 2, my: 2 }} />

        <List sx={{ px: 2 }}>
          {bottomItems.map((item) => {
            const isActive =
              !!item.path && location.pathname.startsWith(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => item.path && navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    bgcolor: isActive
                      ? alpha(theme.palette.primary.main, 0.08)
                      : "transparent",
                    "&:hover": {
                      bgcolor: isActive
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.action.hover, 0.04),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "text.secondary",
                      minWidth: 40,
                      "& .MuiSvgIcon-root": { fontSize: 22 },
                    }}
                  >
                    {item.text === "Settings" ? (
                      <Badge badgeContent={1} color="warning" variant="dot">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      color: "text.secondary",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton onClick={handleDrawerToggle} sx={{ color: "text.primary" }}>
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? isMobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            boxShadow: "0 0 20px rgba(0,0,0,0.08)",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}
