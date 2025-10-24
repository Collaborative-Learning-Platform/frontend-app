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

interface AnalyticsData {
  authInfo?: AuthInfo;
  workspaceInfo?: WorkspaceInfo;
  engagementInfo?: EngagementInfo;
}

interface StatsCardsProps {
  analyticsData: AnalyticsData;
  loading: boolean;
}

interface Stat {
  title: string;
  value: number;
  change?: number;
  icon: React.ElementType;
  description: string;
}

export function StatsCards({ analyticsData, loading }: StatsCardsProps) {
  const stats: Stat[] = [
    {
      title: 'Total Users',
      value: analyticsData?.authInfo?.totalCount || 0,
      change: analyticsData?.authInfo?.totalPercentChange || 0,
      icon: UsersIcon,
      description: `${analyticsData?.authInfo?.userCount || 0} Students, ${
        analyticsData?.authInfo?.tutorCount || 0
      } Tutors`,
    },
    {
      title: 'Active Workspaces',
      value: analyticsData?.workspaceInfo?.workspaces || 0,
      change: analyticsData?.workspaceInfo?.workspacePercentChange || 0,
      icon: BookOpenIcon,
      description: `${
        (analyticsData?.workspaceInfo?.workspaceCountChange || 0) > 0 ? '+' : ''
      }${
        analyticsData?.workspaceInfo?.workspaceCountChange || 0
      } from last week`,
    },
    {
      title: 'Active Groups',
      value: analyticsData?.workspaceInfo?.groups || 0,
      change: analyticsData?.workspaceInfo?.groupPercentChange || 0,
      icon: GroupIcon,
      description: `${
        (analyticsData?.workspaceInfo?.groupCountChange || 0) > 0 ? '+' : ''
      }${analyticsData?.workspaceInfo?.groupCountChange || 0} from last week`,
    },
    {
      title: 'User Engagement',
      value: Number((analyticsData?.engagementInfo?.last7Avg || 0).toFixed(2)),
      change: Number(
        (analyticsData?.engagementInfo?.percentChange ?? 0).toFixed(2)
      ),
      icon:
        (analyticsData?.engagementInfo?.percentChange ?? 0) > 0
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
