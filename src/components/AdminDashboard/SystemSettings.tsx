import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Switch,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Paper,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Shield as ShieldIcon,
  Storage as DatabaseIcon,
  Mail as MailIcon,
  Notifications as BellIcon,
  Language as GlobeIcon,
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

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure platform settings and preferences
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="General" />
          <Tab label="Security" />
          <Tab label="Notifications" />
          <Tab label="Integrations" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card>
            <CardHeader
              avatar={<SettingsIcon />}
              title="Platform Configuration"
              subheader="Basic platform settings and preferences"
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Platform Name"
                    defaultValue="EduPlatform"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Admin Email"
                    defaultValue="admin@eduplatform.com"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Allow Public Registration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enable users to register without invitation
                    </Typography>
                  </Box>
                  <Switch defaultChecked />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Require Email Verification
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Users must verify email before accessing platform
                    </Typography>
                  </Box>
                  <Switch defaultChecked />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Enable Dark Mode
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Allow users to switch to dark theme
                    </Typography>
                  </Box>
                  <Switch defaultChecked />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Content Limits"
              subheader="Set limits for user-generated content"
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Max File Size (MB)"
                    type="number"
                    defaultValue="50"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Max Groups per User"
                    type="number"
                    defaultValue="10"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Max Workspaces per Tutor"
                    type="number"
                    defaultValue="5"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card>
            <CardHeader
              avatar={<ShieldIcon />}
              title="Security Settings"
              subheader="Configure security policies and authentication"
            />
            <CardContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Two-Factor Authentication
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Require 2FA for admin accounts
                    </Typography>
                  </Box>
                  <Switch defaultChecked />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Session Timeout
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Auto-logout inactive users
                    </Typography>
                  </Box>
                  <Switch defaultChecked />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      IP Whitelist
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Restrict access to specific IP ranges
                    </Typography>
                  </Box>
                  <Switch />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Session Duration (hours)"
                    type="number"
                    defaultValue="8"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Min Password Length"
                    type="number"
                    defaultValue="8"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Data Protection"
              subheader="Privacy and data handling settings"
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Data Encryption
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Encrypt sensitive data at rest
                    </Typography>
                  </Box>
                  <Chip label="Enabled" color="primary" />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Audit Logging
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Log all admin actions
                    </Typography>
                  </Box>
                  <Chip label="Active" color="primary" />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      GDPR Compliance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enable data export and deletion
                    </Typography>
                  </Box>
                  <Switch defaultChecked />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardHeader
            avatar={<BellIcon />}
            title="Notification Settings"
            subheader="Configure system notifications and alerts"
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    Email Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Send email alerts for important events
                  </Typography>
                </Box>
                <Switch defaultChecked />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    System Alerts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notify admins of system issues
                  </Typography>
                </Box>
                <Switch defaultChecked />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    User Activity Digest
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Weekly summary of platform activity
                  </Typography>
                </Box>
                <Switch defaultChecked />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardHeader
            avatar={<GlobeIcon />}
            title="External Integrations"
            subheader="Manage third-party service connections"
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Paper sx={{ p: 2, border: 1, borderColor: "divider" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{ bgcolor: "primary.light", color: "primary.main" }}
                    >
                      <MailIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Email Service
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SMTP configuration for notifications
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label="Connected" color="primary" />
                </Box>
              </Paper>

              <Paper sx={{ p: 2, border: 1, borderColor: "divider" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{ bgcolor: "success.light", color: "success.main" }}
                    >
                      <DatabaseIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Database Backup
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Automated backup service
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label="Active" color="primary" />
                </Box>
              </Paper>

              <Paper sx={{ p: 2, border: 1, borderColor: "divider" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{ bgcolor: "warning.light", color: "warning.main" }}
                    >
                      <GlobeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Analytics Service
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Third-party analytics integration
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label="Disconnected" color="default" />
                </Box>
              </Paper>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined">Reset to Defaults</Button>
        <Button variant="contained">Save Changes</Button>
      </Box>
    </Box>
  );
}
