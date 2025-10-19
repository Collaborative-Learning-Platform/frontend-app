import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  Chip,
  Button,
  useTheme,
  alpha,
  Stack,
  Collapse,
  Fade,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip as MuiTooltip,
} from '@mui/material';
import {
  ExpandMore,
  Refresh,
  Publish,
  UnpublishedOutlined,
} from '@mui/icons-material';
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
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from '../../contexts/Authcontext';
import axiosInstance from '../../api/axiosInstance';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Quiz {
  id: number;
  quizId: string;
  title: string;
  description: string;
  workspace: string;
  attempts: number;
  avgScore: number;
  dueDate: string;
  scoreDistribution: PerformanceData[];
  totalStudents: number;
  isPublished: boolean;
}

type PerformanceData = {
  scoreRange: string;
  studentCount: number;
};

interface WorkspacePerformance {
  workspaceName: string;
  avgScore: number;
  totalAttempts: number;
}

export default function TutorAnalytics() {
  const theme = useTheme();
  const { user_id } = useAuth();
  const [expandedQuizDetails, setExpandedQuizDetails] = useState<number | null>(
    null
  );
  const [tutorQuizzes, setTutorQuizzes] = useState<Quiz[]>([]);
  const [workspacePerformance, setWorkspacePerformance] = useState<
    WorkspacePerformance[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishingQuiz, setPublishingQuiz] = useState<string | null>(null);

  // Calculate score distribution from attempts
  const calculateScoreDistribution = (attempts: any[]): PerformanceData[] => {
    const ranges = [
      { min: 90, max: 100, label: '90-100%' },
      { min: 80, max: 89, label: '80-89%' },
      { min: 70, max: 79, label: '70-79%' },
      { min: 60, max: 69, label: '60-69%' },
      { min: 50, max: 59, label: '50-59%' },
      { min: 0, max: 49, label: '0-49%' },
    ];

    return ranges.map((range) => ({
      scoreRange: range.label,
      studentCount: attempts.filter(
        (attempt) => attempt.score >= range.min && attempt.score <= range.max
      ).length,
    }));
  };

  const fetchQuizData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching quizzes for user:', user_id);
      const quizResponse = await axiosInstance.get(`/quiz/user/${user_id}`);
      console.log('Quiz response:', quizResponse.data);

      if (!quizResponse.data.success) {
        throw new Error(quizResponse.data.message || 'Failed to fetch quizzes');
      }

      const rawQuizzes = quizResponse.data.data || [];

      if (rawQuizzes.length === 0) {
        setTutorQuizzes([]);
        setWorkspacePerformance([]);
        setLoading(false);
        return;
      }

      let userGroups = [];
      try {
        const groupResponse = await axiosInstance.post(
          '/workspace/groups/by-user',
          {
            userId: user_id,
          }
        );
        console.log('Groups response:', groupResponse.data);

        if (groupResponse.data.success) {
          userGroups = groupResponse.data.data || [];
        }
      } catch (groupError) {
        console.warn('Could not fetch groups:', groupError);
      }

      const processedQuizzes = await Promise.all(
        rawQuizzes.map(async (quiz: any, index: number) => {
          console.log(`Processing quiz ${index + 1}:`, quiz.title);

          // Find group information
          const group = userGroups.find((g: any) => g.groupId === quiz.groupId);

          // Fetch attempts for this quiz
          let attempts = [];
          try {
            const attemptResponse = await axiosInstance.get(
              `/quiz/attempt/${quiz.quizId}`
            );
            console.log(`Attempts for ${quiz.title}:`, attemptResponse.data);

            if (attemptResponse.data.success) {
              attempts = attemptResponse.data.data || [];
            }
          } catch (attemptError) {
            console.warn(
              `Could not fetch attempts for quiz ${quiz.quizId}:`,
              attemptError
            );
          }

          // Calculate statistics
          const avgScore =
            attempts.length > 0
              ? Math.round(
                  attempts.reduce(
                    (sum: number, attempt: any) => sum + attempt.score,
                    0
                  ) / attempts.length
                )
              : 0;

          const scoreDistribution = calculateScoreDistribution(attempts);

          return {
            id: index + 1,
            quizId: quiz.quizId,
            title: quiz.title,
            description: quiz.description || '',
            workspace:
              group?.workspace_name ||
              quiz.workspaceName ||
              'Unknown Workspace',
            attempts: attempts.length,
            avgScore,
            dueDate: quiz.deadline
              ? quiz.deadline.split('T')[0]
              : 'No due date',
            scoreDistribution,
            totalStudents: attempts.length,
            isPublished: quiz.isPublished || false,
          };
        })
      );

      console.log('Processed quizzes:', processedQuizzes);
      setTutorQuizzes(processedQuizzes);

      // Calculate workspace performance
      const workspaceMap = new Map<
        string,
        { totalScore: number; totalAttempts: number }
      >();

      processedQuizzes.forEach((quiz) => {
        const workspaceName = quiz.workspace;
        if (!workspaceMap.has(workspaceName)) {
          workspaceMap.set(workspaceName, { totalScore: 0, totalAttempts: 0 });
        }

        const workspace = workspaceMap.get(workspaceName)!;
        workspace.totalScore += quiz.avgScore * quiz.attempts;
        workspace.totalAttempts += quiz.attempts;
      });

      const workspacePerf = Array.from(workspaceMap.entries()).map(
        ([workspaceName, data]) => ({
          workspaceName,
          avgScore:
            data.totalAttempts > 0
              ? Math.round(data.totalScore / data.totalAttempts)
              : 0,
          totalAttempts: data.totalAttempts,
        })
      );

      console.log('Workspace performance:', workspacePerf);
      setWorkspacePerformance(workspacePerf);
    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError(
        err.message || 'Failed to load analytics data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    if (user_id) {
      fetchQuizData();
    }
  }, [user_id, fetchQuizData]);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  const toggleQuizDetails = (quizId: number) => {
    setExpandedQuizDetails(expandedQuizDetails === quizId ? null : quizId);
  };
  const handleTogglePublish = async (quiz: Quiz) => {
    setPublishingQuiz(quiz.quizId);

    try {
      const newPublishStatus = !quiz.isPublished;

     
      let response;
      try {
        response = await axiosInstance.post(`/quiz/update/${quiz.quizId}`, {
          isPublished: newPublishStatus,
        });
      } catch (err: any) {
        
        if (err.response?.status === 404) {
          response = await axiosInstance.put(`/quiz/${quiz.quizId}`, {
            isPublished: newPublishStatus,
          });
        } else {
          throw err;
        }
      }

      if (response.data.success || response.status === 200) {
        setTutorQuizzes((prevQuizzes) =>
          prevQuizzes.map((q) =>
            q.quizId === quiz.quizId
              ? { ...q, isPublished: newPublishStatus }
              : q
          )
        );

        // Log the activity
        try {
          await axiosInstance.post('/analytics/log-activity', {
            category: 'QUIZ',
            activity_type: newPublishStatus
              ? 'PUBLISHED_QUIZ'
              : 'UNPUBLISHED_QUIZ',
            metadata: {
              quizId: quiz.quizId,
              quizTitle: quiz.title,
              isPublished: newPublishStatus,
            },
          });
        } catch (logError) {
          console.warn('Failed to log activity:', logError);
          // Continue anyway - this is not critical
        }

        console.log(
          `Quiz ${newPublishStatus ? 'published' : 'unpublished'} successfully`
        );
      } else {
        throw new Error(
          response.data?.message || 'Failed to update publish status'
        );
      }
    } catch (err: any) {
      console.error('Error toggling quiz publish status:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update quiz publish status'
      );
    } finally {
      setPublishingQuiz(null);
    }
  };

  const getChartData = (quiz: Quiz) => ({
    labels: quiz.scoreDistribution.map((item) => item.scoreRange),
    datasets: [
      {
        label: 'Number of Students',
        data: quiz.scoreDistribution.map((item) => item.studentCount),
        backgroundColor: alpha(theme.palette.primary.main, 0.6),
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  });

  const getDifficultyAnalysis = () => {
    if (tutorQuizzes.length === 0)
      return {
        easy: 0,
        medium: 0,
        hard: 0,
        overallAvg: 0,
        publishedCount: 0,
        totalCount: 0,
      };

    const totalQuizzes = tutorQuizzes.length;
    const publishedQuizzes = tutorQuizzes.filter((q) => q.isPublished).length;
    const avgScores = tutorQuizzes.map((q) => q.avgScore);
    const overallAvg =
      avgScores.reduce((sum, score) => sum + score, 0) / totalQuizzes;

    const easy = Math.round(
      (avgScores.filter((score) => score >= 85).length / totalQuizzes) * 100
    );
    const medium = Math.round(
      (avgScores.filter((score) => score >= 70 && score < 85).length /
        totalQuizzes) *
        100
    );
    const hard = Math.round(
      (avgScores.filter((score) => score < 70).length / totalQuizzes) * 100
    );

    return {
      easy,
      medium,
      hard,
      overallAvg: Math.round(overallAvg),
      publishedCount: publishedQuizzes,
      totalCount: totalQuizzes,
    };
  };

  const difficultyAnalysis = getDifficultyAnalysis();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading analytics data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchQuizData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {' '}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <BarChartIcon sx={{ fontSize: 30 }} />
        <Typography variant="h4" fontWeight="bold">
          Quiz Analytics
        </Typography>{' '}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          
          
          <Button
            variant="outlined"
            size="small"
            onClick={fetchQuizData}
            startIcon={<Refresh />}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 3,
          '& > *': {
            flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 12px)' },
          },
        }}
      >
       
        <Card elevation={2}>
          <CardHeader
            title="Quiz Performance by Workspace"
            subheader={`Average scores across your ${workspacePerformance.length} workspaces`}
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            subheaderTypographyProps={{
              variant: 'body2',
              color: 'text.secondary',
            }}
          />
          <CardContent>
            <Stack spacing={3}>
              {workspacePerformance.length > 0 ? (
                workspacePerformance.map((workspace, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {workspace.workspaceName}
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {workspace.avgScore}% ({workspace.totalAttempts}{' '}
                        attempts)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(workspace.avgScore, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  No workspace data available
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Quiz Difficulty Analysis */}
        <Card elevation={2}>
          <CardHeader
            title="Quiz Difficulty Analysis"
            subheader={`Performance trends across your ${tutorQuizzes.length} quizzes`}
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            subheaderTypographyProps={{
              variant: 'body2',
              color: 'text.secondary',
            }}
          />
          <CardContent>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2">Easy Quizzes (85%+ avg)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {difficultyAnalysis.easy}% of quizzes
                  </Typography>
                  <Chip
                    label="Excellent"
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      fontWeight: 'medium',
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2">
                  Medium Quizzes (70-84% avg)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {difficultyAnalysis.medium}% of quizzes
                  </Typography>
                  <Chip
                    label="Good"
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      fontWeight: 'medium',
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2">
                  Hard Quizzes (&lt;70% avg)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {difficultyAnalysis.hard}% of quizzes
                  </Typography>
                  <Chip
                    label="Needs Focus"
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      fontWeight: 'medium',
                    }}
                  />
                </Box>
              </Box>{' '}
              {tutorQuizzes.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Overall Average:{' '}
                    <strong>{difficultyAnalysis.overallAvg}%</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Publication Status:{' '}
                    <strong>{difficultyAnalysis.publishedCount}</strong>{' '}
                    published,{' '}
                    <strong>
                      {difficultyAnalysis.totalCount -
                        difficultyAnalysis.publishedCount}
                    </strong>{' '}
                    draft
                  </Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
      {/* Recent Quiz Results */}
      <Card elevation={2}>
        <CardHeader
          title="Recent Quiz Results"
          subheader={`Detailed breakdown of your ${tutorQuizzes.length} quizzes`}
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
          subheaderTypographyProps={{
            variant: 'body2',
            color: 'text.secondary',
          }}
        />
        <CardContent>
          <Stack spacing={3}>
            {tutorQuizzes.length > 0 ? (
              tutorQuizzes.map((quiz) => (
                <Box key={quiz.id}>
                  {/* Main Quiz Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: alpha(
                          theme.palette.action.hover,
                          0.04
                        ),
                      },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {quiz.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {quiz.workspace}
                      </Typography>
                      {quiz.description && (
                        <Typography variant="caption" color="text.secondary">
                          {quiz.description}
                        </Typography>
                      )}
                    </Box>{' '}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                        <Typography variant="caption" color="text.secondary">
                          Status
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                          }}
                        >
                          <Chip
                            label={quiz.isPublished ? 'Published' : 'Draft'}
                            size="small"
                            color={quiz.isPublished ? 'success' : 'default'}
                            variant={quiz.isPublished ? 'filled' : 'outlined'}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                        <Typography variant="caption" color="text.secondary">
                          Attempts
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {quiz.attempts}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                        <Typography variant="caption" color="text.secondary">
                          Avg Score
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color={
                            quiz.avgScore >= 80
                              ? 'success.main'
                              : quiz.avgScore >= 60
                              ? 'warning.main'
                              : 'error.main'
                          }
                        >
                          {quiz.avgScore}%
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                        <Typography variant="caption" color="text.secondary">
                          Due Date
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {quiz.dueDate}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <MuiTooltip
                          title={
                            quiz.isPublished ? 'Unpublish Quiz' : 'Publish Quiz'
                          }
                        >
                          <IconButton
                            color={quiz.isPublished ? 'success' : 'default'}
                            onClick={() => handleTogglePublish(quiz)}
                            disabled={publishingQuiz === quiz.quizId}
                            size="small"
                          >
                            {publishingQuiz === quiz.quizId ? (
                              <CircularProgress size={20} />
                            ) : quiz.isPublished ? (
                              <Publish />
                            ) : (
                              <UnpublishedOutlined />
                            )}
                          </IconButton>
                        </MuiTooltip>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => toggleQuizDetails(quiz.id)}
                          disabled={quiz.attempts === 0}
                          endIcon={
                            <Box
                              sx={{
                                transition: 'transform 0.3s ease',
                                transform:
                                  expandedQuizDetails === quiz.id
                                    ? 'rotate(180deg)'
                                    : 'rotate(0deg)',
                              }}
                            >
                              <ExpandMore />
                            </Box>
                          }
                        >
                          {expandedQuizDetails === quiz.id
                            ? 'Hide Details'
                            : quiz.attempts === 0
                            ? 'No Attempts'
                            : 'View Details'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  <Collapse in={expandedQuizDetails === quiz.id} timeout={500}>
                    <Fade in={expandedQuizDetails === quiz.id} timeout={600}>
                      <Box sx={{ ml: 2, mt: 2 }}>
                        <Card variant="outlined">
                          <CardHeader
                            title="Student Score Distribution"
                            subheader={`Score breakdown for ${quiz.title} (${quiz.attempts} attempts)`}
                            titleTypographyProps={{ variant: 'h6' }}
                            subheaderTypographyProps={{
                              variant: 'body2',
                              color: 'text.secondary',
                            }}
                          />
                          <CardContent>
                            {quiz.attempts > 0 ? (
                              <>
                                <Box sx={{ height: 300, mb: 3 }}>
                                  <Bar
                                    data={getChartData(quiz)}
                                    options={chartOptions}
                                  />
                                </Box>

                                {/* Summary Statistics */}
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 3,
                                    '& > *': {
                                      flex: {
                                        xs: '1 1 100%',
                                        sm: '1 1 calc(33.333% - 16px)',
                                      },
                                      textAlign: 'center',
                                    },
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Total Students
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                      color="primary.main"
                                    >
                                      {quiz.attempts}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Top Performers (90%+)
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                      color="success.main"
                                    >
                                      {quiz.scoreDistribution[0]
                                        ?.studentCount || 0}{' '}
                                      students
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Below 60%
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                      color="error.main"
                                    >
                                      {quiz.scoreDistribution
                                        .slice(-2)
                                        .reduce(
                                          (sum, range) =>
                                            sum + range.studentCount,
                                          0
                                        )}{' '}
                                      students
                                    </Typography>
                                  </Box>
                                </Box>
                              </>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                              >
                                No attempts yet for this quiz
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Box>
                    </Fade>
                  </Collapse>
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <Typography variant="body1">
                  No quizzes found. Create your first quiz to see analytics
                  here.
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
