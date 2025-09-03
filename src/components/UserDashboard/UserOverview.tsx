import React from "react";
import {
  Box,
  Card,
  CardHeader,
  Typography,
  CardContent,
  List,
  ListItem,
  ListItemSecondaryAction,
  Chip,
  ListItemIcon,
  Divider,
  ListItemText,
} from "@mui/material";
import SummaryCard from "./SummaryCard";
import QuizCard from "./QuizCard";
import {
  MenuBook as BookOpenIcon,
  Group as GroupIcon,
  Event as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as AwardIcon,
  Description as FileTextIcon,
  Edit as PenToolIcon,
} from "@mui/icons-material";

const mockUser = {
  name: "Vinuka Buddhima",
  role: "Student",
  avatar: "/placeholder.svg?height=40&width=40",
  workspaces: 3,
  groups: 8,
  completedQuizzes: 24,
  studyStreak: 7,
};

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

export function UserOverview() {
  return (
    <Box>
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
    </Box>
  );
}
