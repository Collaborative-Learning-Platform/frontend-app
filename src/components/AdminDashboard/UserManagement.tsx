import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Chip,
  Avatar,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Paper,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  PersonAdd as UserPlusIcon,
  MoreHoriz as MoreHorizontalIcon,
  Mail as MailIcon,
  Security as ShieldIcon,
  School as GraduationCapIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };


  const handleAddUser = () => {
    navigate("/add-users");
  };



  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/auth/users");
      if (res.data.success) {
        setUsers(res.data.users);
        console.log("Fetched users:", res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on tab & search
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    switch (activeTab) {
      case 1:
        return user.role.toLowerCase() === "student";
      case 2:
        return user.role.toLowerCase() === "tutor";
      case 3:
        return user.role.toLowerCase() === "admin";
      default:
        return true;
    }
  });

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <ShieldIcon sx={{ fontSize: 16 }} />;
      case "tutor":
        return <GraduationCapIcon sx={{ fontSize: 16 }} />;
      default:
        return <MailIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "error";
      case "tutor":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage students, tutors, and administrators
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<UserPlusIcon /> } onClick={handleAddUser}>
          Add Users
        </Button>
      </Box>

      {/* Tabs + Search */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
            mb: 2,
          }}
        >
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="All Users" />
            <Tab label="Students" />
            <Tab label="Tutors" />
            <Tab label="Admins" />
          </Tabs>
          <TextField
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: { xs: "100%", sm: 256 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* User List */}
      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardHeader
            title={`All Users (${users.length})`}
            subheader="Complete list of platform users"
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height={72}
                      sx={{ borderRadius: 2 }}
                    />
                  ))
                : filteredUsers.map((user) => (
                    <Paper
                      key={user.id}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        transition: "all 0.2s",
                        "&:hover": { boxShadow: 3 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar src={user.avatar} sx={{ bgcolor: "primary.main", color: "white" }}>
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </Avatar>
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body1" fontWeight="medium">
                                {user.name}
                              </Typography>
                              <Chip
                                icon={getRoleIcon(user.role)}
                                label={user.role}
                                size="small"
                                color={getRoleColor(user.role)}
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                Joined: {user.joinDate}
                              </Typography>
                              {user.workspaces && (
                                <Typography variant="caption" color="text.secondary">
                                  Workspaces: {user.workspaces}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip
                            label={user.status || "Active"}
                            size="small"
                            color={
                              user.status === "Active" ? "primary" : "default"
                            }
                            variant={user.status === "Active" ? "filled" : "outlined"}
                          />
                          <IconButton size="small">
                            <MoreHorizontalIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Other Tabs: Students / Tutors / Admins */}
      {[1, 2, 3].map((tabIndex) => (
        <TabPanel key={tabIndex} value={activeTab} index={tabIndex}>
          <Card>
            <CardHeader
              title={
                tabIndex === 1
                  ? "Students"
                  : tabIndex === 2
                  ? "Tutors"
                  : "Administrators"
              }
              subheader={
                tabIndex === 1
                  ? "Manage student accounts"
                  : tabIndex === 2
                  ? "Manage tutor accounts"
                  : "Manage admin privileges"
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {filteredUsers.filter((u) => {
                  if (tabIndex === 1) return u.role.toLowerCase() === "student";
                  if (tabIndex === 2) return u.role.toLowerCase() === "tutor";
                  if (tabIndex === 3) return u.role.toLowerCase() === "admin";
                  return false;
                }).length
                  ? "User list shown above."
                  : "No users found for this role."}
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>
      ))}
    </Box>
  );
}
