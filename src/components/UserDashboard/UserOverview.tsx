import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton,
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SummaryCard from './SummaryCard';
import QuizCard from './QuizCard';
import {
  MenuBook as BookOpenIcon,
  Group as GroupIcon,
  Event as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as AwardIcon,
  Description as FileTextIcon,
} from '@mui/icons-material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useAuth } from '../../contexts/Authcontext';
import axiosInstance from '../../api/axiosInstance';

interface RecentActivityLog {
  id: string;
  category: string;
  activity_type: string;
  description: string;
  time: string;
}

export function UserOverview() {
  const { user_id } = useAuth();

  const [dashboardData, setDashboardData] = useState<{
    workspaces: number;
    groups: number;
    quizzes: any[];
    studyStreak: number;
    recentActivity: RecentActivityLog[];
  }>({
    workspaces: 0,
    groups: 0,
    quizzes: [],
    studyStreak: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user_id || user_id === 'null' || user_id === null) {
        console.error('Invalid user_id:', user_id);
        setLoading(false);
        return;
      }

      try {
        // Fetch all data in parallel
        const [quizzesRes, statsRes, activityRes] = await Promise.all([
          axiosInstance.get(`/quiz/user-group/${user_id}`),
          axiosInstance.get(`/dashboard/userStats/${user_id}`),
          axiosInstance.get(`/dashboard/recentActivity/${user_id}`),
        ]);

        let upcomingQuizzesData = [];
        if (quizzesRes.data.success) {
          upcomingQuizzesData = quizzesRes.data.data.quizzes || [];
        }

        let activityData = [];
        if (activityRes.data.success) {
          activityData = activityRes.data.data;
          // Debug log for first activity
          if (activityData?.length > 0) {
            console.log('First activity object:', activityData[0]);
          }
        }
        if (statsRes.data.success) {
          const statsData = statsRes.data.data;
          console.log('Received stats: ', statsData);

          setDashboardData({
            workspaces: statsData.workspaces || 0,
            groups: statsData.groups || 0,
            quizzes: upcomingQuizzesData,
            studyStreak: statsData.studyStreak || 0,
            recentActivity: activityData,
          });
        } else {
          setDashboardData((prev) => ({
            ...prev,
            quizzes: upcomingQuizzesData,
            recentActivity: activityData,
          }));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user_id]);

  const getActivityIcon = (category: string | undefined) => {
    if (!category) {
      console.log('Category is undefined for activity');
      return <BookOpenIcon />;
    }
    console.log('Activity category:', category);

    switch (category.toUpperCase()) {
      case 'QUIZ':
        return <AwardIcon />;
      case 'GENERAL':
        return <GroupIcon />;
      case 'RESOURCE':
        return <FileTextIcon />;
      case 'COLLABORATION':
        return <GroupWorkIcon />;
      case 'COMMUNICATION':
        return <MessageIcon />;
      case 'AI_LEARNING':
        return <AutoAwesomeIcon />;
      default:
        console.log('Falling back to default icon for category:', category);
        return <BookOpenIcon />;
    }
  };

  const sortedQuizzes = [...dashboardData.quizzes]
    .filter((quiz) => quiz.deadline)
    .sort(
      (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    )
    .slice(0, 4);

  return (
    <Box>
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {['Workspaces', 'Groups', 'Quizzes', 'Study Streak'].map(
          (title, idx) => {
            const valueMap = [
              dashboardData.workspaces,
              dashboardData.groups,
              dashboardData.quizzes.length,
              dashboardData.studyStreak,
            ];
            const iconMap = [
              <BookOpenIcon key="workspaces" />,
              <GroupIcon key="groups" />,
              <AwardIcon key="quizzes" />,
              <LocalFireDepartmentIcon key="streak" />,
            ];
            return (
              <Box
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(50% - 8px)',
                    md: '1 1 calc(25% - 12px)',
                  },
                }}
                key={title}
              >
                {loading ? (
                  <Skeleton variant="rectangular" height={120} />
                ) : (
                  <SummaryCard
                    title={title}
                    description={
                      title === 'Quizzes'
                        ? 'Completed this month'
                        : title === 'Study Streak'
                        ? 'Days studying continuously'
                        : title === 'Workspaces'
                        ? 'Active enrollments'
                        : 'Total groups'
                    }
                    value={valueMap[idx]}
                    icon={iconMap[idx]}
                    iconColor="action"
                  />
                )}
              </Box>
            );
          }
        )}
      </Box>

      {/* Quizzes and Recent Activity */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {/* Upcoming Quizzes */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon />
                  <Typography variant="h6">Upcoming Quizzes</Typography>
                </Box>
              }
              subheader="Don't miss your scheduled assessments"
            />
            <CardContent sx={{ flexGrow: 1 }}>
              {loading
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton
                      key={idx}
                      variant="rectangular"
                      height={70}
                      sx={{ mb: 2, borderRadius: 1 }}
                    />
                  ))
                : sortedQuizzes.map((quiz) => (
                    <QuizCard
                      key={quiz.quizId}
                      id={quiz.quizId}
                      title={quiz.title}
                      workspace={
                        quiz.groupName || quiz.groupId || 'Unknown Workspace'
                      }
                      duration={
                        quiz.timeLimit ? `${quiz.timeLimit} min` : 'N/A'
                      }
                      dueDate={
                        new Date(
                          quiz.deadline || quiz.createdAt
                        ).toLocaleDateString() || 'N/A'
                      }
                    />
                  ))}
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon />
                  <Typography variant="h6">Recent Activity</Typography>
                </Box>
              }
              subheader="Your latest learning activities"
            />
            <CardContent sx={{ flexGrow: 1 }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton
                    key={idx}
                    variant="rectangular"
                    height={50}
                    sx={{ mb: 1, borderRadius: 1 }}
                  />
                ))
              ) : dashboardData.recentActivity.length > 0 ? (
                <List disablePadding>
                  {dashboardData.recentActivity.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemIcon>
                          {getActivityIcon(activity.category)}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.description}
                          secondary={activity.time}
                        />
                      </ListItem>
                      {index < dashboardData.recentActivity.length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No recent activity found.</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
