import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Chip,
  LinearProgress,
  Avatar
} from '@mui/material';
import { 
  Quiz, 
  Timer, 
  CheckCircle, 
  PlayArrow,
  TrendingUp 
} from '@mui/icons-material';

interface QuizItem {
  id: string;
  title: string;
  description: string;
  questions: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  score?: number;
  dueDate: string;
}

interface QuizSectionProps {
  groupId: string;
}

const QuizSection = ({ groupId }: QuizSectionProps) => {
  const quizzes: QuizItem[] = [
    {
      id: '1',
      title: 'Software Design Patterns',
      description: 'Test your knowledge on common design patterns',
      questions: 15,
      duration: '20 min',
      difficulty: 'Medium',
      completed: true,
      score: 85,
      dueDate: 'Completed'
    },
    {
      id: '2',
      title: 'Agile Methodologies',
      description: 'Understanding Scrum and Kanban practices',
      questions: 12,
      duration: '15 min',
      difficulty: 'Easy',
      completed: false,
      dueDate: 'Due in 2 days'
    },
    {
      id: '3',
      title: 'Database Optimization',
      description: 'Advanced SQL queries and performance tuning',
      questions: 20,
      duration: '30 min',
      difficulty: 'Hard',
      completed: false,
      dueDate: 'Due in 5 days'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card id="quiz-section">
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
          <Avatar sx={{ 
            bgcolor: (theme) => theme.palette.accent.quiz, 
            mr: 2,
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 }
          }}>
            <Quiz sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                color: 'text.primary'
              }}
            >
              Quiz Section
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Practice and assess your knowledge
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Overall Progress
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={33} 
            sx={{ 
              height: { xs: 6, sm: 8 }, 
              borderRadius: 4, 
              bgcolor: 'grey.100',
              '& .MuiLinearProgress-bar': {
                bgcolor: (theme) => theme.palette.accent.quiz,
                borderRadius: 4
              }
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 0.5, 
              display: 'block',
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            1 of 3 quizzes completed
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
          {quizzes.map((quiz) => (
            <Card 
              key={quiz.id} 
              variant="outlined" 
              sx={{ 
                '&:hover': { 
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  borderColor: (theme) => `${theme.palette.accent.quiz}4D`
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.08)'
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'flex-start' }, 
                  gap: { xs: 2, sm: 0 },
                  mb: 2 
                }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '1rem', sm: '1.125rem' },
                          color: 'text.primary'
                        }}
                      >
                        {quiz.title}
                      </Typography>
                      {quiz.completed && <CheckCircle sx={{ fontSize: 20, color: (theme) => theme.palette.accent.chat }} />}
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        mb: 2,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.5
                      }}
                    >
                      {quiz.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Chip 
                        label={quiz.difficulty} 
                        size="small" 
                        color={getDifficultyColor(quiz.difficulty) as any}
                      />
                      <Chip 
                        icon={<Quiz />} 
                        label={`${quiz.questions} questions`} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        icon={<Timer />} 
                        label={quiz.duration} 
                        size="small" 
                        variant="outlined"
                      />
                      {quiz.completed && quiz.score && (
                        <Chip 
                          icon={<TrendingUp />} 
                          label={`${quiz.score}%`} 
                          size="small" 
                          color="success"
                        />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ 
                    ml: { xs: 0, sm: 2 }, 
                    textAlign: { xs: 'left', sm: 'right' },
                    alignSelf: { xs: 'stretch', sm: 'flex-start' }
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mb: 1,
                        color: 'text.secondary',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      {quiz.dueDate}
                    </Typography>
                    <Button
                      variant={quiz.completed ? "outlined" : "contained"}
                      startIcon={quiz.completed ? <CheckCircle /> : <PlayArrow />}
                      size={window.innerWidth < 600 ? "medium" : "small"}
                      sx={{ 
                        minWidth: { xs: '100%', sm: 100 },
                        bgcolor: (theme) => quiz.completed ? 'transparent' : theme.palette.accent.quiz,
                        borderColor: (theme) => quiz.completed ? theme.palette.accent.quiz : 'transparent',
                        color: (theme) => quiz.completed ? theme.palette.accent.quiz : 'white',
                        '&:hover': {
                          bgcolor: (theme) => quiz.completed ? `${theme.palette.accent.quiz}0A` : theme.palette.secondary.dark,
                          borderColor: (theme) => theme.palette.accent.quiz
                        }
                      }}
                    >
                      {quiz.completed ? 'Review' : 'Start'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuizSection;