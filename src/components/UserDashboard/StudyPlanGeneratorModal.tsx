import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
  Paper,
  LinearProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  AutoAwesome as SparklesIcon,
} from "@mui/icons-material";

interface StudyPlanForm {
  subject: string;
  duration: string;
  studyHours: string;
  difficulty: string;
  goals: string;
  topics: string[];
  studyStyle: string[];
}

interface StudyPlanGeneratorModalProps {
  open: boolean;
  onClose: () => void;
}

const StudyPlanGeneratorModal = ({
  open,
  onClose,
}: StudyPlanGeneratorModalProps) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<StudyPlanForm>({
    subject: "",
    duration: "",
    studyHours: "",
    difficulty: "",
    goals: "",
    topics: [],
    studyStyle: [],
  });
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTopicChange = (topic: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      topics: checked
        ? [...prev.topics, topic]
        : prev.topics.filter((t) => t !== topic),
    }));
  };

  const handleStudyStyleChange = (style: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      studyStyle: checked
        ? [...prev.studyStyle, style]
        : prev.studyStyle.filter((s) => s !== style),
    }));
  };

  const generateStudyPlan = async () => {
    setIsGenerating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockPlan = {
      title: `${formData.subject} Study Plan`,
      duration: formData.duration,
      totalHours: formData.studyHours,
      weeks: [
        {
          week: 1,
          focus: "Foundation & Core Concepts",
          tasks: [
            "Review basic terminology and definitions",
            "Complete introductory readings",
            "Practice fundamental exercises",
          ],
        },
        {
          week: 2,
          focus: "Intermediate Topics",
          tasks: [
            "Dive deeper into key concepts",
            "Work on practical applications",
            "Join study group discussions",
          ],
        },
        {
          week: 3,
          focus: "Advanced Applications",
          tasks: [
            "Tackle complex problems",
            "Create project or presentation",
            "Review and consolidate knowledge",
          ],
        },
      ],
    };

    setGeneratedPlan(mockPlan);
    setIsGenerating(false);
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      duration: "",
      studyHours: "",
      difficulty: "",
      goals: "",
      topics: [],
      studyStyle: [],
    });
    setGeneratedPlan(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const topicOptions = [
    "Theory",
    "Practice",
    "Projects",
    "Exams",
    "Research",
    "Applications",
  ];

  const styleOptions = [
    "Visual",
    "Auditory",
    "Reading",
    "Hands-on",
    "Group Study",
    "Solo Study",
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "relative",
          pb: 2,
          backgroundColor: "primary.main",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "error.contrastText",
            backgroundColor: "error.main",
            "&:hover": {
              backgroundColor: "error.dark",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ pr: 5 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            color="primary.contrastText"
          >
            Create Study Plan
          </Typography>
          <Typography
            variant="body2"
            color="primary.contrastText"
            sx={{ mt: 0.5 }}
          >
            Generate a personalized learning schedule
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {!generatedPlan ? (
          <Box>
            {isGenerating && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.5, textAlign: "center" }}
                >
                  Generating your study plan...
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                marginTop: 1,
              }}
            >
              {/* Subject */}
              <TextField
                label="Subject"
                placeholder="e.g., Mathematics, Biology, Programming"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                fullWidth
              />

              {/* Duration and Study Hours */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={formData.duration}
                    label="Duration"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="1-week">1 Week</MenuItem>
                    <MenuItem value="2-weeks">2 Weeks</MenuItem>
                    <MenuItem value="1-month">1 Month</MenuItem>
                    <MenuItem value="3-months">3 Months</MenuItem>
                    <MenuItem value="6-months">6 Months</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Hours/Week</InputLabel>
                  <Select
                    value={formData.studyHours}
                    label="Hours/Week"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        studyHours: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="5-10">5-10 hours</MenuItem>
                    <MenuItem value="10-15">10-15 hours</MenuItem>
                    <MenuItem value="15-20">15-20 hours</MenuItem>
                    <MenuItem value="20+">20+ hours</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Difficulty Level */}
              <FormControl fullWidth>
                <InputLabel>Current Level</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Current Level"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>

              {/* Goals */}
              <TextField
                label="Learning Goals"
                placeholder="What do you want to achieve?"
                value={formData.goals}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, goals: e.target.value }))
                }
                multiline
                rows={3}
                fullWidth
              />

              {/* Focus Areas */}
              <Box>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Focus Areas
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {topicOptions.map((topic) => (
                    <Chip
                      key={topic}
                      label={topic}
                      variant={
                        formData.topics.includes(topic) ? "filled" : "outlined"
                      }
                      color={
                        formData.topics.includes(topic) ? "primary" : "default"
                      }
                      onClick={() =>
                        handleTopicChange(
                          topic,
                          !formData.topics.includes(topic)
                        )
                      }
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Learning Style */}
              <Box>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Learning Style
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {styleOptions.map((style) => (
                    <Chip
                      key={style}
                      label={style}
                      variant={
                        formData.studyStyle.includes(style)
                          ? "filled"
                          : "outlined"
                      }
                      color={
                        formData.studyStyle.includes(style)
                          ? "secondary"
                          : "default"
                      }
                      onClick={() =>
                        handleStudyStyleChange(
                          style,
                          !formData.studyStyle.includes(style)
                        )
                      }
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Generate Button */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={generateStudyPlan}
                  disabled={
                    !formData.subject || !formData.duration || isGenerating
                  }
                  size="large"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                  startIcon={
                    isGenerating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SparklesIcon sx={{ color: "primary.contrastText" }} />
                    )
                  }
                >
                  {isGenerating ? (
                    <Typography color="primary.contrastText">
                      Generating...
                    </Typography>
                  ) : (
                    <Typography color="primary.contrastText">
                      Generate Plan
                    </Typography>
                  )}
                </Button>
                <Button
                  onClick={handleClose}
                  sx={{
                    backgroundColor: "error.main",
                    color: "error.contrastText",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            {/* Success Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h5"
                fontWeight={600}
                color="primary"
                gutterBottom
              >
                Study Plan Generated
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your personalized learning schedule is ready
              </Typography>
            </Box>

            {/* Generated Plan */}
            <Card
              variant="outlined"
              sx={{
                mb: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {generatedPlan.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Chip
                      label={generatedPlan.duration}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${generatedPlan.totalHours}/week`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {generatedPlan.weeks.map((week: any, index: number) => (
                    <Paper
                      key={index}
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        Week {week.week}: {week.focus}
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2 }}>
                        {week.tasks.map((task: string, taskIndex: number) => (
                          <Typography
                            key={taskIndex}
                            component="li"
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {task}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={resetForm}
                variant="outlined"
                sx={{ flex: 1 }}
                startIcon={<SparklesIcon />}
              >
                Create New Plan
              </Button>
              <Button
                onClick={handleClose}
                variant="contained"
                sx={{ flex: 1 }}
              >
                Save Plan
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudyPlanGeneratorModal;
