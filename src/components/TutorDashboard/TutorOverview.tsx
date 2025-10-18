import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Button,
  LinearProgress,
  Card,
  Collapse,
  Fade,
  Divider,
  Menu,
  MenuItem,
  List,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  CardContent,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Group,
  Assignment,
  Star,
  ExpandMore,
  Visibility,
  Edit,
  Delete,
  PlayArrow,
  Pause,
  CheckCircle,
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
  id: string;
  title: string;
  students: number;
  completion: number;
  status: 'active' | 'paused' | 'completed';
  lastActivity: string;
  description: string;
}

interface ActivityItem {
  id: string;
  type: 'submission' | 'question' | 'completion' | 'join';
  student: string;
  workspace: string;
  timestamp: string;
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedWorkspace, setExpandedWorkspace] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [recentTutorActivity, setRecentTutorActivity] = useState<
    RecentActivityLog[]
  >([]);

  // Fetch recent tutor activity data
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user_id) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/dashboard/recentActivity/${user_id}`
        );

        if (response.data && response.data.success && response.data.data) {
          setRecentTutorActivity(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch recent tutor activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
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
  const workspacesData: WorkspaceData[] = [
    {
      id: '1',
      title: 'Advanced React Concepts',
      students: 24,
      completion: 85,
      status: 'active',
      lastActivity: '2 hours ago',
      description:
        'Deep dive into React hooks, context API, and performance optimization',
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      students: 18,
      completion: 92,
      status: 'active',
      lastActivity: '4 hours ago',
      description: 'Complete guide to ES6+ features and modern JavaScript',
    },
    {
      id: '3',
      title: 'Node.js Backend Development',
      students: 15,
      completion: 67,
      status: 'active',
      lastActivity: '1 day ago',
      description:
        'Building scalable backend applications with Node.js and Express',
    },
    {
      id: '4',
      title: 'Web Design Principles',
      students: 22,
      completion: 100,
      status: 'completed',
      lastActivity: '3 days ago',
      description: 'UI/UX design fundamentals and responsive web design',
    },
  ];

  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'submission',
      student: 'Alice Johnson',
      workspace: 'Advanced React Concepts',
      timestamp: '15 minutes ago',
      avatar: 'AJ',
    },
    {
      id: '2',
      type: 'question',
      student: 'Bob Smith',
      workspace: 'JavaScript Fundamentals',
      timestamp: '1 hour ago',
      avatar: 'BS',
    },
    {
      id: '3',
      type: 'completion',
      student: 'Carol Wilson',
      workspace: 'Web Design Principles',
      timestamp: '2 hours ago',
      avatar: 'CW',
    },
    {
      id: '4',
      type: 'join',
      student: 'David Brown',
      workspace: 'Node.js Backend Development',
      timestamp: '3 hours ago',
      avatar: 'DB',
    },
    {
      id: '5',
      type: 'submission',
      student: 'Eva Davis',
      workspace: 'Advanced React Concepts',
      timestamp: '4 hours ago',
      avatar: 'ED',
    },
  ];
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleWorkspaceExpanded = (workspaceId: string) => {
    setExpandedWorkspace(
      expandedWorkspace === workspaceId ? null : workspaceId
    );
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayArrow sx={{ color: theme.palette.primary.main }} />;
      case 'paused':
        return <Pause sx={{ color: theme.palette.primary.dark }} />;
      case 'completed':
        return <CheckCircle sx={{ color: theme.palette.primary.main }} />;
      default:
        return <PlayArrow />;
    }
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
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 4,
        }}
      >
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
                sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
              >
                <Assignment sx={{ mr: 1, color: theme.palette.primary.main }} />
                Active Workspaces
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {workspacesData.map((workspace) => (
                <Card
                  key={workspace.id}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
                        {getStatusIcon(workspace.status)}
                        <Typography
                          variant="h6"
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          {workspace.title}
                        </Typography>
                      </Box>{' '}
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <MoreVertIcon />
                      </IconButton>
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
                        label={`${workspace.students} students`}
                        size="small"
                        variant="outlined"
                      />{' '}
                      <Chip
                        label={workspace.status}
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
                        Updated {workspace.lastActivity}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {workspace.completion}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={workspace.completion}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: theme.palette.primary.main,
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        sx={{ textTransform: 'none' }}
                      >
                        View Details
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => toggleWorkspaceExpanded(workspace.id)}
                        sx={{
                          ml: 'auto',
                          transform:
                            expandedWorkspace === workspace.id
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        <ExpandMore />
                      </IconButton>
                    </Box>

                    <Collapse
                      in={expandedWorkspace === workspace.id}
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
                          Additional Details:
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2">
                            • Course Duration: 8 weeks
                          </Typography>
                          <Typography variant="body2">
                            • Next Assignment Due: Tomorrow
                          </Typography>
                          <Typography variant="body2">
                            • Average Grade: 87%
                          </Typography>
                        </Box>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Fade>

        {/* Recent Student Activity */}
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
              <List sx={{ p: 0 }}>
                {recentActivity.map((activity, index) => (
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
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {activity.student}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              {activity.type === 'submission' &&
                                `Submitted assignment in ${activity.workspace}`}
                              {activity.type === 'question' &&
                                `Asked a question in ${activity.workspace}`}
                              {activity.type === 'completion' &&
                                `Completed ${activity.workspace}`}
                              {activity.type === 'join' &&
                                `Joined ${activity.workspace}`}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {activity.timestamp}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && (
                      <Divider sx={{ mx: 2, opacity: 0.5 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2,
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                View All Activity
              </Button>
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
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit Workspace
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Star sx={{ mr: 1 }} fontSize="small" />
          Mark as Featured
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Delete Workspace
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TutorOverview;
