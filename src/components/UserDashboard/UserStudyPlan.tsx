import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  Typography,
  useTheme,
  Paper,
  Avatar,
  TextField,
  Container,
  alpha,
  IconButton,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  AutoAwesome as SparklesIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as TrophyIcon,
  Psychology as BrainIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayIcon,
  Science as ScienceIcon,
  MenuBook as BookIcon,
  Quiz as QuizIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import StudyPlanGeneratorModal from './StudyPlanGeneratorModal';
import axiosInstance from '../../api/axiosInstance';

// Types and Interfaces
interface StudyPlanTask {
  id: string;
  task: string;
  topic: string;
  estimatedTime: string;
  estimatedMinutes: number;
  completed?: boolean;
  type?: 'reading' | 'video' | 'quiz' | 'practice' | 'review';
}

interface StudyPlanDay {
  day: string;
  tasks: StudyPlanTask[];
  totalTime?: string;
  totalMinutes: number;
  actualStudyTime?: number;
}

interface StudyPlanApiResponse {
  success: boolean;
  data: {
    userId: string;
    plan: StudyPlanDay[];
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export function UserStudyPlan() {
  const theme = useTheme();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>('Monday');
  const [studyPlan, setStudyPlan] = useState<StudyPlanDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());
  const [updatingStudyTime, setUpdatingStudyTime] = useState<Set<string>>(
    new Set()
  );

  //fetch study plan from API
  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<StudyPlanApiResponse>(
          '/aiservice/getStudyPlan'
        );
        console.log('Full API response:', response.data);

        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          response.data.data.plan
        ) {
          setStudyPlan(response.data.data.plan);
          // console.log('Study plan loaded:', response.data.data.plan);
        } else {
          console.error('Unexpected API response structure:', response.data);
        }
      } catch (error) {
        // console.error('Error fetching study plan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyPlan();
  }, []);

  // Generate weekly data based on current study plan
  const weeklyData = studyPlan.map((day) => ({
    day: day.day.slice(0, 3),
    planned: day.totalMinutes,
    actual: day.actualStudyTime || 0,
    completed: day.tasks.filter((task) => task.completed).length,
    total: day.tasks.length,
    completionRate: Math.round(
      (day.tasks.filter((task) => task.completed).length / day.tasks.length) *
        100
    ),
  }));

  // Calculate progress data dynamically
  const calculateProgressData = () => {
    const allTasks = studyPlan.flatMap((day) => day.tasks);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((task) => task.completed).length;
    const inProgressDays = studyPlan.filter(
      (day) =>
        (day.actualStudyTime || 0) > 0 &&
        day.tasks.some((task) => !task.completed)
    ).length;

    const completedPercentage = Math.round((completedTasks / totalTasks) * 100);
    const inProgressPercentage = Math.round(
      (inProgressDays / studyPlan.length) * 100
    );
    const pendingPercentage = 100 - completedPercentage - inProgressPercentage;

    return [
      { name: 'Completed', value: completedPercentage, color: '#4caf50' },
      { name: 'In Progress', value: inProgressPercentage, color: '#ff9800' },
      {
        name: 'Pending',
        value: Math.max(0, pendingPercentage),
        color: '#e11340ff',
      },
    ];
  };

  const progressData = calculateProgressData();

  // Handle task completion toggle
  const handleTaskCompletion = async (
    dayName: string,
    taskId: string,
    completed: boolean
  ) => {
    // Add to updating tasks set
    setUpdatingTasks((prev) => new Set([...prev, taskId]));

    // Update local state immediately for responsive UI
    setStudyPlan((prev) =>
      prev.map((day) =>
        day.day === dayName
          ? {
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === taskId ? { ...task, completed } : task
              ),
            }
          : day
      )
    );

    try {
      await axiosInstance.patch('/aiservice/updateTaskCompletion', {
        taskId,
        completed,
        dayName,
      });
      console.log(`Task ${taskId} completion updated to ${completed}`);
    } catch (error) {
      console.error('Error updating task completion:', error);

      // Revert the change if API call fails
      setStudyPlan((prev) =>
        prev.map((day) =>
          day.day === dayName
            ? {
                ...day,
                tasks: day.tasks.map((task) =>
                  task.id === taskId ? { ...task, completed: !completed } : task
                ),
              }
            : day
        )
      );

      // Show error feedback to user (you could use a snackbar here)
      alert('Failed to update task completion. Please try again.');
    } finally {
      // Remove from updating tasks set
      setUpdatingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  // Debounce timer ref
  const studyTimeDebounceRef = useRef<{
    [dayName: string]: ReturnType<typeof setTimeout>;
  }>({});

  // Handle actual study time input with debouncing
  const handleActualStudyTime = useCallback(
    (dayName: string, minutes: number) => {
      setStudyPlan((prev) =>
        prev.map((day) =>
          day.day === dayName ? { ...day, actualStudyTime: minutes } : day
        )
      );

      // Clear existing debounce timer for this day
      if (studyTimeDebounceRef.current[dayName]) {
        clearTimeout(studyTimeDebounceRef.current[dayName]);
      }

      // Add to updating study time set
      setUpdatingStudyTime((prev) => new Set([...prev, dayName]));

      // Set new debounce timer for API call (1 second delay)
      studyTimeDebounceRef.current[dayName] = setTimeout(async () => {
        try {
          await axiosInstance.patch('/aiservice/updateStudyTime', {
            dayName,
            actualStudyTime: minutes,
          });
          console.log(
            `Study time for ${dayName} updated to ${minutes} minutes`
          );
        } catch (error) {
          console.error('Error updating study time:', error);
          // Show error feedback to user
          alert('Failed to save study time. Please try again.');
        } finally {
          // Remove from updating study time set
          setUpdatingStudyTime((prev) => {
            const newSet = new Set(prev);
            newSet.delete(dayName);
            return newSet;
          });
        }
      }, 1000);
    },
    []
  );

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(studyTimeDebounceRef.current).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  // Bulk complete all tasks for a day
  const handleCompleteAllTasks = async (
    dayName: string,
    completed: boolean,
    actualStudyTime: number
  ) => {
    const day = studyPlan.find((d) => d.day === dayName);
    if (!day) return;

    const taskIds = day.tasks.map((task) => task.id);

    // Add all task IDs to updating set
    setUpdatingTasks((prev) => new Set([...prev, ...taskIds]));

    setStudyPlan((prev) =>
      prev.map((d) =>
        d.day === dayName
          ? {
              ...d,
              tasks: d.tasks.map((task) => ({ ...task, completed })),
              // Auto-set study time to planned time when completing all tasks
              ...(completed &&
              (d.actualStudyTime === undefined || d.actualStudyTime === 0)
                ? { actualStudyTime: d.totalMinutes }
                : {}),
            }
          : d
      )
    );

    try {
      const updateData: any = {
        dayName,
        taskIds,
        completed,
        actualStudyTime,
      };

      // Include study time update if auto-setting
      if (
        completed &&
        (day.actualStudyTime === undefined || day.actualStudyTime === 0)
      ) {
        updateData.actualStudyTime = day.totalMinutes;
      }

      await axiosInstance.patch(
        '/aiservice/bulkUpdateTaskCompletion',
        updateData
      );
      console.log(
        `All tasks for ${dayName} ${completed ? 'completed' : 'uncompleted'}`
      );
    } catch (error) {
      console.error('Error bulk updating tasks:', error);

      // Revert changes
      setStudyPlan((prev) =>
        prev.map((d) =>
          d.day === dayName
            ? {
                ...d,
                tasks: d.tasks.map((task) => ({
                  ...task,
                  completed: !completed,
                })),
                // Revert study time if it was auto-set
                ...(completed && day.actualStudyTime === 0
                  ? { actualStudyTime: 0 }
                  : {}),
              }
            : d
        )
      );

      alert('Failed to update tasks. Please try again.');
    } finally {
      // Remove all task IDs from updating set
      setUpdatingTasks((prev) => {
        const newSet = new Set(prev);
        taskIds.forEach((id) => newSet.delete(id));
        return newSet;
      });
    }
  };

  // Refresh study plan
  const refreshStudyPlan = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<StudyPlanApiResponse>(
        '/aiservice/getStudyPlan'
      );

      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        response.data.data.plan
      ) {
        setStudyPlan(response.data.data.plan);
        console.log('Study plan refreshed:', response.data.data.plan);
      }
    } catch (error) {
      console.error('Error refreshing study plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'reading':
        return <BookIcon />;
      case 'video':
        return <PlayIcon />;
      case 'quiz':
        return <QuizIcon />;
      case 'practice':
        return <ScienceIcon />;
      case 'review':
        return <RefreshIcon />;
      default:
        return <BookIcon />;
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'reading':
        return theme.palette.primary.main;
      case 'video':
        return theme.palette.error.main;
      case 'quiz':
        return theme.palette.warning.main;
      case 'practice':
        return theme.palette.success.main;
      case 'review':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // const renderCustomizedLabel = ({
  //   cx,
  //   cy,
  //   midAngle,
  //   innerRadius,
  //   outerRadius,
  //   percent,
  // }: any) => {
  //   const RADIAN = Math.PI / 180;
  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

  //   return (
  //     <text
  //       x={x}
  //       y={y}
  //       fill="white"
  //       textAnchor={x > cx ? 'start' : 'end'}
  //       dominantBaseline="central"
  //     >
  //       {`${(percent * 100).toFixed(0)}%`}
  //     </text>
  //   );
  // };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary">
            Loading your personalized study plan...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show empty state when no study plan exists
  if (!studyPlan || studyPlan.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '500px',
            textAlign: 'center',
            gap: 3,
          }}
        >
          <Box
            sx={{
              p: 4,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 3,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              maxWidth: 600,
              width: '100%',
            }}
          >
            <BrainIcon
              sx={{
                fontSize: 80,
                color: theme.palette.primary.main,
                mb: 2,
                opacity: 0.8,
              }}
            />
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              No Study Plan Found
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              It looks like you haven't created a personalized study plan yet.
              Our AI-powered study plan generator can create a customized
              learning schedule based on your goals, available time, and
              learning preferences.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                What you'll get:
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                  width: '100%',
                  maxWidth: 400,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon color="primary" fontSize="small" />
                  <Typography variant="body2">Daily schedules</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrophyIcon color="primary" fontSize="small" />
                  <Typography variant="body2">Progress tracking</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimelineIcon color="primary" fontSize="small" />
                  <Typography variant="body2">Learning analytics</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SparklesIcon color="primary" fontSize="small" />
                  <Typography variant="body2">AI recommendations</Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<SparklesIcon />}
              onClick={() => setOpenCreateModal(true)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              Create Your AI Study Plan
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 2 }}
            >
              Takes less than 2 minutes to set up
            </Typography>
          </Box>
        </Box>

        {/* Create Study Plan Modal */}
        <StudyPlanGeneratorModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onPlanGenerated={(plan: StudyPlanDay[]) => {
            setOpenCreateModal(false);
            setStudyPlan(plan);
          }}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '1.5rem', sm: '2.125rem' },
              }}
            >
              <BrainIcon color="primary" />
              Your AI Study Plan
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Personalized learning roadmap powered by artificial intelligence
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<SparklesIcon />}
            onClick={() => {
              setOpenCreateModal(true);
              refreshStudyPlan();
            }}
            sx={{
              alignSelf: { xs: 'flex-start', sm: 'center' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            Regenerate Plan
          </Button>
        </Box>

        {/* Message */}
        <Paper
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrophyIcon
              sx={{ color: theme.palette.warning.main, fontSize: 32 }}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {studyPlan
                  .flatMap((day) => day.tasks)
                  .filter((task) => task.completed).length > 0
                  ? 'Great progress! Keep up the momentum!'
                  : 'Ready to start your learning journey?'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {studyPlan
                  .flatMap((day) => day.tasks)
                  .filter((task) => task.completed).length > 0
                  ? `You've completed ${
                      studyPlan
                        .flatMap((day) => day.tasks)
                        .filter((task) => task.completed).length
                    } out of ${
                      studyPlan.flatMap((day) => day.tasks).length
                    } tasks. Stay focused on your goals!`
                  : 'Click on the checkboxes to mark tasks as complete and track your study time for each day.'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Quick Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            {
              studyPlan
                .flatMap((day) => day.tasks)
                .filter((task) => task.completed).length
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tasks Completed
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="success.main">
            {studyPlan.reduce(
              (acc, day) => acc + (day.actualStudyTime || 0),
              0
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Minutes Studied
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="warning.main">
            {
              studyPlan.filter(
                (day) => (day.actualStudyTime || 0) >= day.totalMinutes
              ).length
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Daily Goals Met
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="info.main">
            {Math.round(
              (studyPlan
                .flatMap((day) => day.tasks)
                .filter((task) => task.completed).length /
                studyPlan.flatMap((day) => day.tasks).length) *
                100
            ) || 0}
            %
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overall Progress
          </Typography>
        </Paper>
      </Box>

      {/* Progress Overview */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon />
                Weekly Progress
              </Box>
            }
          />
          <CardContent sx={{ px: { xs: 1, sm: 3 } }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis
                  label={{
                    value: 'Minutes',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="planned"
                  fill={theme.palette.primary.main}
                  name="Planned"
                />
                <Bar
                  dataKey="actual"
                  fill={theme.palette.success.main}
                  name="Actual"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card sx={{ height: 'fit-content' }}>
          <CardHeader title="Overall Progress" />
          <CardContent sx={{ px: { xs: 1, sm: 3 } }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="none"
                >
                  {progressData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {progressData.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: item.color,
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {item.name}: {item.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Daily Study Plan */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon />
              Your Weekly Study Schedule
            </Box>
          }
          subheader="Click on any day to view detailed tasks"
        />
        <CardContent>
          {studyPlan.map((dayPlan: StudyPlanDay) => (
            <Paper key={dayPlan.day} sx={{ mb: 2, overflow: 'hidden' }}>
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  bgcolor:
                    expandedDay === dayPlan.day
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 1, sm: 2 },
                }}
                onClick={() =>
                  setExpandedDay(
                    expandedDay === dayPlan.day ? null : dayPlan.day
                  )
                }
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 2 },
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ minWidth: 'fit-content' }}
                  >
                    {dayPlan.day}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <Chip
                      label={`${dayPlan.tasks.length} tasks`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={dayPlan.totalTime}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                      }}
                    />
                    {dayPlan.actualStudyTime !== undefined &&
                      dayPlan.actualStudyTime > 0 && (
                        <Chip
                          label={`Actual: ${dayPlan.actualStudyTime}min`}
                          size="small"
                          sx={{
                            bgcolor:
                              dayPlan.actualStudyTime >= dayPlan.totalMinutes
                                ? theme.palette.success.main
                                : theme.palette.warning.main,
                            color: 'white',
                          }}
                        />
                      )}
                    <Chip
                      label={`${Math.round(
                        (dayPlan.tasks.filter((t) => t.completed).length /
                          dayPlan.tasks.length) *
                          100
                      )}% done`}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.8),
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteAllTasks(
                        dayPlan.day,
                        true,
                        dayPlan.actualStudyTime || 0
                      );
                    }}
                    disabled={
                      dayPlan.tasks.every((task) => task.completed) ||
                      dayPlan.tasks.some((task) => updatingTasks.has(task.id))
                    }
                    sx={{ minWidth: 'auto', px: 1, fontSize: '0.75rem' }}
                  >
                    ✓ All
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteAllTasks(
                        dayPlan.day,
                        false,
                        dayPlan.actualStudyTime || 0
                      );
                    }}
                    disabled={
                      dayPlan.tasks.every((task) => !task.completed) ||
                      dayPlan.tasks.some((task) => updatingTasks.has(task.id))
                    }
                    sx={{ minWidth: 'auto', px: 1, fontSize: '0.75rem' }}
                  >
                    ✗ All
                  </Button>
                  <IconButton sx={{ flexShrink: 0 }}>
                    <ExpandMoreIcon
                      sx={{
                        transform:
                          expandedDay === dayPlan.day
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={expandedDay === dayPlan.day}>
                <Divider />
                <Box sx={{ p: 2 }}>
                  {/* Actual Study Time Input */}
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <ScheduleIcon fontSize="small" />
                      Track Your Study Time
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <TextField
                        size="small"
                        type="number"
                        label="Minutes studied"
                        value={dayPlan.actualStudyTime || ''}
                        onChange={(e) =>
                          handleActualStudyTime(
                            dayPlan.day,
                            parseInt(e.target.value) || 0
                          )
                        }
                        InputProps={{
                          inputProps: { min: 0, max: 1440 },
                          endAdornment: updatingStudyTime.has(dayPlan.day) ? (
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                          ) : null,
                        }}
                        sx={{ width: { xs: '100%', sm: 150 } }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Planned: {dayPlan.totalMinutes} minutes
                      </Typography>
                      {dayPlan.actualStudyTime !== undefined &&
                        dayPlan.actualStudyTime > 0 && (
                          <Typography
                            variant="body2"
                            color={
                              dayPlan.actualStudyTime >= dayPlan.totalMinutes
                                ? 'success.main'
                                : 'warning.main'
                            }
                            sx={{ fontWeight: 500 }}
                          >
                            {dayPlan.actualStudyTime >= dayPlan.totalMinutes
                              ? '✓ Goal achieved!'
                              : 'Keep going!'}
                          </Typography>
                        )}
                    </Box>
                  </Box>

                  {/* Tasks List */}
                  {dayPlan.tasks.map((task: StudyPlanTask) => (
                    <Box
                      key={task.id}
                      sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                        p: 2,
                        mb: 1,
                        bgcolor: alpha(
                          getTaskTypeColor(task.type || 'reading'),
                          0.1
                        ),
                        borderRadius: 2,
                        borderLeft: `4px solid ${getTaskTypeColor(
                          task.type || 'reading'
                        )}`,
                        opacity: task.completed ? 0.7 : 1,
                        transition: 'all 0.3s ease',
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          width: { xs: '100%', sm: 'auto' },
                        }}
                      >
                        <Checkbox
                          checked={task.completed || false}
                          disabled={updatingTasks.has(task.id)}
                          onChange={(e) =>
                            handleTaskCompletion(
                              dayPlan.day,
                              task.id,
                              e.target.checked
                            )
                          }
                          icon={
                            updatingTasks.has(task.id) ? (
                              <CircularProgress
                                size={20}
                                sx={{ color: 'action.disabled' }}
                              />
                            ) : (
                              <CheckCircleIcon
                                sx={{ color: 'action.disabled' }}
                              />
                            )
                          }
                          checkedIcon={
                            updatingTasks.has(task.id) ? (
                              <CircularProgress
                                size={20}
                                sx={{ color: 'success.main' }}
                              />
                            ) : (
                              <CheckCircleIcon sx={{ color: 'success.main' }} />
                            )
                          }
                          sx={{
                            '&:hover': {
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                            },
                            flexShrink: 0,
                          }}
                        />
                        <Avatar
                          sx={{
                            bgcolor: task.completed
                              ? theme.palette.success.main
                              : getTaskTypeColor(task.type || 'reading'),
                            width: 32,
                            height: 32,
                            transition: 'background-color 0.3s ease',
                            flexShrink: 0,
                          }}
                        >
                          {task.completed ? (
                            <CheckCircleIcon />
                          ) : (
                            getTaskIcon(task.type || 'reading')
                          )}
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            fontWeight={500}
                            sx={{
                              textDecoration: task.completed
                                ? 'line-through'
                                : 'none',
                              color: task.completed
                                ? 'text.disabled'
                                : 'text.primary',
                              transition: 'all 0.3s ease',
                              wordBreak: 'break-word',
                            }}
                          >
                            {task.task}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: task.completed
                                ? 'text.disabled'
                                : 'text.secondary',
                              transition: 'color 0.3s ease',
                              display: 'block',
                            }}
                          >
                            {task.topic} • {task.estimatedTime}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'row', sm: 'column' },
                          alignItems: { xs: 'center', sm: 'flex-end' },
                          gap: 1,
                          justifyContent: { xs: 'flex-end', sm: 'center' },
                          flexShrink: 0,
                          width: { xs: '100%', sm: 'auto' },
                        }}
                      >
                        <Chip
                          label={task.type || 'reading'}
                          size="small"
                          sx={{
                            bgcolor: task.completed
                              ? alpha(theme.palette.success.main, 0.2)
                              : alpha(
                                  getTaskTypeColor(task.type || 'reading'),
                                  0.2
                                ),
                            color: task.completed
                              ? theme.palette.success.main
                              : getTaskTypeColor(task.type || 'reading'),
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                          }}
                        />
                        {task.completed && (
                          <Typography
                            variant="caption"
                            color="success.main"
                            sx={{
                              fontSize: '0.7rem',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ✓ Completed
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Paper>
          ))}
        </CardContent>
      </Card>

      {/* Create Study Plan Modal */}
      <StudyPlanGeneratorModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onPlanGenerated={(plan: StudyPlanDay[]) => {
          setOpenCreateModal(false);
          setStudyPlan(plan);
        }}
      />
    </Container>
  );
}
