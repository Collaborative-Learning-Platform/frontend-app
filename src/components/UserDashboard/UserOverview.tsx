import React, { useEffect, useState } from 'react';

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Skeleton,
} from '@mui/material';
import SummaryCard from './SummaryCard';
import QuizCard from './QuizCard';
import {
  MenuBook as BookOpenIcon,
  Group as GroupIcon,
  Event as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as AwardIcon,
  Description as FileTextIcon,
  Edit as PenToolIcon,
} from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../contexts/Authcontext';

const mockRecentActivity = [
  {
    id: 1,
    type: 'quiz',
    title: 'Completed Algorithm Quiz',
    time: '2 hours ago',
    score: 85,
  },
  {
    id: 2,
    type: 'group',
    title: 'Joined Study Group: React Basics',
    time: '1 day ago',
  },
  {
    id: 3,
    type: 'resource',
    title: 'Downloaded: Linear Algebra Notes',
    time: '2 days ago',
  },
  {
    id: 4,
    type: 'whiteboard',
    title: 'Collaborated on: Database Design',
    time: '3 days ago',
  },
];

export function UserOverview() {
  const { user_id } = useAuth();  

  const [dashboardData, setDashboardData] = useState<{
    workspaces: number;
    groups: number;
    quizzes: any[];
    studyStreak: number;
    recentActivity: any[];
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
        const [quizzesRes, statsRes] = await Promise.all([
          axiosInstance.get(`/quiz/user-group/${user_id}`),
          axiosInstance.get(`/dashboard/userStats/${user_id}`),
        ]);
        let upcomingQuizzesData = [];
        if (quizzesRes.data.success) {
          upcomingQuizzesData = quizzesRes.data.data.quizzes || [];
        }

        if (statsRes.data.success) {
          const data = statsRes.data.data;
          setDashboardData({
            workspaces: data.workspaces || 0,
            groups: data.groups || 0,
            quizzes: upcomingQuizzesData,
            studyStreak: data.studyStreak?.currentStreak || 0,
            recentActivity: data.recentActivity || mockRecentActivity,
          });
        } else {
          setDashboardData((prev) => ({
            ...prev,
            quizzes: upcomingQuizzesData,
          }));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setDashboardData((prev) => ({
          ...prev,
          recentActivity: mockRecentActivity,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user_id]);

  const sortedQuizzes = [...dashboardData.quizzes]
    .filter((quiz) => quiz.deadline) 
    .sort(
      (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    )
    .slice(0, 4); 
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <AwardIcon />;
      case 'group':
        return <GroupIcon />;
      case 'resource':
        return <FileTextIcon />;
      case 'whiteboard':
        return <PenToolIcon />;
      default:
        return <BookOpenIcon />;
    }
  };

  return (
    <Box>
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
              <BookOpenIcon />,
              <GroupIcon />,
              <AwardIcon />,
              <CalendarIcon />,
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
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
