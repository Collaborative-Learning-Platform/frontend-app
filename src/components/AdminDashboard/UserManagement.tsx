import React, { useState } from "react";
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
} from "@mui/material";
import {
  Search as SearchIcon,
  PersonAdd as UserPlusIcon,
  MoreHoriz as MoreHorizontalIcon,
  Mail as MailIcon,
  Security as ShieldIcon,
  School as GraduationCapIcon,
} from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@university.edu",
      role: "Student",
      status: "Active",
      joinDate: "2024-01-15",
      workspaces: 3,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "m.chen@university.edu",
      role: "Tutor",
      status: "Active",
      joinDate: "2023-09-01",
      workspaces: 8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "e.rodriguez@university.edu",
      role: "Student",
      status: "Inactive",
      joinDate: "2024-02-20",
      workspaces: 2,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <ShieldIcon sx={{ fontSize: 16 }} />;
      case "Tutor":
        return <GraduationCapIcon sx={{ fontSize: 16 }} />;
      default:
        return <MailIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getRoleColor = (role: string): "error" | "primary" | "default" => {
    switch (role) {
      case "Admin":
        return "error";
      case "Tutor":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ py: 3 }}>
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
        <Button variant="contained" startIcon={<UserPlusIcon />}>
          Add User
        </Button>
      </Box>

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

      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardHeader
            title={`All Users (${users.length})`}
            subheader="Complete list of platform users"
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {users.map((user) => (
                <Paper
                  key={user.id}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
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
                      <Avatar>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
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
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {user.email}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Joined: {user.joinDate}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Workspaces: {user.workspaces}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={user.status}
                        size="small"
                        color={user.status === "Active" ? "primary" : "default"}
                        variant={
                          user.status === "Active" ? "filled" : "outlined"
                        }
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

      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardHeader
            title="Students"
            subheader="Manage student accounts and permissions"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Student management interface would be here...
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardHeader
            title="Tutors"
            subheader="Manage tutor accounts and workspace assignments"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Tutor management interface would be here...
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardHeader
            title="Administrators"
            subheader="Manage admin privileges and system access"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Admin management interface would be here...
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
}
