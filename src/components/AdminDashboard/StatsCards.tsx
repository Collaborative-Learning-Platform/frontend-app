import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  People as UsersIcon,
  MenuBook as BookOpenIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../contexts/Authcontext';

interface AuthInfo {
  totalCount: number;
  tutorCount: number;
  userCount: number;
  totalCountChange: number;
  tutorCountChange: number;
  userCountChange: number;
  totalPercentChange: number;
  tutorPercentChange: number;
  userPercentChange: number;
  lastMonthCounts: {
    totalCount: number;
    tutorCount: number;
    userCount: number;
  };
}

interface WorkspaceInfo {
  workspaces: number;
  groups: number;
  workspaceCountChange: number;
  groupCountChange: number;
  workspacePercentChange: number;
  groupPercentChange: number;
  lastWeekCounts: {
    workspaces: number;
    groups: number;
  };
}

interface EngagementInfo {
  last7Avg: number;
  prev7Avg: number;
  difference: number;
  percentChange: number;
}

interface Stat {
  title: string;
  value: number;
  change?: number;
  icon: React.ElementType;
  description: string;
}

export function StatsCards() {
  const { user_id } = useAuth();
  const [authInfo, setAuthInfo] = useState<AuthInfo>();
  const [workspaceInfo, setWorkspaceInfo] = useState<WorkspaceInfo>();
  const [engagementInfo, setEngagementInfo] = useState<EngagementInfo>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user_id) {
      return;
    }
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await axiosInstance.get('dashboard/adminStats'); // Adjust the URL if needed
        console.log('StatsCards: API Response success:', res.data.success);
        console.log('StatsCards: Full API Response data:', res.data.data);
        console.log(
          'StatsCards: Workspace data:',
          res.data.data?.workspaces,
          res.data.data?.groups
        );
        console.log(
          'StatsCards: Workspace changes:',
          res.data.data?.workspaceCountChange,
          res.data.data?.groupCountChange
        );
        console.log(
          'StatsCards: Workspace percent changes:',
          res.data.data?.workspacePercentChange,
          res.data.data?.groupPercentChange
        );

        if (res.data?.success && res.data?.data) {
          setAuthInfo({
            totalCount: res.data.data.authInfo?.totalCount ?? 0,
            tutorCount: res.data.data.authInfo?.tutorCount ?? 0,
            userCount: res.data.data.authInfo?.userCount ?? 0,
            totalCountChange: res.data.data.authInfo?.totalCountChange ?? 0,
            tutorCountChange: res.data.data.authInfo?.tutorCountChange ?? 0,
            userCountChange: res.data.data.authInfo?.userCountChange ?? 0,
            totalPercentChange: res.data.data.authInfo?.totalPercentChange ?? 0,
            tutorPercentChange: res.data.data.authInfo?.tutorPercentChange ?? 0,
            userPercentChange: res.data.data.authInfo?.userPercentChange ?? 0,
            lastMonthCounts: res.data.data.authInfo?.lastMonthCounts ?? {
              totalCount: 0,
              tutorCount: 0,
              userCount: 0,
            },
          });
          setWorkspaceInfo({
            workspaces: res.data.data.workspaces ?? 0,
            groups: res.data.data.groups ?? 0,
            workspaceCountChange: res.data.data.workspaceCountChange ?? 0,
            groupCountChange: res.data.data.groupCountChange ?? 0,
            workspacePercentChange: res.data.data.workspacePercentChange ?? 0,
            groupPercentChange: res.data.data.groupPercentChange ?? 0,
            lastWeekCounts: res.data.data.lastWeekCounts ?? {
              workspaces: 0,
              groups: 0,
            },
          });
          setEngagementInfo(res.data.data.engagementInfo ?? null);
        }
      } catch (err) {
        console.error('Failed to fetch stats in StatsCards:', err);
        setAuthInfo({
          totalCount: 0,
          tutorCount: 0,
          userCount: 0,
          totalCountChange: 0,
          tutorCountChange: 0,
          userCountChange: 0,
          totalPercentChange: 0,
          tutorPercentChange: 0,
          userPercentChange: 0,
          lastMonthCounts: {
            totalCount: 0,
            tutorCount: 0,
            userCount: 0,
          },
        });
        setWorkspaceInfo({
          workspaces: 0,
          groups: 0,
          workspaceCountChange: 0,
          groupCountChange: 0,
          workspacePercentChange: 0,
          groupPercentChange: 0,
          lastWeekCounts: {
            workspaces: 0,
            groups: 0,
          },
        });
        setEngagementInfo({
          last7Avg: 0,
          prev7Avg: 0,
          difference: 0,
          percentChange: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user_id]);

  const stats: Stat[] = [
    {
      title: 'Total Users',
      value: authInfo?.totalCount || 0,
      change: authInfo?.totalPercentChange || 0,
      icon: UsersIcon,
      description: `${authInfo?.userCount || 0} Students, ${
        authInfo?.tutorCount || 0
      } Tutors`,
    },
    {
      title: 'Active Workspaces',
      value: workspaceInfo?.workspaces || 0,
      change: workspaceInfo?.workspacePercentChange || 0,
      icon: BookOpenIcon,
      description: `${
        (workspaceInfo?.workspaceCountChange || 0) > 0 ? '+' : ''
      }${workspaceInfo?.workspaceCountChange || 0} from last week`,
    },
    {
      title: 'Active Groups',
      value: workspaceInfo?.groups || 0,
      change: workspaceInfo?.groupPercentChange || 0,
      icon: GroupIcon,
      description: `${(workspaceInfo?.groupCountChange || 0) > 0 ? '+' : ''}${
        workspaceInfo?.groupCountChange || 0
      } from last week`,
    },
    {
      title: 'User Engagement',
      value: Number((engagementInfo?.last7Avg || 0).toFixed(2)),
      change: Number((engagementInfo?.percentChange ?? 0).toFixed(2)),
      icon:
        (engagementInfo?.percentChange ?? 0) > 0
          ? TrendingUpIcon
          : TrendingDownIcon,
      description: 'Average this week',
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        {[1, 2, 3, 4].map((index) => (
          <Box
            key={index}
            sx={{
              flex: {
                xs: '1 1 100%',
                md: '1 1 calc(50% - 12px)',
                lg: '1 1 calc(25% - 18px)',
              },
            }}
          >
            <Skeleton
              variant="rectangular"
              height={140}
              sx={{
                borderRadius: 1,
              }}
            />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
      }}
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Box
            key={index}
            sx={{
              flex: {
                xs: '1 1 100%',
                md: '1 1 calc(50% - 12px)',
                lg: '1 1 calc(25% - 18px)',
              },
            }}
          >
            <Card>
              <CardHeader
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pb: 1,
                }}
                title={
                  <Typography variant="body2" fontWeight="medium">
                    {stat.title}
                  </Typography>
                }
                action={
                  <IconComponent
                    sx={{
                      fontSize: 20,
                      color: 'text.secondary',
                    }}
                  />
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                {stat.change !== undefined ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          typeof stat.change === 'number' && stat.change > 0
                            ? 'success.main'
                            : 'error.main',
                      }}
                    >
                      {typeof stat.change === 'number'
                        ? `${stat.change > 0 ? '+' : ''}${stat.change.toFixed(
                            2
                          )}%`
                        : stat.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.title === 'Total Users'
                        ? 'from last month'
                        : 'from last week'}
                    </Typography>
                  </Box>
                ) : null}
                <Typography variant="caption" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </Box>
  );
}
