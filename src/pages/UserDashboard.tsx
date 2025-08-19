import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  MenuBook as BookOpenIcon,
  Group as GroupIcon,
  Event as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Description as FileTextIcon,
  EmojiEvents as AwardIcon,
  Add as PlusIcon,
  BarChart as BarChart3Icon,
  Lightbulb as LightbulbIcon,
  Edit as PenToolIcon,
} from "@mui/icons-material";
import QuizCard from "../components/UserDashboard/QuizCard";
import SummaryCard from "../components/UserDashboard/SummaryCard";
import WorkspaceCard from "../components/UserDashboard/WorkspaceCard";

type TabPanelProps = {
  children?: React.ReactNode;
  value: number;
  index: number;
};

// Mock data
const mockUser = {
  name: "Vinuka Buddhima",
  role: "Student",
  avatar: "/placeholder.svg?height=40&width=40",
  workspaces: 3,
  groups: 8,
  completedQuizzes: 24,
  studyStreak: 7,
};

const mockWorkspaces = [
  {
    id: 1,
    name: "Computer Science 101",
    groups: 4,
    members: 45,
    color: "#1976d2",
  },
  {
    id: 2,
    name: "Mathematics Advanced",
    groups: 3,
    members: 32,
    color: "#388e3c",
  },
  {
    id: 3,
    name: "Physics Fundamentals",
    groups: 2,
    members: 28,
    color: "#7b1fa2",
  },
  {
    id: 4,
    name: "Chemistry Fundamentals",
    groups: 3,
    members: 28,
    color: "#7b1fa2",
  },
  {
    id: 5,
    name: "Engineer and Society",
    groups: 2,
    members: 28,
    color: "#7b1fa2",
  },
  {
    id: 6,
    name: "Software Engineering",
    groups: 8,
    members: 28,
    color: "#7b1fa2",
  },
];

const mockUpcomingQuizzes = [
  {
    id: 1,
    title: "Data Structures Quiz",
    workspace: "Computer Science 101",
    dueDate: "2024-01-20",
    duration: "45 min",
  },
  {
    id: 2,
    title: "Calculus Integration",
    workspace: "Mathematics Advanced",
    dueDate: "2024-01-22",
    duration: "60 min",
  },
  {
    id: 3,
    title: "Newton's Laws",
    workspace: "Physics Fundamentals",
    dueDate: "2024-01-25",
    duration: "30 min",
  },
];

const mockRecentActivity = [
  {
    id: 1,
    type: "quiz",
    title: "Completed Algorithm Quiz",
    time: "2 hours ago",
    score: 85,
  },
  {
    id: 2,
    type: "group",
    title: "Joined Study Group: React Basics",
    time: "1 day ago",
  },
  {
    id: 3,
    type: "resource",
    title: "Downloaded: Linear Algebra Notes",
    time: "2 days ago",
  },
  {
    id: 4,
    type: "whiteboard",
    title: "Collaborated on: Database Design",
    time: "3 days ago",
  },
];

const mockStudyPlan = [
  {
    id: 1,
    task: "Review Data Structures",
    priority: "high",
    estimatedTime: "2 hours",
    completed: false,
  },
  {
    id: 2,
    task: "Practice Calculus Problems",
    priority: "medium",
    estimatedTime: "1.5 hours",
    completed: true,
  },
  {
    id: 3,
    task: "Read Physics Chapter 5",
    priority: "low",
    estimatedTime: "45 min",
    completed: false,
  },
  {
    id: 4,
    task: "Group Discussion: Algorithms",
    priority: "high",
    estimatedTime: "1 hour",
    completed: false,
  },
];
const handleEnterWorkspace = (id:number) =>{
  console.log("Entering workspace:", id)
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

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return theme.palette.error.main;
      case "medium":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return <AwardIcon />;
      case "group":
        return <GroupIcon />;
      case "resource":
        return <FileTextIcon />;
      case "whiteboard":
        return <PenToolIcon />;
      default:
        return <BookOpenIcon />;
    }
  };

  return (
    <Box sx={{ minHeight: "100%", bgcolor: "background.default" }}>
      <Paper elevation={0} sx={{ borderColor: "divider" }}>
        <Container sx={{ py: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: { xs: "flex-start", sm: "space-between" },
              gap: { xs: 1.5, sm: 0 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 2 },
                justifyContent: { xs: "center", sm: "flex-start" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Avatar
                sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}
              >
                {mockUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
                >
                  Welcome back, {mockUser.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  {mockUser.role} • {mockUser.studyStreak} day study streak 🔥
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={<PlusIcon />}
                sx={{
                  minWidth: { xs: "100%", sm: "auto" },
                  py: { xs: 1, sm: 0.5 },
                  mt: { xs: 1, sm: 0 },
                }}
              >
                Join Group
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container sx={{ py: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
          >
            <Tab label="Overview" />
            <Tab label="Workspaces" />
            <Tab label="Study Plan" />
            <Tab label="Performance" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 8px)",
                  md: "1 1 calc(25% - 12px)",
                },
              }}
            >
              <SummaryCard
                title="Workspaces"
                description="Active enrollments"
                value={mockUser.workspaces}
                icon={<BookOpenIcon />}
                iconColor="action"
              />
            </Box>

            <Box
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 8px)",
                  md: "1 1 calc(25% - 12px)",
                },
              }}
            >
              <SummaryCard
                title="Groups"
                description="Total groups"
                value={mockUser.groups}
                icon={<GroupIcon />}
                iconColor="action"
              />
            </Box>

            <Box
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 8px)",
                  md: "1 1 calc(25% - 12px)",
                },
              }}
            >
              <SummaryCard
                title="Quizzes"
                description="Completed this month"
                value={mockUser.completedQuizzes}
                icon={<AwardIcon />}
                iconColor="action"
              />
            </Box>

            <Box
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 8px)",
                  md: "1 1 calc(25% - 12px)",
                },
              }}
            >
              <SummaryCard
                title="Study Streak"
                description="Days studying continuously"
                value={mockUser.studyStreak}
                icon={<CalendarIcon />}
                iconColor="action"
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarIcon />
                      <Typography variant="h6">Upcoming Quizzes</Typography>
                    </Box>
                  }
                  subheader="Don't miss your scheduled assessments"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  {mockUpcomingQuizzes.map((quiz) => (
                    <QuizCard
                      id={quiz.id}
                      title={quiz.title}
                      workspace={quiz.workspace}
                      duration={quiz.duration}
                      dueDate={quiz.dueDate}
                      key={quiz.id}
                    />
                  ))}
                </CardContent>
              </Card>
            </Box>

            {/* Recent Activity */}
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TrendingUpIcon />
                      <Typography variant="h6">Recent Activity</Typography>
                    </Box>
                  }
                  subheader="Your latest learning activities"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <List disablePadding>
                    {mockRecentActivity.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem>
                          <ListItemIcon>
                            {getActivityIcon(activity.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={activity.title}
                            secondary={activity.time}
                          />
                          {activity.score && (
                            <ListItemSecondaryAction>
                              <Chip label={`${activity.score}%`} size="small" />
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                        {index < mockRecentActivity.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "flex-start", sm: "space-between" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: { xs: 2, sm: 0 },
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              My Workspaces
            </Typography>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              sx={{
                minWidth: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.875rem", sm: "0.875rem" },
                py: { xs: 1, sm: 0.75 },
              }}
            >
              Join Workspace
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {mockWorkspaces.map((workspace) => (
              <Box
                key={workspace.id}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    sm: "1 1 calc(50% - 12px)",
                    md: "1 1 calc(33.333% - 16px)",
                  },
                }}
              >
                <WorkspaceCard
                  workspace={workspace}
                  onEnter={handleEnterWorkspace}
                />
              </Box>
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Personalized Study Plan
              </Typography>
              <Typography variant="body1" color="text.secondary">
                AI-generated plan based on your performance and goals
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<LightbulbIcon />}>
              Regenerate Plan
            </Button>
          </Box>

          <Card>
            <CardHeader
              title="Today's Tasks"
              subheader="Complete these tasks to stay on track"
            />
            <CardContent>
              <List>
                {mockStudyPlan.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Checkbox checked={task.completed} disabled />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              textDecoration: task.completed
                                ? "line-through"
                                : "none",
                              color: task.completed
                                ? "text.disabled"
                                : "text.primary",
                            }}
                          >
                            {task.task}
                          </Typography>
                        }
                        secondary={`Estimated: ${task.estimatedTime}`}
                      />
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: getPriorityColor(task.priority),
                          }}
                        />
                        <Chip
                          label={task.priority}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </ListItem>
                    {index < mockStudyPlan.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Performance Analytics
            </Typography>
            <Button variant="outlined" startIcon={<BarChart3Icon />}>
              Detailed Report
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
              <Card>
                <CardHeader
                  title="Study Insights"
                  subheader="Areas for improvement"
                />
                <CardContent>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "warning.light",
                      color: "warning.contrastText",
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Focus Area: Data Structures
                    </Typography>
                    <Typography variant="caption">
                      Consider reviewing linked lists and trees
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "success.light",
                      color: "success.contrastText",
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Strong Performance: Calculus
                    </Typography>
                    <Typography variant="caption">
                      Keep up the excellent work!
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "info.light",
                      color: "info.contrastText",
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Recommendation
                    </Typography>
                    <Typography variant="caption">
                      Join the "Physics Problem Solving" group
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>
      </Container>
    </Box>
  );
}
