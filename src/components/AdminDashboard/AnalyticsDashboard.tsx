import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { AdminOverview } from './AdminOverview';
import { EngagementChart, UsersActivityChart } from './EngagementChart';
import { WorkspaceChart } from './WorkspaceChart';
import { useAuth } from '../../contexts/Authcontext';
import axiosInstance from '../../api/axiosInstance';

interface EngagementInfo {
  last7Avg: number;
  prev7Avg: number;
  difference: number;
  percentChange: number;
}

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

interface AnalyticsData {
  authInfo?: AuthInfo;
  workspaceInfo?: WorkspaceInfo;
  engagementInfo?: EngagementInfo;
}

interface DailyEngagementData {
  date: string;
  active_users: number;
  total_users: number;
  engagement: number;
}

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
  const { user_id } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({});
  const [dailyEngagementData, setDailyEngagementData] = useState<
    DailyEngagementData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch analytics data
  useEffect(() => {
    if (!user_id) return;

    async function fetchAnalyticsData() {
      try {
        setLoading(true);

        // Fetch admin stats and daily engagement data in parallel
        const [adminStatsRes, dailyEngagementRes] = await Promise.all([
          axiosInstance.get('dashboard/adminStats'),
          axiosInstance.get('dashboard/dailyEngagement'),
        ]);

        // Process admin stats
        if (adminStatsRes.data?.success && adminStatsRes.data?.data) {
          setAnalyticsData({
            authInfo: {
              totalCount: adminStatsRes.data.data.authInfo?.totalCount ?? 0,
              tutorCount: adminStatsRes.data.data.authInfo?.tutorCount ?? 0,
              userCount: adminStatsRes.data.data.authInfo?.userCount ?? 0,
              totalCountChange:
                adminStatsRes.data.data.authInfo?.totalCountChange ?? 0,
              tutorCountChange:
                adminStatsRes.data.data.authInfo?.tutorCountChange ?? 0,
              userCountChange:
                adminStatsRes.data.data.authInfo?.userCountChange ?? 0,
              totalPercentChange:
                adminStatsRes.data.data.authInfo?.totalPercentChange ?? 0,
              tutorPercentChange:
                adminStatsRes.data.data.authInfo?.tutorPercentChange ?? 0,
              userPercentChange:
                adminStatsRes.data.data.authInfo?.userPercentChange ?? 0,
              lastMonthCounts: adminStatsRes.data.data.authInfo
                ?.lastMonthCounts ?? {
                totalCount: 0,
                tutorCount: 0,
                userCount: 0,
              },
            },
            workspaceInfo: {
              workspaces: adminStatsRes.data.data.workspaces ?? 0,
              groups: adminStatsRes.data.data.groups ?? 0,
              workspaceCountChange:
                adminStatsRes.data.data.workspaceCountChange ?? 0,
              groupCountChange: adminStatsRes.data.data.groupCountChange ?? 0,
              workspacePercentChange:
                adminStatsRes.data.data.workspacePercentChange ?? 0,
              groupPercentChange:
                adminStatsRes.data.data.groupPercentChange ?? 0,
              lastWeekCounts: adminStatsRes.data.data.lastWeekCounts ?? {
                workspaces: 0,
                groups: 0,
              },
            },
            engagementInfo: adminStatsRes.data.data.engagementInfo ?? {
              last7Avg: 0,
              prev7Avg: 0,
              difference: 0,
              percentChange: 0,
            },
          });
        }

        // Process daily engagement data
        if (dailyEngagementRes.data?.success && dailyEngagementRes.data?.data) {
          setDailyEngagementData(dailyEngagementRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsData();
  }, [user_id]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
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
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="User Engagement" />
          <Tab label="Workspaces and Groups" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Box>
          <AdminOverview analyticsData={analyticsData} loading={loading} />
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box>
          <EngagementChart
            engagementInfo={analyticsData.engagementInfo}
            dailyEngagementData={dailyEngagementData}
            loading={loading}
          />
          <UsersActivityChart
            dailyEngagementData={dailyEngagementData}
            loading={loading}
          />
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Box>
          <WorkspaceChart
            workspaceInfo={analyticsData.workspaceInfo}
            loading={loading}
          />
        </Box>
      </TabPanel>
    </Box>
  );
}
