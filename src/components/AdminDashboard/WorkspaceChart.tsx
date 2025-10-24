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
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { useTheme, alpha } from '@mui/material/styles';
import {
  TrendingUp,
  TrendingDown,
  BusinessCenter as WorkspaceIcon,
} from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

interface WorkspaceChartProps {
  workspaceInfo?: WorkspaceInfo;
  loading: boolean;
}

export function WorkspaceChart({
  workspaceInfo,
  loading,
}: WorkspaceChartProps) {
  const theme = useTheme();

  // Generate chart data for current vs last week
  const generateWorkspaceData = () => {
    if (!workspaceInfo) {
      return {
        labels: ['Last Week', 'Current'],
        workspacesData: [0, 0],
        groupsData: [0, 0],
      };
    }

    const labels = ['Last Week', 'Current'];
    const workspacesData = [
      workspaceInfo.lastWeekCounts?.workspaces || 0,
      workspaceInfo.workspaces || 0,
    ];
    const groupsData = [
      workspaceInfo.lastWeekCounts?.groups || 0,
      workspaceInfo.groups || 0,
    ];

    return { labels, workspacesData, groupsData };
  };

  const chartData = generateWorkspaceData();

  const barChartOptions: ChartOptions<'bar'> = {
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
          stepSize: 1,
        },
      },
    },
  };

  const barChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Workspaces',
        data: chartData.workspacesData,
        backgroundColor: alpha('#2196F3', 0.6), // Blue
        borderColor: '#2196F3',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Groups',
        data: chartData.groupsData,
        backgroundColor: alpha('#9C27B0', 0.6), // Purple
        borderColor: '#9C27B0',
        borderWidth: 2,
        borderRadius: 4,
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
          maxWidth: 400, // or 400, adjust as needed
          mx: 'auto',
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkspaceIcon />
              <Typography variant="h6" fontWeight="bold">
                Workspaces & Groups Growth
              </Typography>
            </Box>
          }
          subheader="Growth comparison between last week and current"
        />
        <CardContent>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 2 }}
          />
        </CardContent>
      </Card>
    );
  }

  const workspaceChange = workspaceInfo?.workspaceCountChange || 0;
  const groupChange = workspaceInfo?.groupCountChange || 0;
  const workspacePercentChange = workspaceInfo?.workspacePercentChange || 0;
  const groupPercentChange = workspaceInfo?.groupPercentChange || 0;

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
            <WorkspaceIcon />
            <Typography variant="h6" fontWeight="bold">
              Workspaces & Groups Growth
            </Typography>
          </Box>
        }
        subheader="Growth comparison between last week and current"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={workspaceChange >= 0 ? <TrendingUp /> : <TrendingDown />}
              label={`Workspaces: ${
                workspaceChange >= 0 ? '+' : ''
              }${workspaceChange}`}
              color={workspaceChange >= 0 ? 'success' : 'error'}
              variant="outlined"
              size="small"
            />
            <Chip
              icon={groupChange >= 0 ? <TrendingUp /> : <TrendingDown />}
              label={`Groups: ${groupChange >= 0 ? '+' : ''}${groupChange}`}
              color={groupChange >= 0 ? 'success' : 'error'}
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
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#2196F3' }}
              >
                {workspaceInfo?.workspaces || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Workspaces
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#9C27B0' }}
              >
                {workspaceInfo?.groups || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Groups
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={
                  workspacePercentChange >= 0 ? 'success.main' : 'error.main'
                }
              >
                {workspacePercentChange >= 0 ? '+' : ''}
                {workspacePercentChange.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Workspace Growth
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={groupPercentChange >= 0 ? 'success.main' : 'error.main'}
              >
                {groupPercentChange >= 0 ? '+' : ''}
                {groupPercentChange.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Group Growth
              </Typography>
            </Box>
          </Box>

          {/* Bar Chart */}
          <Box sx={{ height: 330, position: 'relative' }}>
            <Bar data={barChartData} options={barChartOptions} />
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
                Platform Growth
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {workspaceChange >= 0 && groupChange >= 0
                  ? 'Expanding'
                  : 'Mixed growth'}{' '}
                platform usage
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight="medium">
                Groups per Workspace
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {workspaceInfo?.workspaces
                  ? `${(
                      (workspaceInfo.groups || 0) / workspaceInfo.workspaces
                    ).toFixed(1)} avg groups/workspace`
                  : 'No data'}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
