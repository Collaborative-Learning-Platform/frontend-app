import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Chip,
  LinearProgress,
  Alert,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";

// Types
interface Question {
  id: string;
  type: "MCQ" | "short_answer" | "true_false";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

interface Quiz {
  id?: string;
  title: string;
  description: string;
  group: string;
  duration: number;
  dueDate: string;
  questions: Question[];
  totalPoints: number;
}

interface Answer {
  questionId: string;
  answer: string | number;
}

interface QuestionResult {
  question: Question;
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  pointsEarned: number;
}

interface QuizResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  questionResults: QuestionResult[];
}

interface QuizAttemptProps {
  quiz?: Quiz; // For preview mode
  isPreview?: boolean; // Preview mode vs actual attempt
}

export default function QuizAttempt({ quiz: propQuiz, isPreview = false }: QuizAttemptProps) {
  const navigate = useNavigate();
  const { quizId } = useParams();
  
  // State
  const [quiz, setQuiz] = useState<Quiz | null>(propQuiz || null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success" | "warning"; message: string } | null>(null);

  // Initialize quiz and timer
  useEffect(() => {
    if (!propQuiz && quizId) {
      // Load quiz from API 
      loadQuiz(quizId);
    } else if (propQuiz) {
      setQuiz(propQuiz);
      setTimeRemaining(propQuiz.duration * 60);
      setStartTime(Date.now());
    }
  }, [quizId, propQuiz]);

  // Timer effect
  useEffect(() => {
    if (!isPreview && timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit(true); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isSubmitted, isPreview]);

  const loadQuiz = (id: string) => {
    //  API call
    const mockQuiz: Quiz = {
      id: id,
      title: "Sample Quiz",
      description: "This is a sample quiz for demonstration",
      group: "math-101-a",
      duration: 30,
      dueDate: "2025-08-20T10:00",
      questions: [
        {
          id: "1",
          type: "MCQ",
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
          points: 2,
        },
        {
          id: "2",
          type: "true_false",
          question: "The Earth is flat.",
          correctAnswer: "false",
          points: 1,
        },
        {
          id: "3",
          type: "short_answer",
          question: "What is the capital of France?",
          correctAnswer: "Paris",
          points: 3,
        },
      ],
      totalPoints: 6,
    };
    
    setQuiz(mockQuiz);
    setTimeRemaining(mockQuiz.duration * 60);
    setStartTime(Date.now());
  };

  const showAlert = (type: "error" | "success" | "warning", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.questionId === questionId);
      if (existingIndex >= 0) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingIndex] = { questionId, answer };
        return newAnswers;
      } else {
        // Add new answer
        return [...prev, { questionId, answer }];
      }
    });
  };

  const getAnswer = (questionId: string): string | number => {
    const answer = answers.find((a) => a.questionId === questionId);
    return answer?.answer || "";
  };

  const handleSubmit = (autoSubmit = false) => {
    if (!quiz) return;

    const unansweredQuestions = quiz.questions.filter(
      (q) => !answers.find((a) => a.questionId === q.id)
    );

    if (!autoSubmit && unansweredQuestions.length > 0 && !isPreview) {
      setShowSubmitDialog(true);
      return;
    }

    setIsSubmitted(true);
    
    if (isPreview) {
      showAlert("success", "Quiz preview completed!");
      setTimeout(() => navigate(-1), 1500);
    } else {
      // Calculate score and show results
      calculateResults();
    }
  };

  const confirmSubmit = () => {
    setShowSubmitDialog(false);
    if (!quiz) return;
    
    setIsSubmitted(true);
    calculateResults();
  };

  const calculateResults = () => {
    if (!quiz) return;

    const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
    let totalScore = 0;
    const questionResults: QuestionResult[] = [];

    quiz.questions.forEach((question) => {
      const userAnswer = getAnswer(question.id);
      const isCorrect = checkAnswer(question, userAnswer);
      const pointsEarned = isCorrect ? question.points : 0;
      
      totalScore += pointsEarned;
      
      questionResults.push({
        question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        pointsEarned,
      });
    });

    const results: QuizResult = {
      totalScore,
      maxScore: quiz.totalPoints,
      percentage: Math.round((totalScore / quiz.totalPoints) * 100),
      timeSpent,
      questionResults,
    };

    setQuizResults(results);
    setShowResults(true);
  };

  const checkAnswer = (question: Question, userAnswer: string | number): boolean => {
    if (!userAnswer && userAnswer !== 0) return false;
    
    if (question.type === "MCQ") {
      return Number(userAnswer) === question.correctAnswer;
    } else if (question.type === "true_false") {
      return userAnswer.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase();
    } else if (question.type === "short_answer") {
      // Simple string comparison - Not sufficient (Check later)
      return userAnswer.toString().toLowerCase().trim() === 
             question.correctAnswer.toString().toLowerCase().trim();
    }
    return false;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 90) return "success.main";
    if (percentage >= 70) return "warning.main";
    return "error.main";
  };

  const getScoreIcon = (isCorrect: boolean) => {
    return isCorrect ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />;
  };

  const getProgressPercentage = (): number => {
    if (!quiz) return 0;
    return (answers.length / quiz.questions.length) * 100;
  };

  if (!quiz) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Loading quiz...</Typography>
      </Container>
    );
  }

  if (isSubmitted && showResults && quizResults) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Results Header */}
        <Card sx={{ mb: 4, textAlign: "center" }}>
          <CardContent sx={{ py: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 2,
                bgcolor: getScoreColor(quizResults.percentage),
              }}
            >
              <AnalyticsIcon sx={{ fontSize: 40 }} />
            </Avatar>
            
            <Typography variant="h3" sx={{ mb: 1, color: getScoreColor(quizResults.percentage) }}>
              {quizResults.percentage}%
            </Typography>
            
            <Typography variant="h5" sx={{ mb: 2 }}>
              Quiz Completed!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You scored {quizResults.totalScore} out of {quizResults.maxScore} points
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mb: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {quizResults.questionResults.filter(r => r.isCorrect).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="error">
                  {quizResults.questionResults.filter(r => !r.isCorrect).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Incorrect
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="text.primary">
                  {formatDuration(quizResults.timeSpent)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time Spent
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/user-dashboard")}
              sx={{ mr: 2 }}
            >
              Back to Dashboard
            </Button>
            
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
            >
              Retake Quiz
            </Button>
          </CardContent>
        </Card>

        {/* Question by Question Review */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          Question Review
        </Typography>
        
        {quizResults.questionResults.map((result, index) => (
          <Card key={result.question.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getScoreIcon(result.isCorrect)}
                  <Typography variant="h6">
                    Question {index + 1}
                  </Typography>
                </Box>
                <Chip 
                  label={`${result.pointsEarned}/${result.question.points} pts`}
                  color={result.isCorrect ? "success" : "error"}
                  size="small"
                />
                <Chip label={result.question.type} variant="outlined" size="small" />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                {result.question.question}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Your Answer:
                    </Typography>
                    <Typography variant="body1" color={result.isCorrect ? "success.main" : "error.main"}>
                      {result.question.type === "MCQ" && result.question.options
                        ? result.question.options[Number(result.userAnswer)] || "No answer"
                        : result.userAnswer || "No answer"}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ p: 2, bgcolor: "success.50", borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Correct Answer:
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      {result.question.type === "MCQ" && result.question.options
                        ? result.question.options[Number(result.correctAnswer)]
                        : result.correctAnswer}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Submit Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            {quiz && answers.length < quiz.questions.length 
              ? `You have ${quiz.questions.length - answers.length} unanswered questions. Are you sure you want to submit?`
              : "Are you sure you want to submit your quiz? You won't be able to make changes after submission."
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>
            Cancel
          </Button>
          <Button onClick={confirmSubmit} variant="contained" color="primary">
            Submit Quiz
          </Button>
        </DialogActions>
      </Dialog>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Quiz Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
                {quiz.title}
                {isPreview && (
                  <Chip label="Preview Mode" color="info" size="small" sx={{ ml: 2 }} />
                )}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {quiz.description}
              </Typography>
            </Box>
            {!isPreview && (
              <Box sx={{ textAlign: "right" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <AccessTimeIcon color={timeRemaining < 300 ? "error" : "primary"} />
                  <Typography
                    variant="h6"
                    color={timeRemaining < 300 ? "error.main" : "primary.main"}
                    fontWeight="bold"
                  >
                    {formatTime(timeRemaining)}
                  </Typography>
                </Box>
                {timeRemaining < 300 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WarningIcon color="error" fontSize="small" />
                    <Typography variant="caption" color="error.main">
                      Less than 5 minutes left!
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Chip label={`${quiz.questions.length} questions`} variant="outlined" />
            <Chip label={`${quiz.totalPoints} points`} variant="outlined" />
            {!isPreview && (
              <Chip 
                label={`${answers.length}/${quiz.questions.length} answered`} 
                color={answers.length === quiz.questions.length ? "success" : "default"}
                variant="outlined" 
              />
            )}
          </Box>

          {!isPreview && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Progress: {Math.round(getProgressPercentage())}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getProgressPercentage()} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Questions */}
      <Box sx={{ mb: 4 }}>
        {quiz.questions.map((question, index) => (
          <Card 
            key={question.id} 
            sx={{ 
              mb: 3,
              border: getAnswer(question.id) ? "2px solid" : "1px solid",
              borderColor: getAnswer(question.id) ? "success.main" : "divider",
              transition: "border-color 0.2s ease",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Chip 
                  label={`${index + 1}`} 
                  size="small" 
                  color={getAnswer(question.id) ? "success" : "default"}
                  sx={{ fontWeight: "bold" }}
                />
                <Chip label={question.type} color="secondary" size="small" />
                <Chip label={`${question.points} pts`} variant="outlined" size="small" />
                {getAnswer(question.id) && (
                  <CheckCircleIcon color="success" fontSize="small" />
                )}
              </Box>
              
              <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.4 }}>
                {question.question}
              </Typography>

              {/* Multiple Choice */}
              {question.type === "MCQ" && question.options && (
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={getAnswer(question.id).toString()}
                    onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                  >
                    {question.options.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={optionIndex.toString()}
                        control={<Radio />}
                        label={option}
                        sx={{ 
                          mb: 1,
                          py: 1,
                          px: 2,
                          borderRadius: 1,
                          border: "1px solid transparent",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

              {/* True/False */}
              {question.type === "true_false" && (
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={getAnswer(question.id).toString()}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    sx={{ flexDirection: "row", gap: 3 }}
                  >
                    <FormControlLabel 
                      value="true" 
                      control={<Radio />} 
                      label="True"
                      sx={{ 
                        py: 1,
                        px: 2,
                        borderRadius: 1,
                        border: "1px solid transparent",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    />
                    <FormControlLabel 
                      value="false" 
                      control={<Radio />} 
                      label="False"
                      sx={{ 
                        py: 1,
                        px: 2,
                        borderRadius: 1,
                        border: "1px solid transparent",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              )}

              {/* Short Answer */}
              {question.type === "short_answer" && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter your answer here..."
                  value={getAnswer(question.id)}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Submit Section */}
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {isPreview 
            ? "This is a preview of your quiz. Click 'Finish Preview' to return to editing."
            : "Review your answers and submit when ready."
          }
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            {isPreview ? "Back to Editing" : "Save & Exit"}
          </Button>
          
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => handleSubmit()}
            color={isPreview ? "info" : "primary"}
          >
            {isPreview ? "Finish Preview" : "Submit Quiz"}
          </Button>
        </Stack>
        
        {!isPreview && answers.length < quiz.questions.length && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
            You have {quiz.questions.length - answers.length} unanswered questions
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
