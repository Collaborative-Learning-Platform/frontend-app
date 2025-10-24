import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import {
  Quiz,
  QuizQuestion,
  Answer,
  QuestionResult,
  QuizResult,
  QuizAttemptProps,
} from './types';
import { useAuth } from '../../contexts/Authcontext';
export default function QuizAttempt({
  quiz: propQuiz,
  isPreview = false,
}: QuizAttemptProps) {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { user_id } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(propQuiz || null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'error' | 'success' | 'warning';
    message: string;
  } | null>(null);
  useEffect(() => {
    if (!propQuiz && quizId) {
      const fetchQuizData = async () => {
        try {
          const detailsResponse = await axiosInstance.get(`/quiz/${quizId}`);
          // console.log('Fetched quiz details:', detailsResponse.data);

          let quizTimeLimit = 30;
          if (detailsResponse.data?.success && detailsResponse.data.data) {
            quizTimeLimit = detailsResponse.data.data.timeLimit || 30;
            console.log('Quiz time limit:', quizTimeLimit);
          }

          const questionsResponse = await axiosInstance.get(
            `/quiz/question/${quizId}`
          );
          console.log('Fetched questions:', questionsResponse.data);
          if (questionsResponse.data.success) {
            console.log('Raw question data:', questionsResponse.data.data);

            const transformedQuiz: Quiz = {
              quizId: quizId,
              title: questionsResponse.data.title || 'Quiz',
              description: questionsResponse.data.description || '',
              timeLimit: quizTimeLimit,
              deadline: questionsResponse.data.deadline,
              questions: questionsResponse.data.data.map((item: any) => {
                console.log('Processing question:', item);

                let questionData;
                if (item.question_type === 'MCQ') {
                  if (typeof item.question === 'object') {
                    questionData = item.question;
                  } else {
                    questionData = {
                      text: item.question,
                      options: item.options || [
                        'Option A',
                        'Option B',
                        'Option C',
                        'Option D',
                      ],
                    };
                  }
                } else {
                  questionData = item.question;
                }

                return {
                  question_no: item.question_no,
                  question_type: item.question_type,
                  question: questionData,
                  correct_answer: item.correct_answer,
                  quizId: item.quizId,
                  points: 1,
                };
              }),
              totalPoints: questionsResponse.data.data.length,
            };

            setQuiz(transformedQuiz);
            setTimeRemaining(quizTimeLimit * 60);
            setStartTime(Date.now());
          }
        } catch (error) {
          console.error('Error fetching quiz data:', error);
          showAlert('error', 'Unable to load quiz. Please try again.');
        }
      };

      fetchQuizData();
    } else if (propQuiz) {
      setQuiz(propQuiz);
      setTimeRemaining((propQuiz.timeLimit || 30) * 60);
      setStartTime(Date.now());
    }
  }, [quizId, propQuiz]);

  // Timer effect
  useEffect(() => {
    if (!isPreview && timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isSubmitted, isPreview]);

  const showAlert = (
    type: 'error' | 'success' | 'warning',
    message: string
  ) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };
  const handleAnswerChange = useCallback(
    (questionNo: number, answer: string | number) => {
      if (import.meta.env.DEV) {
        console.log(`Answer change: Question ${questionNo}, Answer: ${answer}`);
      }

      setAnswers((prev) => {
        const existingIndex = prev.findIndex(
          (a) => a.questionId === questionNo
        );
        const newAnswer = { questionId: questionNo, answer };

        if (existingIndex >= 0) {
          // Update existing answer
          const newAnswers = [...prev];
          newAnswers[existingIndex] = newAnswer;
          return newAnswers;
        } else {
          // Add new answer
          return [...prev, newAnswer];
        }
      });
    },
    []
  );
  const getAnswer = useMemo(() => {
    const answerMap = new Map(
      answers.map((answer) => [answer.questionId, answer.answer])
    );
    return (questionNo: number): string | number =>
      answerMap.get(questionNo) ?? '';
  }, [answers]);
  const handleSubmit = (autoSubmit = false) => {
    if (!quiz) return;

    const unansweredQuestions = quiz.questions.filter(
      (q) => !answers.find((a) => a.questionId === q.question_no)
    );

    if (!autoSubmit && unansweredQuestions.length > 0 && !isPreview) {
      setShowSubmitDialog(true);
      return;
    }

    setIsSubmitted(true);

    if (isPreview) {
      showAlert('success', 'Quiz preview completed!');
      setTimeout(() => navigate(-1), 1500);
    } else {
      calculateResults();
    }
  };

  const confirmSubmit = () => {
    setShowSubmitDialog(false);
    if (!quiz) return;

    setIsSubmitted(true);
    //Log the quiz submission to the analytics service

    calculateResults();
  };
  const calculateResults = async () => {
    if (!quiz) return;
    setIsSubmitting(true);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    let totalScore = 0;
    const questionResults: QuestionResult[] = [];

    quiz.questions.forEach((question) => {
      const userAnswer = getAnswer(question.question_no);
      const isCorrect = checkAnswer(question, userAnswer);
      const pointsEarned = isCorrect ? question.points || 1 : 0;

      totalScore += pointsEarned;

      questionResults.push({
        question,
        userAnswer,
        correctAnswer: question.correct_answer,
        isCorrect,
        pointsEarned,
      });
    });

    const maxScore = quiz.totalPoints || quiz.questions.length;
    const results: QuizResult = {
      totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      timeSpent,
      questionResults,
    };
    const answersObject = answers.reduce((acc, answer) => {
      acc[answer.questionId] = answer.answer;
      return acc;
    }, {} as Record<number, string | number>);
    const quizAttemptData = {
      quizId: quiz.quizId!,
      userId: user_id,
      attempt_no: 1,
      score: totalScore,
      time_taken: timeSpent,
      submitted_at: new Date(),
      answers: answersObject,
    };
    try {
      const response = await axiosInstance.post(
        '/quiz/attempt/create',
        quizAttemptData
      );
      console.log('Quiz attempt submitted:', response.data);

      if (response.data.success) {
        showAlert('success', 'Quiz submitted successfully!');
      } else {
        showAlert('error', 'Failed to submit quiz. Please try again.');
        return;
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      showAlert('error', 'Failed to submit quiz. Please try again.');
      return;
    } finally {
      setIsSubmitting(false);
    }
    setQuizResults(results);
    setShowResults(true);
  };
  const checkAnswer = (
    question: QuizQuestion,
    userAnswer: string | number
  ): boolean => {
    if (!userAnswer && userAnswer !== 0) return false;

    if (question.question_type === 'MCQ') {
      return Number(userAnswer) === Number(question.correct_answer);
    } else if (question.question_type === 'true_false') {
      return (
        userAnswer.toString().toLowerCase() ===
        question.correct_answer.toString().toLowerCase()
      );
    } else if (question.question_type === 'short_answer') {
      return (
        userAnswer.toString().toLowerCase().trim() ===
        question.correct_answer.toString().toLowerCase().trim()
      );
    }
    return false;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    if (percentage >= 90) return 'success.main';
    if (percentage >= 70) return 'warning.main';
    return 'error.main';
  };

  const getScoreIcon = (isCorrect: boolean) => {
    return isCorrect ? (
      <CheckCircleIcon color="success" />
    ) : (
      <CancelIcon color="error" />
    );
  };

  const getProgressPercentage = (): number => {
    if (!quiz) return 0;
    return (answers.length / quiz.questions.length) * 100;
  };

  if (!quiz) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={20} />
        <Typography sx={{ ml: 1 }}>Loading quiz</Typography>
      </Container>
    );
  }

  if (isSubmitted && showResults && quizResults) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Results Header */}
        <Card sx={{ mb: 4, textAlign: 'center' }}>
          <CardContent sx={{ py: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: getScoreColor(quizResults.percentage),
              }}
            >
              <AnalyticsIcon sx={{ fontSize: 40 }} />
            </Avatar>

            <Typography
              variant="h3"
              sx={{ mb: 1, color: getScoreColor(quizResults.percentage) }}
            >
              {quizResults.percentage}%
            </Typography>

            <Typography variant="h5" sx={{ mb: 2 }}>
              Quiz Completed!
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You scored {quizResults.totalScore} out of {quizResults.maxScore}{' '}
              points
            </Typography>

            <Box
              sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {
                    quizResults.questionResults.filter((r) => r.isCorrect)
                      .length
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                  {
                    quizResults.questionResults.filter((r) => !r.isCorrect)
                      .length
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Incorrect
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
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
              onClick={() => navigate('/user-dashboard')}
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

        <Typography variant="h5" sx={{ mb: 3 }}>
          Question Review
        </Typography>
        {quizResults.questionResults.map((result, index) => (
          <Card key={result.question.question_no} sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getScoreIcon(result.isCorrect)}
                  <Typography variant="h6">Question {index + 1}</Typography>
                </Box>
                <Chip
                  label={`${result.pointsEarned}/${
                    result.question.points || 1
                  } pts`}
                  color={result.isCorrect ? 'success' : 'error'}
                  size="small"
                />
                <Chip
                  label={result.question.question_type}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                {typeof result.question.question === 'string'
                  ? result.question.question
                  : result.question.question.text}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Your Answer:
                    </Typography>
                    <Typography
                      variant="body1"
                      color={result.isCorrect ? 'success.main' : 'error.main'}
                    >
                      {result.question.question_type === 'MCQ' &&
                      typeof result.question.question === 'object' &&
                      result.question.question.options
                        ? result.question.question.options[
                            Number(result.userAnswer)
                          ] || 'No answer'
                        : result.userAnswer || 'No answer'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Correct Answer:
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      {result.question.question_type === 'MCQ' &&
                      typeof result.question.question === 'object' &&
                      result.question.question.options
                        ? result.question.question.options[
                            Number(result.correctAnswer)
                          ]
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
      <Dialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
      >
        <DialogTitle>Submit Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            {quiz && answers.length < quiz.questions.length
              ? `You have ${
                  quiz.questions.length - answers.length
                } unanswered questions. Are you sure you want to submit?`
              : "Are you sure you want to submit your quiz? You won't be able to make changes after submission."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
                {quiz.title}
                {isPreview && (
                  <Chip
                    label="Preview Mode"
                    color="info"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                )}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {quiz.description}
              </Typography>
            </Box>
            {!isPreview && (
              <Box sx={{ textAlign: 'right' }}>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <AccessTimeIcon
                    color={timeRemaining < 300 ? 'error' : 'primary'}
                  />
                  <Typography
                    variant="h6"
                    color={timeRemaining < 300 ? 'error.main' : 'primary.main'}
                    fontWeight="bold"
                  >
                    {formatTime(timeRemaining)}
                  </Typography>
                </Box>
                {timeRemaining < 300 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="error" fontSize="small" />
                    <Typography variant="caption" color="error.main">
                      Less than 5 minutes left!
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip
              label={`${quiz.questions.length} questions`}
              variant="outlined"
            />
            <Chip label={`${quiz.totalPoints} points`} variant="outlined" />
            {!isPreview && (
              <Chip
                label={`${answers.length}/${quiz.questions.length} answered`}
                color={
                  answers.length === quiz.questions.length
                    ? 'success'
                    : 'default'
                }
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

      <Box sx={{ mb: 4 }}>
        {quiz.questions.map((question, index) => (
          <Card
            key={question.question_no}
            sx={{
              mb: 3,
              transition: 'border-color 0.2s ease',
            }}
          >
            <CardContent>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <Chip
                  label={`${index + 1}`}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  label={question.question_type}
                  color="secondary"
                  size="small"
                />
              </Box>
              <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.4 }}>
                {typeof question.question === 'string'
                  ? question.question
                  : question.question.text}
              </Typography>{' '}
              {question.question_type === 'MCQ' && (
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={getAnswer(question.question_no).toString()}
                    onChange={(e) => {
                      if (import.meta.env.DEV) {
                        console.log(
                          `Selecting option ${e.target.value} for question ${question.question_no}`
                        );
                      }
                      handleAnswerChange(
                        question.question_no,
                        parseInt(e.target.value)
                      );
                    }}
                  >
                    {(() => {
                      // Extract options with proper type checking
                      const options =
                        typeof question.question === 'object' &&
                        question.question.options
                          ? question.question.options
                          : null;

                      if (!options) {
                        return (
                          <Typography
                            color="error"
                            variant="body2"
                            sx={{ p: 2, bgcolor: 'error.50', borderRadius: 1 }}
                          >
                            MCQ question missing options. Question:{' '}
                            {typeof question.question === 'string'
                              ? question.question
                              : question.question.text}
                          </Typography>
                        );
                      }

                      return options.map((option, optionIndex) => (
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
                            border: '1px solid transparent',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              borderColor: 'primary.main',
                            },
                          }}
                        />
                      ));
                    })()}
                  </RadioGroup>
                </FormControl>
              )}
              {question.question_type === 'true_false' && (
                <FormControl component="fieldset" fullWidth>
                  {' '}
                  <RadioGroup
                    value={(() => {
                      const answer = getAnswer(question.question_no);
                      return answer !== '' ? answer.toString() : '';
                    })()}
                    onChange={(e) =>
                      handleAnswerChange(question.question_no, e.target.value)
                    }
                    sx={{ flexDirection: 'row', gap: 3 }}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="True"
                      sx={{
                        py: 1,
                        px: 2,
                        borderRadius: 1,
                        border: '1px solid transparent',
                        '&:hover': {
                          bgcolor: 'action.hover',
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
                        border: '1px solid transparent',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              )}
              {question.question_type === 'short_answer' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter your answer here..."
                  value={getAnswer(question.question_no)}
                  onChange={(e) =>
                    handleAnswerChange(question.question_no, e.target.value)
                  }
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
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
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {isPreview
            ? "This is a preview of your quiz. Click 'Finish Preview' to return to editing."
            : 'Review your answers and submit when ready.'}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            {isPreview ? 'Back to Editing' : 'Save & Exit'}
          </Button>

          <Button
            variant="contained"
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : <SendIcon />
            }
            onClick={() => handleSubmit()}
            color={isPreview ? 'info' : 'primary'}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Submitting...'
              : isPreview
              ? 'Finish Preview'
              : 'Submit Quiz'}
          </Button>
        </Stack>

        {!isPreview && answers.length < quiz.questions.length && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: 'block' }}
          >
            You have {quiz.questions.length - answers.length} unanswered
            questions
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
