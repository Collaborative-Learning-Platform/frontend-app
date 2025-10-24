import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Button,
  Card,
  Collapse,
  Fade,
  Divider,
  List,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  CardContent,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import {
  Group,
  Assignment,
  ExpandMore,
  Visibility,
  PlayArrow,
  AccessTime,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  MenuBook as BookOpenIcon,
  Group as GroupIcon,
  EmojiEvents as AwardIcon,
  Description as FileTextIcon,
} from '@mui/icons-material';
import MessageIcon from '@mui/icons-material/Message';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../../contexts/Authcontext';
import { useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

interface WorkspaceData {
  workspaceId: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  tutorCount: number;
  studentCount: number;
  groupsCount: number;
}

interface ActivityItem {
  id: string;
  user_id: string;
  user_name: string;
  group_id: string;
  group_name: string;
  workspace_id: string;
  workspace_name: string;
  category: string;
  description: string;
  created_at: string;
  time?: string;
  avatar?: string;
}

interface RecentActivityLog {
  id: string;
  category: string;
  activity_type: string;
  description: string;
  time: string;
}

const TutorOverview: React.FC = () => {
  const theme = useTheme();
  const { user_id } = useAuth();
  const [expandedWorkspace, setExpandedWorkspace] = useState<string | null>(
    null
  );
  const [groupActivities, setGroupActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentTutorActivity, setRecentTutorActivity] = useState<
    RecentActivityLog[]
  >([]);
  const [workspacesData, setWorkspacesData] = useState<WorkspaceData[]>([]);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);

  //Fetch recent student activity data
  // Fetch recent tutor activity data
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user_id) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/dashboard/recentActivity/${user_id}`
        );

        const groupActivityRes = await axiosInstance.get(
          `/dashboard/groupActivity/${user_id}`
        );

        if (response.data && response.data.success && response.data.data) {
          setRecentTutorActivity(response.data.data);
        }

        // Process the group activity response
        console.log(
          'Tutor Group Activity Success:',
          groupActivityRes.data.success
        );

        if (
          groupActivityRes.data?.success &&
          Array.isArray(groupActivityRes.data.data)
        ) {
          // Transform to match ActivityItem interface
          const transformedActivities = groupActivityRes.data.data.map(
            (item: any) => ({
              id: item.id,
              user_id: item.user_id || '',
              user_name: item.user_name || 'Unknown User',
              group_id: item.metadata?.groupId || '',
              group_name: item.group_name || 'Unknown Group',
              workspace_id: item.workspace_id || '',
              workspace_name: item.workspace_name || '',
              category: item.category || '',
              description: item.description || '',
              created_at: item.created_at || '',
              time: item.time || '',
              avatar: item.user_name
                ? item.user_name.substring(0, 2).toUpperCase()
                : '??',
            })
          );

          setGroupActivities(transformedActivities);
        }
      } catch (error) {
        console.error(
          'Failed to fetch recent tutor dashboard responses:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [user_id]);

  // Fetch workspace data
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user_id) return;

      try {
        setWorkspacesLoading(true);
        const response = await axiosInstance.get(
          `/workspace/getWorkspacesByUser/${user_id}`
        );

        if (response.data && response.data.success && response.data.data) {
          setWorkspacesData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch workspaces:', error);
      } finally {
        setWorkspacesLoading(false);
      }
    };

    fetchWorkspaces();
  }, [user_id]);

  const getActivityIcon = (category: string | undefined) => {
    if (!category) {
      console.log('Category is undefined for activity');
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
        console.log('Falling back to default icon for category:', category);
        return <BookOpenIcon />;
    }
  };

  const toggleWorkspaceExpanded = (workspaceId: string) => {
    setExpandedWorkspace(
      expandedWorkspace === workspaceId ? null : workspaceId
    );
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {' '}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your courses.
        </Typography>
      </Box>

      {/* Main Content Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1.2fr 0.8fr',
          },
          gap: 4,
          alignItems: 'start',
        }}
      >
        {/* Left Column - Workspaces and Recent Tutor Activity */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Workspaces Overview */}
          <Fade in={true} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Assignment
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                  Active Workspaces
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {workspacesLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton
                      key={idx}
                      variant="rectangular"
                      height={200}
                      sx={{ borderRadius: 2 }}
                    />
                  ))
                ) : workspacesData.length > 0 ? (
                  workspacesData.map((workspace) => (
                    <Card
                      key={workspace.workspaceId}
                      sx={{
                        border: `1px solid ${alpha(
                          theme.palette.divider,
                          0.1
                        )}`,
                        borderRadius: 2,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${alpha(
                            theme.palette.common.black,
                            0.1
                          )}`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PlayArrow
                              sx={{ color: theme.palette.primary.main, mr: 1 }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {workspace.name}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {workspace.description}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Chip
                            icon={<Group />}
                            label={`${workspace.studentCount} students`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<Group />}
                            label={`${workspace.tutorCount} tutors`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={`${workspace.groupsCount} groups`}
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              color: theme.palette.primary.main,
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 'auto' }}
                          >
                            Created{' '}
                            {new Date(workspace.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            sx={{ textTransform: 'none' }}
                          >
                            View Details
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() =>
                              toggleWorkspaceExpanded(workspace.workspaceId)
                            }
                            sx={{
                              ml: 'auto',
                              transform:
                                expandedWorkspace === workspace.workspaceId
                                  ? 'rotate(180deg)'
                                  : 'rotate(0deg)',
                              transition: 'transform 0.3s ease',
                            }}
                          >
                            <ExpandMore />
                          </IconButton>
                        </Box>

                        <Collapse
                          in={expandedWorkspace === workspace.workspaceId}
                          timeout={300}
                        >
                          <Box
                            sx={{
                              mt: 2,
                              pt: 2,
                              borderTop: `1px solid ${alpha(
                                theme.palette.divider,
                                0.1
                              )}`,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              Workspace Stats:
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                              }}
                            >
                              <Typography variant="body2">
                                • Total Members:{' '}
                                {workspace.studentCount + workspace.tutorCount}
                              </Typography>
                              <Typography variant="body2">
                                • Groups: {workspace.groupsCount}
                              </Typography>
                              <Typography variant="body2">
                                • Created by: {workspace.createdByName}
                              </Typography>
                            </Box>
                          </Box>
                        </Collapse>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 4 }}
                  >
                    No workspaces found. Create your first workspace to get
                    started.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Fade>

          {/* Recent Tutor Activity */}
          <Fade in={true} timeout={1400}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
                <TrendingUpIcon
                  sx={{ mr: 1, color: theme.palette.primary.main }}
                />
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
              ) : recentTutorActivity.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {recentTutorActivity.map((activity, index) => (
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
                          {getActivityIcon(activity.category)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {activity.description}
                            </Typography>
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
                      {index < recentTutorActivity.length - 1 && (
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
            </Paper>
          </Fade>
        </Box>

        {/* Right Column - Recent Group Activity */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Fade in={true} timeout={1200}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
                <AccessTime sx={{ mr: 1, color: theme.palette.primary.main }} />
                Recent Group Activity
              </Typography>
              {/* Add debug code in useEffect instead */}

              <List sx={{ p: 0 }}>
                {groupActivities.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No group activities found.
                  </Typography>
                ) : (
                  groupActivities.map((activity, index) => (
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
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: theme.palette.primary.main,
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}
                          >
                            {activity.avatar}
                          </Avatar>
                        </ListItemAvatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            {activity.user_name || 'Unknown User'}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {activity.description || 'Activity in group'}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              fontSize: '0.75rem',
                              color: 'text.secondary',
                            }}
                          >
                            <span>
                              Group: {activity.group_name || 'Unknown Group'}
                            </span>
                            <span>
                              Workspace:{' '}
                              {activity.workspace_name || 'Unknown Workspace'}
                            </span>
                            <span>
                              {activity.time ||
                                activity.created_at ||
                                'Recently'}
                            </span>
                          </Box>
                        </Box>
                      </ListItem>
                      {index < groupActivities.length - 1 && (
                        <Divider sx={{ mx: 2, opacity: 0.5 }} />
                      )}
                    </React.Fragment>
                  ))
                )}
              </List>
              {/* <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2,
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                View All Activity
              </Button> */}
            </Paper>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default TutorOverview;
