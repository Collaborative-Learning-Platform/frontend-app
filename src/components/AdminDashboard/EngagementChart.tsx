import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Skeleton,
  Stack,
  Chip,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { useTheme, alpha } from '@mui/material/styles';
import {
  TrendingUp,
  TrendingDown,
  ShowChart as ShowChartIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EngagementInfo {
  last7Avg: number;
  prev7Avg: number;
  difference: number;
  percentChange: number;
}

interface DailyEngagementData {
  date: string;
  active_users: number;
  total_users: number;
  engagement: number;
}

interface EngagementChartProps {
  engagementInfo?: EngagementInfo;
  dailyEngagementData: DailyEngagementData[];
  loading: boolean;
}

export function EngagementChart({
  engagementInfo,
  dailyEngagementData,
  loading,
}: EngagementChartProps) {
  const theme = useTheme();

  // Process real engagement data
  const processEngagementData = () => {
    if (!dailyEngagementData || dailyEngagementData.length === 0) {
      // Return empty data if no real data is available
      return { labels: [], data: [] };
    }

    // Sort data by date to ensure proper chronological order
    const sortedData = [...dailyEngagementData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    });

    const data = sortedData.map((item) => item.engagement);

    return { labels, data };
  };

  const engagementData = processEngagementData();

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            return `Engagement: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  const chartData = {
    labels: engagementData.labels,
    datasets: [
      {
        label: 'User Engagement',
        data: engagementData.data,
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        borderWidth: 3,
        fill: true,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointHoverBackgroundColor: theme.palette.primary.dark,
        pointHoverBorderColor: theme.palette.background.paper,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShowChartIcon />
              <Typography variant="h6" fontWeight="bold">
                User Engagement Trends
              </Typography>
            </Box>
          }
          subheader="14-day engagement activity overview"
        />
        <CardContent>
          <Skeleton
            variant="rectangular"
            height={350}
            sx={{ borderRadius: 2 }}
          />
        </CardContent>
      </Card>
    );
  }

  const percentChange = engagementInfo?.percentChange || 0;
  const isPositive = percentChange > 0;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        background: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShowChartIcon />
            <Typography variant="h6" fontWeight="bold">
              User Engagement Trends
            </Typography>
          </Box>
        }
        subheader="14-day engagement activity overview"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={isPositive ? <TrendingUp /> : <TrendingDown />}
              label={`${isPositive ? '+' : ''}${percentChange.toFixed(1)}%`}
              color={isPositive ? 'success' : 'error'}
              variant="outlined"
              size="small"
            />
          </Box>
        }
      />
      <CardContent>
        <Stack spacing={3}>
          {/* Summary Stats */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              p: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              gap: 2,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {(engagementInfo?.last7Avg || 0).toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last 7 Days Avg
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {(engagementInfo?.prev7Avg || 0).toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Previous 7 Days Avg
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={isPositive ? 'success.main' : 'error.main'}
              >
                {isPositive ? '+' : ''}
                {(engagementInfo?.difference || 0).toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Change
              </Typography>
            </Box>
          </Box>

          {/* Chart */}
          <Box sx={{ height: 350, position: 'relative' }}>
            <Line data={chartData} options={chartOptions} />
          </Box>

          {/* Additional Insights */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.5),
              borderRadius: 2,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Engagement Trend
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isPositive ? 'Increasing' : 'Decreasing'} user activity
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight="medium">
                Peak Activity
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {engagementData.data.length > 0
                  ? `${Math.max(...engagementData.data).toFixed(1)}%`
                  : 'No data'}{' '}
                engagement score
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Users Activity Chart Component
interface UsersActivityChartProps {
  dailyEngagementData: DailyEngagementData[];
  loading: boolean;
}

export function UsersActivityChart({
  dailyEngagementData,
  loading,
}: UsersActivityChartProps) {
  const theme = useTheme();

  // Process users data for the chart
  const processUsersData = () => {
    if (!dailyEngagementData || dailyEngagementData.length === 0) {
      return { labels: [], activeUsersData: [], totalUsersData: [] };
    }

    // Sort data by date to ensure proper chronological order
    const sortedData = [...dailyEngagementData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    });

    const activeUsersData = sortedData.map((item) => item.active_users);
    const totalUsersData = sortedData.map((item) => item.total_users);

    return { labels, activeUsersData, totalUsersData };
  };

  const usersData = processUsersData();

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            return `${label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  const chartData = {
    labels: usersData.labels,
    datasets: [
      {
        label: 'Total Users',
        data: usersData.totalUsersData,
        borderColor: '#FF9800', // Orange
        backgroundColor: alpha('#FF9800', 0.1),
        borderWidth: 3,
        fill: false,
        pointBackgroundColor: '#FF9800',
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#F57C00',
        pointHoverBorderColor: theme.palette.background.paper,
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Active Users',
        data: usersData.activeUsersData,
        borderColor: '#4CAF50', // Green
        backgroundColor: alpha('#4CAF50', 0.1),
        borderWidth: 3,
        fill: false,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#388E3C',
        pointHoverBorderColor: theme.palette.background.paper,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          mt: 3,
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon />
              <Typography variant="h6" fontWeight="bold">
                Users Activity Trends
              </Typography>
            </Box>
          }
          subheader="Daily active vs total users comparison"
        />
        <CardContent>
          <Skeleton
            variant="rectangular"
            height={350}
            sx={{ borderRadius: 2 }}
          />
        </CardContent>
      </Card>
    );
  }

  // Calculate some statistics
  const totalUsersLatest =
    usersData.totalUsersData.length > 0
      ? usersData.totalUsersData[usersData.totalUsersData.length - 1]
      : 0;
  const activeUsersLatest =
    usersData.activeUsersData.length > 0
      ? usersData.activeUsersData[usersData.activeUsersData.length - 1]
      : 0;
  const maxActiveUsers =
    usersData.activeUsersData.length > 0
      ? Math.max(...usersData.activeUsersData)
      : 0;
  const avgActiveUsers =
    usersData.activeUsersData.length > 0
      ? Math.round(
          usersData.activeUsersData.reduce((a, b) => a + b, 0) /
            usersData.activeUsersData.length
        )
      : 0;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        background: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        mt: 3,
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon />
            <Typography variant="h6" fontWeight="bold">
              Users Activity Trends
            </Typography>
          </Box>
        }
        subheader="Daily active vs total users comparison"
      />
      <CardContent>
        <Stack spacing={3}>
          {/* Summary Stats */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              p: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.3),
              borderRadius: 2,
              gap: 2,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#FF9800' }}
              >
                {totalUsersLatest}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Users
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#4CAF50' }}
              >
                {activeUsersLatest}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Latest Active
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {maxActiveUsers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Peak Active
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {avgActiveUsers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg Active
              </Typography>
            </Box>
          </Box>

          {/* Chart */}
          <Box sx={{ height: 350, position: 'relative' }}>
            <Line data={chartData} options={chartOptions} />
          </Box>

          {/* Additional Insights */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.5),
              borderRadius: 2,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight="medium">
                User Growth
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Platform user base trends
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight="medium">
                Activity Rate
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {totalUsersLatest > 0
                  ? `${((activeUsersLatest / totalUsersLatest) * 100).toFixed(
                      1
                    )}%`
                  : '0%'}{' '}
                engagement today
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
