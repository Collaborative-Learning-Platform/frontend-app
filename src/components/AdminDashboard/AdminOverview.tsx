import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Divider,
} from '@mui/material';
import { Timeline as ActivityIcon } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useAuth } from '../../contexts/Authcontext';
import axiosInstance from '../../api/axiosInstance';
import { StatsCards } from './StatsCards';

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

interface AdminOverviewProps {
  analyticsData: AnalyticsData;
  loading: boolean;
}

interface RecentActivityLog {
  id: string;
  category: string;
  activity_type: string;
  description: string;
  time: string;
  metadata?: any;
}

interface SystemActivity {
  id: string;
  user_id: string;
  user_name: string;
  role: string;
  category: string;
  activity_type: string;
  description: string;
  time: string;
  created_at: string;
  metadata?: any;
}

export function AdminOverview({
  analyticsData,
  loading: analyticsLoading,
}: AdminOverviewProps) {
  const theme = useTheme();
  const { user_id } = useAuth();
  const [recentAdminActivity, setRecentAdminActivity] = useState<
    RecentActivityLog[]
  >([]);
  const [systemActivity, setSystemActivity] = useState<SystemActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [systemLoading, setSystemLoading] = useState(false);

  // Function to get random color for activity dots
  const getRandomColor = () => {
    const colors = [
      '#4CAF50', // Green
      '#FF9800', // Orange
      '#2196F3', // Blue
      '#9C27B0', // Purple
      '#F44336', // Red
      '#00BCD4', // Cyan
      '#FF5722', // Deep Orange
      '#795548', // Brown
      '#607D8B', // Blue Grey
      '#E91E63', // Pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to get appropriate icon for metadata based on activity type
  const getMetadataIcon = (activity_type: string) => {
    switch (activity_type) {
      case 'DOWNLOADED_RESOURCE':
      case 'UPLOADED_RESOURCE':
        return '📁'; // File folder
      case 'GENERATED_FLASHCARDS':
      case 'DELETED_FLASHCARDS':
        return '🃏'; // Playing card for flashcards
      case 'JOINED_WHITEBOARD':
        return '👥'; // People for group/whiteboard
      case 'JOINED_DOCUMENT':
        return '📄'; // Document
      case 'ADDED_TO_WORKSPACE':
      case 'CREATED_WORKSPACE':
        return '🏢'; // Office building for workspace
      case 'ADDED_TO_GROUP':
      case 'CREATED_GROUP':
      case 'DELETED_GROUP':
        return '👥'; // People for group
      case 'POSTED_MESSAGE':
        return '💬'; // Speech bubble for message
      case 'STARTED_QUIZ':
      case 'SUBMITTED_QUIZ':
      case 'CREATED_QUIZ':
        return '📝'; // Memo for quiz
      default:
        return '📄'; // Default document icon
    }
  };

  // Function to extract relevant metadata name based on activity type
  const getMetadataName = (activity: RecentActivityLog | SystemActivity) => {
    if (!activity.metadata) return null;

    const { activity_type, metadata } = activity;

    try {
      switch (activity_type) {
        case 'DOWNLOADED_RESOURCE':
        case 'UPLOADED_RESOURCE':
          return metadata.fileName;
        case 'GENERATED_FLASHCARDS':
          return metadata.fileName;
        case 'DELETED_FLASHCARDS':
          return metadata.title;
        case 'JOINED_WHITEBOARD':
          return metadata.groupName;
        case 'JOINED_DOCUMENT':
          return metadata.title;
        case 'ADDED_TO_WORKSPACE':
        case 'CREATED_WORKSPACE':
          return metadata.name || metadata.workspaceName;
        case 'ADDED_TO_GROUP':
        case 'CREATED_GROUP':
        case 'DELETED_GROUP':
          return metadata.name;
        case 'POSTED_MESSAGE':
          return metadata.groupName;
        case 'STARTED_QUIZ':
        case 'SUBMITTED_QUIZ':
        case 'CREATED_QUIZ':
          return metadata.quizTitle;
        default:
          // Fallback: try to find any 'name' or 'title' field in metadata
          return metadata.name || metadata.title || metadata.fileName || null;
      }
    } catch (error) {
      console.warn('Error extracting metadata name:', error);
      return null;
    }
  };

  // Fetch recent admin activity data
  useEffect(() => {
    const fetchRecentActivity = async () => {
      console.log('AdminOverview: Starting fetchRecentActivity');
      console.log('AdminOverview: user_id:', user_id);

      if (!user_id) {
        console.log('AdminOverview: No user_id provided, returning early');
        return;
      }

      try {
        setLoading(true);
        console.log(
          'AdminOverview: Making API call to /dashboard/recentActivity/' +
            user_id
        );

        const response = await axiosInstance.get(
          `/dashboard/recentActivity/${user_id}`
        );

        console.log('AdminOverview: Full API response:', response);
        console.log('AdminOverview: Response data:', response.data);
        console.log('AdminOverview: Response success:', response.data?.success);
        console.log('AdminOverview: Response data.data:', response.data?.data);
        console.log(
          'AdminOverview: Data is array:',
          Array.isArray(response.data?.data)
        );
        console.log('AdminOverview: Data length:', response.data?.data?.length);

        if (response.data && response.data.success && response.data.data) {
          console.log(
            'AdminOverview: Setting recent admin activity:',
            response.data.data
          );
          console.log(
            'AdminOverview: First activity metadata:',
            response.data.data[0]?.metadata
          );
          setRecentAdminActivity(response.data.data);
        } else {
          console.log('AdminOverview: Response validation failed');
          console.log('AdminOverview: - Has response.data:', !!response.data);
          console.log('AdminOverview: - Success flag:', response.data?.success);
          console.log('AdminOverview: - Has data.data:', !!response.data?.data);
        }
      } catch (error) {
        console.error(
          'AdminOverview: Failed to fetch recent admin activity:',
          error
        );
        console.error('AdminOverview: Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          status: (error as any)?.response?.status,
          statusText: (error as any)?.response?.statusText,
          data: (error as any)?.response?.data,
        });
      } finally {
        setLoading(false);
        console.log(
          'AdminOverview: Finished fetchRecentActivity, loading set to false'
        );
      }
    };

    fetchRecentActivity();
  }, [user_id]);

  // Fetch system activity data
  useEffect(() => {
    const fetchSystemActivity = async () => {
      try {
        setSystemLoading(true);
        const response = await axiosInstance.get('/dashboard/systemActivity');

        console.log('AdminOverview: System Activity Response:', response.data);

        if (response.data && response.data.success && response.data.data) {
          console.log(
            'AdminOverview: First system activity metadata:',
            response.data.data[0]?.metadata
          );
          setSystemActivity(response.data.data);
        }
      } catch (error) {
        console.error('AdminOverview: Failed to fetch system activity:', error);
      } finally {
        setSystemLoading(false);
      }
    };

    fetchSystemActivity();
  }, []);

  // Debug logs for rendering (moved outside JSX)
  console.log('AdminOverview Render: loading state:', loading);
  console.log(
    'AdminOverview Render: recentAdminActivity:',
    recentAdminActivity
  );
  console.log(
    'AdminOverview Render: recentAdminActivity.length:',
    recentAdminActivity.length
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <StatsCards analyticsData={analyticsData} loading={analyticsLoading} />

        {/* Recent Activity */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIcon sx={{ mr: 1 }} />
                  Your Recent Activity
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Your personal activities
                </Typography>
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton
                      key={idx}
                      variant="rectangular"
                      height={50}
                      sx={{ mb: 1, borderRadius: 1 }}
                    />
                  ))
                ) : recentAdminActivity.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {recentAdminActivity.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem
                          sx={{
                            px: 0,
                            py: 1.5,
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.05
                              ),
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: getRandomColor(),
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {activity.description}
                                </Typography>
                                {getMetadataName(activity) && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: 'block',
                                      color: theme.palette.primary.main,
                                      fontWeight: 500,
                                      mt: 0.5,
                                    }}
                                  >
                                    {getMetadataIcon(activity.activity_type)}{' '}
                                    {getMetadataName(activity)}
                                  </Typography>
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {activity.time}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < recentAdminActivity.length - 1 && (
                          <Divider sx={{ mx: 2, opacity: 0.5 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No recent activity found.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ActivityIcon />
                    <Typography variant="h6">System Activity</Typography>
                  </Box>
                }
              />
              <CardContent>
                {systemLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton
                      key={idx}
                      variant="rectangular"
                      height={60}
                      sx={{ mb: 1, borderRadius: 1 }}
                    />
                  ))
                ) : systemActivity.length > 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    {systemActivity.map((activity) => (
                      <Box
                        key={activity.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          p: 2,
                          borderRadius: 1,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.05
                          ),
                          '&:hover': {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            flex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: getRandomColor(),
                              mt: 0.5,
                            }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {activity.user_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              {activity.description}
                            </Typography>
                            {getMetadataName(activity) && (
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  color: theme.palette.primary.main,
                                  fontWeight: 500,
                                  mb: 0.5,
                                }}
                              >
                                {getMetadataIcon(activity.activity_type)}{' '}
                                {getMetadataName(activity)}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {activity.role} • {activity.category}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No recent system activity found.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
