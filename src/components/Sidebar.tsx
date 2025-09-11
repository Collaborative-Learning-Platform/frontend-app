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
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  School,
  Settings,
  Assignment,
  Quiz,
  Analytics,
  Group,
  Tune,
} from "@mui/icons-material";
import WorkspacesOutlineIcon from "@mui/icons-material/WorkspacesOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";

const drawerWidth = 280;

type Role = "user" | "tutor" | "admin";

interface NavItem {
  id?: string;
  text: string;
  icon: React.ReactNode;
  path?: string;
  pathByRole?: Partial<Record<Role, string>>;
  roles?: Role[];
  badgeKey?: string;
  urgent?: boolean;
  section?: "main" | "bottom";
}

const navConfig: NavItem[] = [
  {
    text: "Dashboard",
    icon: <Dashboard />,
    pathByRole: {
      user: "/user-dashboard",
      tutor: "/tutor-dashboard",
      admin: "/admin-dashboard",
    },
    roles: ["user", "tutor", "admin"],
    section: "main",
  },
  {
    text: "Workspaces",
    icon: <WorkspacesOutlineIcon />,
    path: "/user-workspaces",
    roles: ["user", "tutor"],
    badgeKey: "workspaces",
    urgent: true,
    section: "main",
  },
  {
    text: "Study Plans",
    icon: <Assignment />,
    path: "/study-plans",
    roles: ["user"],
    section: "main",
  },
  {
    text: "Flashcards",
    icon: <Quiz />,
    path: "/flashcard-generator",
    roles: ["user"],
    section: "main",
  },
  {
    text: "Documents",
    icon: <FileCopyIcon />,
    path: "/user-documents",
    roles: ["user"],
    section: "main",
  },
  {
    text: "Create Quiz",
    icon: <Quiz />,
    path: "/quiz",
    roles: ["tutor"],
    section: "main",
  },
  {
    text: "Quiz Analytics",
    icon: <Analytics />,
    path: "/tutor-analytics",
    roles: ["tutor"],
    section: "main",
  },
  {
    text: "User Management",
    icon: <Group />,
    path: "/admin-users",
    roles: ["admin"],
    section: "main",
  },
  {
    text: "Workspace Management",
    icon: <WorkspacesOutlineIcon />,
    path: "/admin-workspaces",
    badgeKey: "adminWorkspaces",
    urgent: true,
    roles: ["admin"],
    section: "main",
  },
  {
    text: "Analytics",
    icon: <Analytics />,
    path: "/admin-analytics",
    roles: ["admin"],
    section: "main",
  },

  {
    text: "Settings",
    icon: <Settings />,
    path: "/settings",
    roles: ["user", "tutor"],
    section: "bottom",
  },
  {
    text: "System Settings",
    icon: <Tune />,
    path: "/admin-settings",
    roles: ["admin"],
    section: "bottom",
  },
  {
    text: "User Profile",
    icon: <AccountCircleIcon />,
    path: "/user-profile",
    roles: ["user", "tutor", "admin"],
    section: "bottom",
  },
];

function resolveNavItems(
  config: NavItem[],
  role?: string | null,
  badgeCounts: Record<string, number> = {}
) {
  const roleTyped = (role as Role) || undefined;
  return config
    .filter(
      (item) =>
        !item.roles || (roleTyped ? item.roles.includes(roleTyped) : true)
    )
    .map((item) => ({
      ...item,
      path:
        item.path ?? item.pathByRole?.[roleTyped as Role] ?? item.path ?? "/",
      badge: item.badgeKey ? badgeCounts[item.badgeKey] ?? 0 : undefined,
    }));
}

export default function Sidebar() {
  const theme = useTheme();
  const { role } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleItemClick = (item: any) => {
    if (item.path) navigate(item.path);
  };

  // badgeCounts: ideally from context or API; falling back to current hard-coded values
  const badgeCounts: Record<string, number> = {
    workspaces: 2,
    adminWorkspaces: 3,
  };

  const resolved = resolveNavItems(navConfig, role, badgeCounts);
  const filteredNavigationItems = resolved.filter(
    (i) => i.section !== "bottom"
  );
  const filteredBottomItems = resolved.filter((i) => i.section === "bottom");

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
            color: theme.palette.primary.main,
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
          {filteredNavigationItems.map((item) => {
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
                  </ListItemButton>
                </ListItem>
              </Box>
            );
          })}
        </List>
      </Box>

      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mx: 2, my: 2 }} />

        <List sx={{ px: 2 }}>
          {filteredBottomItems.map((item) => {
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
    <Box>
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
    </Box>
  );
}
