import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Chip,
  LinearProgress,
  Avatar,
  useTheme
} from '@mui/material';
import { 
  Quiz, 
  Timer, 
  CheckCircle, 
  PlayArrow,
  TrendingUp 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
  console.log("QuizSection groupId:", groupId); // For debugging
  const theme = useTheme();
  const navigate = useNavigate();

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
      case 'Easy': return theme.palette.primary.main;
      case 'Medium': return theme.palette.primary.main;
      case 'Hard': return theme.palette.primary.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Card id="quiz-section" sx={{ bgcolor: theme.palette.background.paper }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
          <Avatar sx={{ 
            bgcolor: theme.palette.primary.main, 
            mr: 2,
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 }
          }}>
            <Quiz sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Quiz Section
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Practice and assess your knowledge
            </Typography>
          </Box>
        </Box>

        {/* Overall Progress */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
            Overall Progress
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={33} 
            sx={{ 
              height: { xs: 6, sm: 8 }, 
              borderRadius: 4, 
              bgcolor: theme.palette.grey[800],
              '& .MuiLinearProgress-bar': {
                bgcolor: theme.palette.primary.main,
                borderRadius: 4
              }
            }}
          />
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}>
            1 of 3 quizzes completed
          </Typography>
        </Box>

        {/* Quiz Cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
          {quizzes.map((quiz) => (
            <Card 
              key={quiz.id} 
              variant="outlined"
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
                boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                  {/* Left Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {quiz.title}
                      </Typography>
                      {quiz.completed && <CheckCircle sx={{ fontSize: 20, color: theme.palette.primary.main }} />}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {quiz.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Chip 
                        label={quiz.difficulty} 
                        size="small" 
                        sx={{ 
                          color: getDifficultyColor(quiz.difficulty), 
                          borderColor: getDifficultyColor(quiz.difficulty),
                          fontWeight: 600
                        }}
                        variant="outlined"
                      />
                      <Chip icon={<Quiz />} label={`${quiz.questions} questions`} size="small" variant="outlined"/>
                      <Chip icon={<Timer />} label={quiz.duration} size="small" variant="outlined"/>
                      {quiz.completed && quiz.score && (
                        <Chip icon={<TrendingUp />} label={`${quiz.score}%`} size="small" variant="outlined" sx={{ borderColor: theme.palette.success.main, color: theme.palette.success.main }}/>
                      )}
                    </Box>
                  </Box>

                  {/* Right Action */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {quiz.dueDate}
                    </Typography>
                    <Button
                      variant={quiz.completed ? "outlined" : "contained"}
                      startIcon={quiz.completed ? <CheckCircle /> : <PlayArrow />}
                      size="small"
                      onClick={() => navigate(`/quiz/attempt/${quiz.id}`)}
                      sx={{
                        minWidth: 100,
                        bgcolor: quiz.completed ? 'transparent' : theme.palette.primary.main,
                        color: quiz.completed ? theme.palette.primary.main : '#fff',
                        borderColor: quiz.completed ? theme.palette.primary.main : 'transparent',
                        '&:hover': {
                          bgcolor: quiz.completed ? `${theme.palette.primary.main}0A` : theme.palette.primary.dark,
                          borderColor: theme.palette.primary.main,
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
