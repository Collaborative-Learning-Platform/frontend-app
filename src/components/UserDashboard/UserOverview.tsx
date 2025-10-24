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
// import SummaryCard from './SummaryCard';
// import QuizCard from './QuizCard';
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
import { Suspense, lazy } from 'react';

const QuizCard = lazy(() => import('./QuizCard'));
const SummaryCard = lazy(() => import('./SummaryCard'));

interface RecentActivityLog {
  id: string;
  category: string;
  activity_type: string;
  description: string;
  time: string;
}

export function UserOverview() {
  const { user_id, loading: authLoading } = useAuth();
  const groupIdNameMap: Record<string, string> = {};
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

  // This effect will run only once to set up a ref to track if we've fetched data
  const initialFetchRef = React.useRef(false);

  // Main data fetching effect that runs when auth is ready and user_id is available
  useEffect(() => {
    // Skip if no user_id available
    if (!user_id) {
      return;
    }

    // Mark that we're fetching now
    initialFetchRef.current = true;

    const fetchDashboard = async () => {
      try {
        const userGroupsRes = await axiosInstance.post(
          `/workspace/groups/by-user`,
          { userId: user_id }
        );
        if (userGroupsRes.data.success) {
          userGroupsRes.data.data.forEach((group: any) => {
            groupIdNameMap[group.groupId] = group.groupName;
          });
        }
        const userGroupIds = Object.keys(groupIdNameMap);

        // // Define default response objects
        // let quizzesRes: any = { data: { success: false } };
        // let statsRes: any = { data: { success: false } };
        // let activityRes: any = { data: { success: false } };

        // // Try each request individually
        // try {
        //   quizzesRes = await axiosInstance.post('/quiz/user-quizzes', {
        //     userGroupIds,
        //   });
        //   console.log('Quiz response received:', quizzesRes.status);
        // } catch (err: any) {
        //   console.error(
        //     'Quiz request failed:',
        //     err?.message || 'Unknown error'
        //   );
        // }

        // try {
        //   statsRes = await axiosInstance.get(`/dashboard/userStats/${user_id}`);
        //   console.log('Stats response received:', statsRes.status);
        // } catch (err: any) {
        //   console.error(
        //     'Stats request failed:',
        //     err?.message || 'Unknown error'
        //   );
        // }

        // try {
        //   activityRes = await axiosInstance.get(
        //     `/dashboard/recentActivity/${user_id}`
        //   );
        //   console.log('Activity response received:', activityRes.status);
        // } catch (err: any) {
        //   console.error(
        //     'Activity request failed:',
        //     err?.message || 'Unknown error'
        //   );
        // }

        // Make all requests in parallel
        const [quizzesRes, statsRes, activityRes] = await Promise.all([
          axiosInstance
            .post('/quiz/user-quizzes', { userGroupIds })
            .catch((err) => {
              console.error(
                'Quiz request failed:',
                err?.message || 'Unknown error'
              );
              return { data: { success: false, data: [] } };
            }),
          axiosInstance.get(`/dashboard/userStats/${user_id}`).catch((err) => {
            console.error(
              'Stats request failed:',
              err?.message || 'Unknown error'
            );
            return {
              data: {
                success: false,
                data: { workspaces: 0, groups: 0, studyStreak: 0 },
              },
            };
          }),
          axiosInstance
            .get(`/dashboard/recentActivity/${user_id}`)
            .catch((err) => {
              console.error(
                'Activity request failed:',
                err?.message || 'Unknown error'
              );
              return { data: { success: false, data: [] } };
            }),
        ]);

        console.log('All requests completed');

        let upcomingQuizzesData = [];
        if (quizzesRes.data?.success) {
          upcomingQuizzesData = quizzesRes.data.data.map((quiz: any) => ({
            ...quiz,
            groupName: groupIdNameMap[quiz.groupId] || 'Unknown Workspace',
          }));
        } else {
          console.log('Quiz data not available or not successful');
        }

        let activityData = [];
        if (activityRes.data?.success) {
          activityData = activityRes.data.data;
        }
        if (statsRes.data.success) {
          const statsData = statsRes.data.data;

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

  // Memoize QuizCard to prevent re-renders
  const MemoizedQuizCard = React.memo(QuizCard);

  const getActivityIcon = (category: string | undefined) => {
    if (!category) {
      return <BookOpenIcon />;
    }
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
        return <BookOpenIcon />;
    }
  };

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
                  <Suspense
                    fallback={<Skeleton variant="rectangular" height={120} />}
                  >
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
                  </Suspense>
                )}
              </Box>
            );
          }
        )}
      </Box>

      {/* Quizzes and Recent Activity */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
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
                : dashboardData.quizzes.map((quiz) => (
                    <MemoizedQuizCard
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
