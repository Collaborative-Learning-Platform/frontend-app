import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Quiz,
  Timer,
  CheckCircle,
  PlayArrow,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../contexts/Authcontext';

interface QuizItem {
  quizId: string;
  title: string;
  description: string;
  timeLimit: number;
  deadline: string;
  isPublished: boolean;
  createdById: string;
  groupId: string;
  completed?: boolean;
  score?: number;
}

interface QuizSectionProps {
  groupId: string;
}

const QuizSection = ({ groupId }: QuizSectionProps) => {
  const { user_id } = useAuth();
  console.log('QuizSection groupId:', groupId); // For debugging
  const theme = useTheme();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/quiz/group/${groupId}`);
        console.log('Fetched quizzes:', response.data); // For debugging

        if (response.data?.success && Array.isArray(response.data.data)) {
          setQuizzes(response.data.data);
        } else if (Array.isArray(response.data)) {
          setQuizzes(response.data);
        } else {
          console.error('Invalid quiz data structure:', response.data);
          setQuizzes([]);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchQuizzes();
    }
  }, [groupId]);

  const formatTimeLimit = (timeLimit: number) => {
    return `${timeLimit} min`;
  };

  const formatDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    if (deadlineDate < now) {
      return 'Expired';
    }

    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays < 7) {
      return `Due in ${diffDays} days`;
    } else {
      return deadlineDate.toLocaleDateString();
    }

    // Navigate to quiz (existing logic)
    navigate(`/quiz/attempt/${quiz.id}`);
  };

  const getQuizStatus = (quiz: QuizItem) => {
    if (quiz.completed) return 'completed';
    if (!quiz.isPublished) return 'unpublished';

    const now = new Date();
    const deadlineDate = new Date(quiz.deadline);

    if (deadlineDate < now) return 'expired';
    return 'available';
  };
  const calculateProgress = () => {
    // Filter quizzes based on user role - only show published quizzes to regular users
    const visibleQuizzes =
      role === 'user' ? quizzes.filter((quiz) => quiz.isPublished) : quizzes;

    const completedQuizzes = visibleQuizzes.filter(
      (quiz) => quiz.completed
    ).length;
    const totalQuizzes = visibleQuizzes.length;
    return totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0;
  };

 
  const getVisibleQuizzes = () => {
    return role === 'user'
      ? quizzes.filter((quiz) => quiz.isPublished)
      : quizzes;
  };

  const visibleQuizzes = getVisibleQuizzes();

  return (
    <Card id="quiz-section" sx={{ bgcolor: theme.palette.background.paper }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              mr: 2,
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
            }}
          >
            <Quiz sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              Quiz Section
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Practice and assess your knowledge
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}
          >
            Overall Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{
              height: { xs: 6, sm: 8 },
              borderRadius: 4,
              bgcolor: theme.palette.grey[800],
              '& .MuiLinearProgress-bar': {
                bgcolor: theme.palette.primary.main,
                borderRadius: 4,
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}
          >
            {visibleQuizzes.filter((quiz) => quiz.completed).length} of{' '}
            {visibleQuizzes.length} quizzes completed
          </Typography>
        </Box>{' '}
        {/* Quiz Cards */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 3 },
          }}
        >
          {' '}
          {loading ? (
            // Loading state
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Loading quizzes...
              </Typography>
            </Box>
          ) : visibleQuizzes.length === 0 ? (
            // Empty state
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Quiz sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                No quizzes available
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                There are no quizzes in this group yet.
              </Typography>
            </Box>
          ) : (
            // Quiz cards
            visibleQuizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              const isExpired = status === 'expired';
              const isUnpublished = status === 'unpublished';

              return (
                <Card
                  key={quiz.quizId}
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
                    boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease-in-out',
                    opacity: isExpired || isUnpublished ? 0.7 : 1,
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      {/* Left Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: 'text.primary' }}
                          >
                            {quiz.title}
                          </Typography>
                          {quiz.completed && (
                            <CheckCircle
                              sx={{
                                fontSize: 20,
                                color: theme.palette.success.main,
                              }}
                            />
                          )}
                          {isUnpublished && (
                            <Chip
                              label="start"
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', mb: 2 }}
                        >
                          {quiz.description}
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
                            icon={<Timer />}
                            label={formatTimeLimit(quiz.timeLimit)}
                            size="small"
                            variant="outlined"
                          />
                          {quiz.completed && quiz.score && (
                            <Chip
                              icon={<TrendingUp />}
                              label={`${quiz.score}%`}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: theme.palette.success.main,
                                color: theme.palette.success.main,
                              }}
                            />
                          )}
                          
                        </Box>
                      </Box>

                      {/* Right Action */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: { xs: 'flex-start', sm: 'flex-end' },
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {formatDeadline(quiz.deadline)}
                        </Typography>
                        <Button
                          variant={quiz.completed ? 'outlined' : 'contained'}
                          startIcon={
                            quiz.completed ? <CheckCircle /> : <PlayArrow />
                          }
                          size="small"
                          disabled={isExpired || isUnpublished}
                          onClick={() =>
                            navigate(`/quiz/attempt/${quiz.quizId}`)
                          }
                          sx={{
                            minWidth: 100,
                            bgcolor: quiz.completed
                              ? 'transparent'
                              : theme.palette.primary.main,
                            color: quiz.completed
                              ? theme.palette.primary.main
                              : '#fff',
                            borderColor: quiz.completed
                              ? theme.palette.primary.main
                              : 'transparent',
                            '&:hover': {
                              bgcolor: quiz.completed
                                ? `${theme.palette.primary.main}0A`
                                : theme.palette.primary.dark,
                              borderColor: theme.palette.primary.main,
                            },
                            '&:disabled': {
                              bgcolor: theme.palette.grey[300],
                              color: theme.palette.grey[500],
                            },
                          }}
                        >
                          {isUnpublished
                            ? 'Draft'
                            : isExpired
                            ? 'Expired'
                            : quiz.completed
                            ? 'Review'
                            : 'Start'}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuizSection;
