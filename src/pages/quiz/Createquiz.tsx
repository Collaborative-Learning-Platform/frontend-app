import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  IconButton,
  Paper,
  FormLabel,
  Alert,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton as MuiIconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import QuizAttempt from "./QuizAttempt";

// Types
interface Question {
  id: string;
  type: "multiple-choice" | "short-answer" | "true-false";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

interface Quiz {
  title: string;
  description: string;
  group: string;
  duration: number;
  dueDate: string;
  questions: Question[];
  totalPoints: number;
}

// Constants
const INITIAL_QUESTION: Question = {
  id: "",
  type: "multiple-choice",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  points: 1,
};

const INITIAL_QUIZ: Quiz = {
  title: "",
  description: "",
  group: "",
  duration: 30,
  dueDate: "",
  questions: [],
  totalPoints: 0,
};

const GROUP_OPTIONS = [
  { value: "math-101-a", label: "Math 101 - Group A" },
  { value: "math-101-b", label: "Math 101 - Group B" },
  { value: "advanced-calculus", label: "Advanced Calculus" },
];

// Main Component
export default function CreateQuizPage() {
  const navigate = useNavigate();
  
  // State
  const [quiz, setQuiz] = useState<Quiz>(INITIAL_QUIZ);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(INITIAL_QUESTION);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  // Utility Functions
  const showAlert = (type: "error" | "success", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const resetCurrentQuestion = () => {
    setCurrentQuestion(INITIAL_QUESTION);
    setIsAddingQuestion(false);
    setEditingQuestionId(null);
  };

  const startEditingQuestion = (question: Question) => {
    setCurrentQuestion({ ...question });
    setEditingQuestionId(question.id);
    setIsAddingQuestion(false);
  };

  const cancelEditing = () => {
    setCurrentQuestion(INITIAL_QUESTION);
    setEditingQuestionId(null);
  };

  // Validation Functions
  const validateQuestion = (question: Question): string | null => {
    if (!question.question.trim()) {
      return "Please enter a question";
    }

    if (question.type === "multiple-choice") {
      const hasEmptyOptions = question.options?.some((option) => !option.trim());
      if (hasEmptyOptions) {
        return "Please fill in all answer options";
      }
    }

    if (question.type === "short-answer" && !question.correctAnswer) {
      return "Please provide a sample answer";
    }

    return null;
  };

  const validateQuiz = (quiz: Quiz): string | null => {
    if (!quiz.title.trim()) {
      return "Please enter a quiz title";
    }

    if (!quiz.group) {
      return "Please select a group";
    }

    if (quiz.questions.length === 0) {
      return "Please add at least one question";
    }

    return null;
  };

  // Event Handlers
  const handleAddQuestion = () => {
    const validationError = validateQuestion(currentQuestion);
    if (validationError) {
      showAlert("error", validationError);
      return;
    }

    if (editingQuestionId) {
      // Update existing question
      const oldQuestion = quiz.questions.find(q => q.id === editingQuestionId);
      const pointsDifference = currentQuestion.points - (oldQuestion?.points || 0);
      
      setQuiz((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === editingQuestionId ? { ...currentQuestion, id: editingQuestionId } : q
        ),
        totalPoints: prev.totalPoints + pointsDifference,
      }));

      showAlert("success", "Question updated successfully!");
    } else {
      // Add new question
      const newQuestion: Question = {
        ...currentQuestion,
        id: Date.now().toString(),
      };

      setQuiz((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
        totalPoints: prev.totalPoints + newQuestion.points,
      }));

      showAlert("success", "Question added successfully!");
    }

    resetCurrentQuestion();
  };

  const handleRemoveQuestion = (questionId: string) => {
    const questionToRemove = quiz.questions.find((q) => q.id === questionId);
    if (questionToRemove) {
      setQuiz((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== questionId),
        totalPoints: prev.totalPoints - questionToRemove.points,
      }));
    }
  };

  const handleSaveQuiz = () => {
    const validationError = validateQuiz(quiz);
    if (validationError) {
      showAlert("error", validationError);
      return;
    }

    
    console.log("Saving quiz:", quiz);
    showAlert("success", "Quiz saved successfully!");
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  const handlePreviewQuiz = () => {
    if (quiz.questions.length === 0) {
      showAlert("error", "Please add at least one question to preview the quiz");
      return;
    }
    setShowPreview(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Alert */}
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", mb: 1 }}>
              Create Quiz
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Design assessments for your students
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<VisibilityIcon />} onClick={handlePreviewQuiz}>
              Preview
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveQuiz}>
              Save Quiz
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Quiz Settings */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Quiz Settings"
          subheader="Configure the basic settings for your quiz"
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Basic Information Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', fontWeight: 500 }}>
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Quiz Title"
                  placeholder="Enter quiz title"
                  value={quiz.title}
                  onChange={(e) => setQuiz((prev) => ({ ...prev, title: e.target.value }))}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  placeholder="Describe what this quiz covers"
                  value={quiz.description}
                  onChange={(e) => setQuiz((prev) => ({ ...prev, description: e.target.value }))}
                />
              </Box>
            </Box>

            {/* Assignment & Timing Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', fontWeight: 500 }}>
                Assignment & Timing
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Assign to Group</InputLabel>
                  <Select
                    value={quiz.group}
                    label="Assign to Group"
                    onChange={(e) => setQuiz((prev) => ({ ...prev, group: e.target.value }))}
                  >
                    {GROUP_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' }, 
                  gap: 3 
                }}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Due Date"
                    InputLabelProps={{ shrink: true }}
                    value={quiz.dueDate}
                    onChange={(e) => setQuiz((prev) => ({ ...prev, dueDate: e.target.value }))}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Duration (minutes)"
                    inputProps={{ min: 5, max: 180 }}
                    value={quiz.duration}
                    onChange={(e) => setQuiz((prev) => ({ ...prev, duration: parseInt(e.target.value) }))}
                    helperText="Set time limit for the quiz (5-180 minutes)"
                  />
                </Box>
              </Box>
            </Box>

            {/* Quiz Statistics */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', fontWeight: 500 }}>
                Quiz Overview
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${quiz.duration} minutes`}
                  variant="outlined"
                  color="primary"
                />
                <Chip 
                  label={`${quiz.questions.length} questions`} 
                  variant="outlined"
                  color="secondary"
                />
                <Chip 
                  label={`${quiz.totalPoints} points`} 
                  variant="outlined"
                  color="success"
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader
          title="Questions"
          subheader="Add questions to your quiz"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddingQuestion(true)}
              disabled={isAddingQuestion || editingQuestionId !== null}
            >
              Add Question
            </Button>
          }
        />
        <CardContent>
          {/* Existing Questions */}
          {quiz.questions.map((question, index) => (
            <Paper key={question.id} sx={{ p: 3, mb: 2 }} variant="outlined">
              {editingQuestionId === question.id ? (
                // Edit Mode
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6">Edit Question {index + 1}</Typography>
                    <Button variant="text" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', md: 'row' }, 
                      gap: 3 
                    }}>
                      <FormControl fullWidth>
                        <InputLabel>Question Type</InputLabel>
                        <Select
                          value={currentQuestion.type}
                          label="Question Type"
                          onChange={(e) =>
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              type: e.target.value as Question["type"],
                            }))
                          }
                        >
                          <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                          <MenuItem value="short-answer">Short Answer</MenuItem>
                          <MenuItem value="true-false">True/False</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <TextField
                        fullWidth
                        type="number"
                        label="Points"
                        inputProps={{ min: 1, max: 10 }}
                        value={currentQuestion.points}
                        onChange={(e) =>
                          setCurrentQuestion((prev) => ({ ...prev, points: parseInt(e.target.value) }))
                        }
                      />
                    </Box>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Question"
                      placeholder="Enter your question"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))}
                    />

                    {/* Multiple Choice Options */}
                    {currentQuestion.type === "multiple-choice" && (
                      <Box>
                        <FormLabel component="legend" sx={{ mb: 2 }}>Answer Options</FormLabel>
                        <RadioGroup
                          value={currentQuestion.correctAnswer.toString()}
                          onChange={(e) =>
                            setCurrentQuestion((prev) => ({ ...prev, correctAnswer: parseInt(e.target.value) }))
                          }
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {currentQuestion.options?.map((option, optionIndex) => (
                              <Box key={optionIndex} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <FormControlLabel
                                  value={optionIndex.toString()}
                                  control={<Radio />}
                                  label=""
                                  sx={{ m: 0 }}
                                />
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder={`Option ${optionIndex + 1}`}
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(currentQuestion.options || [])];
                                    newOptions[optionIndex] = e.target.value;
                                    setCurrentQuestion((prev) => ({ ...prev, options: newOptions }));
                                  }}
                                />
                              </Box>
                            ))}
                          </Box>
                        </RadioGroup>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Select the correct answer by clicking the radio button
                        </Typography>
                      </Box>
                    )}

                    {/* True/False Options */}
                    {currentQuestion.type === "true-false" && (
                      <Box>
                        <FormControl>
                          <FormLabel component="legend">Correct Answer</FormLabel>
                          <RadioGroup
                            value={currentQuestion.correctAnswer.toString()}
                            onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                          >
                            <FormControlLabel value="true" control={<Radio />} label="True" />
                            <FormControlLabel value="false" control={<Radio />} label="False" />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    )}

                    {/* Short Answer */}
                    {currentQuestion.type === "short-answer" && (
                      <TextField
                        fullWidth
                        label="Sample Answer (for grading reference)"
                        placeholder="Enter a sample correct answer"
                        value={currentQuestion.correctAnswer}
                        onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                      />
                    )}

                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" onClick={handleAddQuestion}>
                        Update Question
                      </Button>
                      <Button variant="outlined" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              ) : (
                // Display Mode
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Chip label={`Question ${index + 1}`} size="small" />
                      <Chip label={question.type} color="secondary" size="small" />
                      <Chip label={`${question.points} pts`} variant="outlined" size="small" />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {question.question}
                    </Typography>
                    
                    {/* Multiple Choice Options */}
                    {question.type === "multiple-choice" && question.options && (
                      <Box sx={{ ml: 2 }}>
                        {question.options.map((option, optionIndex) => (
                          <Box key={optionIndex} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: optionIndex === question.correctAnswer ? "success.main" : "grey.300",
                              }}
                            />
                            <Typography
                              color={optionIndex === question.correctAnswer ? "success.main" : "text.primary"}
                              fontWeight={optionIndex === question.correctAnswer ? "bold" : "normal"}
                            >
                              {option}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                    
                    {/* True/False Answer */}
                    {question.type === "true-false" && (
                      <Typography color="success.main" fontWeight="bold" sx={{ ml: 2 }}>
                        Correct Answer: {question.correctAnswer}
                      </Typography>
                    )}
                    
                    {/* Short Answer */}
                    {question.type === "short-answer" && (
                      <Typography color="success.main" fontWeight="bold" sx={{ ml: 2 }}>
                        Sample Answer: {question.correctAnswer}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => startEditingQuestion(question)}
                      size="small"
                      title="Edit question"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveQuestion(question.id)}
                      size="small"
                      title="Delete question"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Paper>
          ))}

          {/* Add Question Form */}
          {isAddingQuestion && !editingQuestionId && (
            <Paper sx={{ p: 3, border: "2px dashed", borderColor: "grey.300", mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6">Add New Question</Typography>
                <Button variant="text" onClick={resetCurrentQuestion}>
                  Cancel
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' }, 
                  gap: 3 
                }}>
                  <FormControl fullWidth>
                    <InputLabel>Question Type</InputLabel>
                    <Select
                      value={currentQuestion.type}
                      label="Question Type"
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          type: e.target.value as Question["type"],
                        }))
                      }
                    >
                      <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                      <MenuItem value="short-answer">Short Answer</MenuItem>
                      <MenuItem value="true-false">True/False</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    type="number"
                    label="Points"
                    inputProps={{ min: 1, max: 10 }}
                    value={currentQuestion.points}
                    onChange={(e) =>
                      setCurrentQuestion((prev) => ({ ...prev, points: parseInt(e.target.value) }))
                    }
                  />
                </Box>
                
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Question"
                  placeholder="Enter your question"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))}
                />

                {/* Multiple Choice Options */}
                {currentQuestion.type === "multiple-choice" && (
                  <Box>
                    <FormLabel component="legend" sx={{ mb: 2 }}>Answer Options</FormLabel>
                    <RadioGroup
                      value={currentQuestion.correctAnswer.toString()}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({ ...prev, correctAnswer: parseInt(e.target.value) }))
                      }
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {currentQuestion.options?.map((option, index) => (
                          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <FormControlLabel
                              value={index.toString()}
                              control={<Radio />}
                              label=""
                              sx={{ m: 0 }}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              placeholder={`Option ${index + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(currentQuestion.options || [])];
                                newOptions[index] = e.target.value;
                                setCurrentQuestion((prev) => ({ ...prev, options: newOptions }));
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </RadioGroup>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Select the correct answer by clicking the radio button
                    </Typography>
                  </Box>
                )}

                {/* True/False Options */}
                {currentQuestion.type === "true-false" && (
                  <Box>
                    <FormControl>
                      <FormLabel component="legend">Correct Answer</FormLabel>
                      <RadioGroup
                        value={currentQuestion.correctAnswer.toString()}
                        onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                      >
                        <FormControlLabel value="true" control={<Radio />} label="True" />
                        <FormControlLabel value="false" control={<Radio />} label="False" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                )}

                {/* Short Answer */}
                {currentQuestion.type === "short-answer" && (
                  <TextField
                    fullWidth
                    label="Sample Answer (for grading reference)"
                    placeholder="Enter a sample correct answer"
                    value={currentQuestion.correctAnswer}
                    onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                  />
                )}

                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleAddQuestion}>
                    Add Question
                  </Button>
                  <Button variant="outlined" onClick={resetCurrentQuestion}>
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Paper>
          )}

          {/* Empty State */}
          {quiz.questions.length === 0 && !isAddingQuestion && !editingQuestionId && (
            <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
              <Typography variant="body1">
                No questions added yet. Click "Add Question" to get started.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Quiz Preview</Typography>
          <MuiIconButton onClick={() => setShowPreview(false)}>
            <CloseIcon />
          </MuiIconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <QuizAttempt quiz={quiz} isPreview={true} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
