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


interface User{
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate?: string;
  avatar?: string;
  
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
  const [users, setUsers] = useState<Array<User>>([]);
  const [loading, setLoading] = useState(true);
  const [profilePicCache, setProfilePicCache] = useState<Record<string, string>>({});
  const navigate = useNavigate();


  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };


  const handleAddUser = () => {
    navigate("/add-users");
  };


  // Fetch profile picture for a single user (non-blocking)
  const fetchProfilePicture = async (userId: string) => {
    try {
      const response = await axiosInstance.post('/storage/generate-profile-pic-download-url', {
        userId: userId
      });
      if (response.data.downloadUrl) {
        setProfilePicCache(prev => ({
          ...prev,
          [userId]: response.data.downloadUrl
        }));
      }
    } catch (error) {
      console.error(`Error fetching profile picture for user ${userId}:`, error);
    }
  };


  const fetchAllProfilePictures = async (userList: User[]) => {
    const promises = userList.map(user => fetchProfilePicture(user.id));
    Promise.allSettled(promises);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/auth/users");
      console.log("API Response:", res.data);
      if (res.data.success) {
        setUsers(res.data.users);
        setLoading(false);
        
        fetchAllProfilePictures(res.data.users);
      } else {
        console.error("API request failed:", res.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    switch (activeTab) {
      case 1:
        const isStudent = user.role?.toLowerCase() === "user";
        return isStudent;
      case 2:
        const isTutor = user.role?.toLowerCase() === "tutor";
        return isTutor;
      case 3:
        const isAdmin = user.role?.toLowerCase() === "admin";
        return isAdmin;
      default:
        return true;
    }
  });



  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <ShieldIcon sx={{ fontSize: 16 }} />;
      case "tutor":
        return <GraduationCapIcon sx={{ fontSize: 16 }} />;
      case "user":
        return <MailIcon sx={{ fontSize: 16 }} />;
      default:
        return <MailIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getDisplayRole = (role: string) => {
    if (role?.toLowerCase() === "user") {
      return "Student";
    }
    // Capitalize first letter for other roles
    if (role) {
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }
    return "Unknown";
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "error";
      case "tutor":
        return "primary";
      case "user":
        return "success";
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
                          <Avatar 
                            src={profilePicCache[user.id] || user.avatar} 
                            sx={{ bgcolor: "primary.main", color: "white" }}
                          >
                            {user.name
                              ? user.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "U"}
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
                                label={getDisplayRole(user.role)}
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
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

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
                  ? `Students (${filteredUsers.filter((u) => u.role?.toLowerCase() === "user").length})`
                  : tabIndex === 2
                  ? `Tutors (${filteredUsers.filter((u) => u.role?.toLowerCase() === "tutor").length})`
                  : `Administrators (${filteredUsers.filter((u) => u.role?.toLowerCase() === "admin").length})`
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
                  : filteredUsers.filter((u) => {
                      if (tabIndex === 1) return u.role?.toLowerCase() === "user";
                      if (tabIndex === 2) return u.role?.toLowerCase() === "tutor";
                      if (tabIndex === 3) return u.role?.toLowerCase() === "admin";
                      return false;
                    }).length > 0
                    ? filteredUsers.filter((u) => {
                        if (tabIndex === 1) return u.role?.toLowerCase() === "user";
                        if (tabIndex === 2) return u.role?.toLowerCase() === "tutor";
                        if (tabIndex === 3) return u.role?.toLowerCase() === "admin";
                        return false;
                      }).map((user) => (
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
                              <Avatar 
                                src={profilePicCache[user.id] || user.avatar} 
                                sx={{ bgcolor: "primary.main", color: "white" }}
                              >
                                {user.name
                                  ? user.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  : "U"}
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
                                    {user.name || "Unknown User"}
                                  </Typography>
                                  <Chip
                                    icon={getRoleIcon(user.role)}
                                    label={getDisplayRole(user.role)}
                                    size="small"
                                    color={getRoleColor(user.role)}
                                    variant="outlined"
                                  />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {user.email || "No email provided"}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Joined: {user.joinDate || "N/A"}
                                  </Typography>
                                  
                                </Box>
                              </Box>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                              <IconButton size="small">
                                <MoreHorizontalIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Paper>
                      ))
                    : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        No users found for this role.
                      </Typography>
                    )}
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      ))}
    </Box>
  );
}
