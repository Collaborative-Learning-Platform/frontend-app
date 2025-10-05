import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  LinearProgress,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Slider,
} from "@mui/material";
import {
  Close as CloseIcon,
  AutoAwesome as SparklesIcon,
  Psychology as BrainIcon,
  EmojiEvents as TargetIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";

interface DailyTimeAvailability {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

interface StudyPlanForm {
  studyGoal: string;
  goalDescription: string;
  overallTimePerDay: string;
  dailyTimeAvailability: DailyTimeAvailability;
  subject?: string;
  priority?: string;
}

interface StudyPlanTask {
  id: string;
  task: string;
  topic: string;
  estimatedTime: string;
  estimatedMinutes: number;
  completed?: boolean;
  type?: 'reading' | 'video' | 'quiz' | 'practice';
}

interface StudyPlanDay {
  day: string;
  tasks: StudyPlanTask[];
  totalTime?: string;
  totalMinutes: number;
  actualStudyTime?: number;
}



interface StudyPlanGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onPlanGenerated?: (plan: StudyPlanDay[]) => void;
}

const StudyPlanGeneratorModal = ({
  open,
  onClose,
  onPlanGenerated,
}: StudyPlanGeneratorModalProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<StudyPlanForm>({
    studyGoal: '',
    goalDescription: '',
    overallTimePerDay: '',
    dailyTimeAvailability: {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0
    },
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = ['Goals & Timeline', 'Time Availability', 'Review & Generate'];

  const formatHours = (hours: number) => {
    if (hours === 0) return 'No study time';
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
  };

  const generateStudyPlan = async () => {
    setIsGenerating(true);
    console.log(formData)

    try{
      const response = await axiosInstance.post("/aiservice/generate-study-plan", formData,{
        timeout: 120000, // 2 minutes timeout
      });
      if(!response.data.success){
        console.error("Failed to generate study plan:", response.data.message);  
      }
      console.log(response.data)
      const generatedPlan: StudyPlanDay[] = response.data.data;
      if (onPlanGenerated) {
        onPlanGenerated(generatedPlan)
      }
      setIsGenerating(false);
      handleClose();

    } catch (error) {
      console.error("Error generating study plan:", error);
      setIsGenerating(false)
    }
    
  };


  const resetForm = () => {
    setFormData({
      studyGoal: '',
      goalDescription: '',
      overallTimePerDay: '',
      dailyTimeAvailability: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      },
    });
    setActiveStep(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return formData.studyGoal && formData.goalDescription;
      case 1:
        const hasTimeSet = Object.values(formData.dailyTimeAvailability).some(time => time > 0);
        return formData.overallTimePerDay && hasTimeSet;
      case 2:
        return true;
      default:
        return false;
    }
  };



  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: theme.palette.primary.main, 
                width: { xs: 48, sm: 60 }, 
                height: { xs: 48, sm: 60 }, 
                mx: 'auto', 
                mb: 2 
              }}>
                <TargetIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />
              </Avatar>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                What Do You Want to Achieve?
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Help us understand your learning objectives
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Primary Study Goal"
              placeholder="e.g., Pass Computer Science Exam, Master React Development, Improve Mathematics Skills"
              value={formData.studyGoal}
              onChange={(e) => setFormData({...formData, studyGoal: e.target.value})}
              helperText="What is the main thing you want to accomplish?"
            />

            <TextField
              fullWidth
              label="Detailed Description"
              placeholder="Describe what specific topics, skills, or knowledge areas you want to focus on. What challenges are you facing? What level do you want to reach?"
              value={formData.goalDescription}
              onChange={(e) => setFormData({...formData, goalDescription: e.target.value})}
              multiline
              rows={4}
              helperText="The more details you provide, the better we can customize your study plan"
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: theme.palette.secondary.main, 
                width: { xs: 48, sm: 60 }, 
                height: { xs: 48, sm: 60 }, 
                mx: 'auto', 
                mb: 2 
              }}>
                <ScheduleIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />
              </Avatar>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Set Your Time Availability
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Use the sliders to set how much time you can dedicate to studying each day
              </Typography>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Overall Daily Study Time</InputLabel>
              <Select
                value={formData.overallTimePerDay}
                onChange={(e) => setFormData({...formData, overallTimePerDay: e.target.value})}
              >
                <MenuItem value="30min">30 minutes</MenuItem>
                <MenuItem value="1hour">1 hour</MenuItem>
                <MenuItem value="1.5hours">1.5 hours</MenuItem>
                <MenuItem value="2hours">2 hours</MenuItem>
                <MenuItem value="3hours">3+ hours</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Daily Time Availability
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set the exact number of hours you can study each day of the week
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {Object.entries(formData.dailyTimeAvailability).map(([day, hours]) => (
                  <Box key={day} sx={{ px: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 1 
                    }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          textTransform: 'capitalize',
                          fontWeight: 'medium',
                          minWidth: 80
                        }}
                      >
                        {day}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="primary"
                        sx={{ 
                          fontWeight: 'medium',
                          minWidth: 100,
                          textAlign: 'right'
                        }}
                      >
                        {formatHours(hours)}
                      </Typography>
                    </Box>
                    <Slider
                      value={hours}
                      onChange={(_, newValue) => {
                        setFormData({
                          ...formData,
                          dailyTimeAvailability: {
                            ...formData.dailyTimeAvailability,
                            [day]: newValue as number
                          }
                        });
                      }}
                      min={0}
                      max={8}
                      step={0.5}
                      marks={[
                        { value: 0, label: '0h' },
                        { value: 2, label: '2h' },
                        { value: 4, label: '4h' },
                        { value: 6, label: '6h' },
                        { value: 8, label: '8h' }
                      ]}
                      sx={{
                        '& .MuiSlider-thumb': {
                          width: 20,
                          height: 20,
                        },
                        '& .MuiSlider-track': {
                          height: 8,
                        },
                        '& .MuiSlider-rail': {
                          height: 8,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: theme.palette.success.main, 
                width: { xs: 48, sm: 60 }, 
                height: { xs: 48, sm: 60 }, 
                mx: 'auto', 
                mb: 2 
              }}>
                <CheckIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />
              </Avatar>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Review Your Plan Details
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Confirm your settings before generating your personalized study plan
              </Typography>
            </Box>

            <Card sx={{ 
              p: { xs: 2, sm: 3 }, 
              bgcolor: alpha(theme.palette.primary.main, 0.05) 
            }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                color="primary"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                📋 Plan Summary
              </Typography>
              
              <Box sx={{ display: 'grid', gap: { xs: 1.5, sm: 2 } }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Study Goal:</Typography>
                  <Typography variant="body1">{formData.studyGoal || 'Not specified'}</Typography>
                </Box>

                {formData.goalDescription && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Goal Description:</Typography>
                    <Typography variant="body2">{formData.goalDescription}</Typography>
                  </Box>
                )}
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Overall Daily Time:</Typography>
                  <Typography variant="body1">{formData.overallTimePerDay || 'Not specified'}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Weekly Schedule:</Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { 
                      xs: 'repeat(2, 1fr)', 
                      sm: 'repeat(4, 1fr)', 
                      md: 'repeat(7, 1fr)' 
                    }, 
                    gap: { xs: 2, sm: 1 }, 
                    mt: 1 
                  }}>
                    {Object.entries(formData.dailyTimeAvailability).map(([day, hours]) => (
                      <Box key={day} sx={{ textAlign: 'center', p: 1 }}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            textTransform: 'capitalize',
                            display: 'block',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        >
                          {isSmallScreen ? day.slice(0, 3) : day}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: hours > 0 ? 'medium' : 'normal',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            mt: 0.5
                          }}
                        >
                          {formatHours(hours)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                {formData.subject && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Subject:</Typography>
                    <Typography variant="body1">{formData.subject}</Typography>
                  </Box>
                )}
              </Box>
            </Card>

            <Card 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                bgcolor: alpha(theme.palette.success.main, 0.05),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'center' }, 
                gap: 2,
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                <BrainIcon sx={{ 
                  color: theme.palette.success.main, 
                  fontSize: { xs: 28, sm: 32 },
                  flexShrink: 0
                }} />
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h6" 
                    color="success.main"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    🚀 Ready to Generate Your AI Study Plan!
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      lineHeight: 1.4,
                      mt: 0.5
                    }}
                  >
                    Our AI will create a personalized learning roadmap tailored to your goals, schedule, and learning style.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isSmallScreen}
      PaperProps={{
        sx: {
          maxHeight: { xs: "100vh", sm: "95vh" },
          borderRadius: { xs: 0, sm: 3 },
          margin: { xs: 0, sm: 1 },
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          position: "relative",
          pb: 3,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: 'white',
            backgroundColor: alpha(theme.palette.common.black, 0.2),
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.black, 0.3),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ pr: { xs: 3, sm: 5 } }}>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              flexWrap: { xs: 'wrap', sm: 'nowrap' }
            }}
          >
            <SparklesIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
            <Box component="span" sx={{ lineHeight: 1.2 }}>
              AI Study Plan Generator
            </Box>
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.9, 
              mt: 1,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              lineHeight: 1.4
            }}
          >
            Create a personalized learning roadmap powered by artificial intelligence
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ mt: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={isStepComplete(index) === true}>
                <StepLabel 
                  sx={{ 
                    '& .MuiStepLabel-label': { 
                      color: 'white !important',
                      fontWeight: activeStep === index ? 'bold' : 'normal'
                    },
                    '& .MuiStepIcon-root': {
                      color: alpha(theme.palette.common.white, 0.5),
                      '&.Mui-active': {
                        color: 'white'
                      },
                      '&.Mui-completed': {
                        color: theme.palette.success.light
                      }
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {isGenerating ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 6 } }}>
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <CircularProgress size={isSmallScreen ? 50 : 60} thickness={4} />
            </Box>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              🤖 AI is Creating Your Study Plan...
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              Analyzing your preferences and generating a personalized learning roadmap
            </Typography>
            <LinearProgress 
              sx={{ 
                width: { xs: '80%', sm: '60%' }, 
                mx: 'auto',
                height: { xs: 6, sm: 8 },
                borderRadius: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4
                }
              }} 
            />
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mt: 2, 
                display: 'block',
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            >
              This may take a few seconds...
            </Typography>
          </Box>
        ) : (
          renderStepContent(activeStep)
        )}
      </DialogContent>

      {!isGenerating && (
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: { xs: 'stretch', sm: 'space-between' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Button 
            onClick={handleClose} 
            color="inherit"
            sx={{ 
              minWidth: { xs: 'auto', sm: 100 },
              order: { xs: 2, sm: 1 }
            }}
          >
            Cancel
          </Button>
          
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 },
            order: { xs: 1, sm: 2 },
            flexDirection: { xs: 'row', sm: 'row' },
            justifyContent: { xs: 'stretch', sm: 'flex-end' }
          }}>
            {activeStep > 0 && (
              <Button 
                onClick={handleBack}
                variant="outlined"
                sx={{ 
                  minWidth: { xs: 'auto', sm: 100 },
                  flex: { xs: 1, sm: 'none' }
                }}
              >
                Back
              </Button>
            )}
            
            {activeStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={!isStepComplete(activeStep)}
                sx={{ 
                  minWidth: { xs: 'auto', sm: 100 },
                  flex: { xs: 1, sm: 'none' }
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={generateStudyPlan}
                variant="contained"
                disabled={!isStepComplete(activeStep)}
                startIcon={!isSmallScreen ? <SparklesIcon /> : undefined}
                sx={{ 
                  minWidth: { xs: 'auto', sm: 200 },
                  flex: { xs: 1, sm: 'none' },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
                  },
                  fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  px: { xs: 2, sm: 3 }
                }}
              >
                {isSmallScreen ? 'Generate Plan' : 'Generate AI Study Plan'}
              </Button>
            )}
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default StudyPlanGeneratorModal;
