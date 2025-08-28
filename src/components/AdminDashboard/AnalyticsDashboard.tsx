import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  BarChart as BarChart3Icon,
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

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const performanceMetrics = [
    {
      title: "User Engagement",
      value: "87%",
      change: "+5%",
      trend: "up",
      description: "Daily active users",
    },
    {
      title: "Quiz Completion",
      value: "92%",
      change: "+8%",
      trend: "up",
      description: "Average completion rate",
    },
    {
      title: "Study Time",
      value: "4.2h",
      change: "-2%",
      trend: "down",
      description: "Average per student",
    },
    {
      title: "Group Activity",
      value: "156",
      change: "+12%",
      trend: "up",
      description: "Messages per day",
    },
  ];

  const topWorkspaces = [
    { name: "Computer Science Fundamentals", students: 67, engagement: 94 },
    { name: "Advanced Mathematics", students: 45, engagement: 89 },
    { name: "Physics Laboratory", students: 32, engagement: 87 },
    { name: "Chemistry Basics", students: 28, engagement: 85 },
    { name: "Biology Research", students: 23, engagement: 82 },
  ];

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
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor platform performance and user engagement
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined">Export Report</Button>
          <Button variant="contained">Generate Insights</Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="User Engagement" />
          <Tab label="Learning Performance" />
          <Tab label="Content Analytics" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Performance Metrics */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {performanceMetrics.map((metric, index) => (
              <Box
                key={index}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    sm: "1 1 calc(50% - 8px)",
                    lg: "1 1 calc(25% - 12px)",
                  },
                }}
              >
                <Card>
                  <CardHeader
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pb: 1,
                    }}
                    title={
                      <Typography variant="body2" fontWeight="medium">
                        {metric.title}
                      </Typography>
                    }
                    action={
                      metric.trend === "up" ? (
                        <TrendingUp
                          sx={{ color: "success.main", fontSize: 20 }}
                        />
                      ) : (
                        <TrendingDown
                          sx={{ color: "error.main", fontSize: 20 }}
                        />
                      )
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {metric.value}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            metric.trend === "up"
                              ? "success.main"
                              : "error.main",
                        }}
                      >
                        {metric.change}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        from last week
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {metric.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {/* Charts and Detailed Analytics */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardHeader
                  title="Top Performing Workspaces"
                  subheader="Ranked by student engagement"
                />
                <CardContent>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {topWorkspaces.map((workspace, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "primary.light",
                              color: "primary.main",
                              fontSize: "0.875rem",
                            }}
                          >
                            {index + 1}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {workspace.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {workspace.students} students
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={`${workspace.engagement}%`}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Card>
                <CardHeader
                  title="Activity Timeline"
                  subheader="Platform usage over the last 7 days"
                />
                <CardContent>
                  <Box
                    sx={{
                      height: 256,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Box>
                      <BarChart3Icon
                        sx={{
                          fontSize: 48,
                          opacity: 0.5,
                          color: "text.secondary",
                          mb: 2,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Interactive chart would be displayed here
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Showing user activity, quiz completions, and engagement
                        metrics
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Recent Insights */}
          <Card>
            <CardHeader
              title="Recent Insights"
              subheader="AI-generated insights from platform data"
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "success.main",
                      borderRadius: "50%",
                      mt: 1,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Peak engagement detected
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Students are most active between 2-4 PM on weekdays
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                      mt: 1,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Quiz performance improvement
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Average scores increased by 12% after implementing study
                      plans
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "warning.main",
                      borderRadius: "50%",
                      mt: 1,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Collaboration trending up
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Group messaging activity increased by 23% this month
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardHeader
            title="User Engagement Analytics"
            subheader="Detailed engagement metrics and patterns"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Detailed engagement analytics would be displayed here...
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardHeader
            title="Learning Performance Metrics"
            subheader="Quiz scores, completion rates, and learning outcomes"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Performance analytics would be displayed here...
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardHeader
            title="Content Analytics"
            subheader="Resource usage, popular content, and engagement patterns"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Content analytics would be displayed here...
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
}
