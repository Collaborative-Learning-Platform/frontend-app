import { useState } from "react";
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
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import BarChartIcon from "@mui/icons-material/BarChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TutorAnalytics() {
  const theme = useTheme();
  const [expandedQuizDetails, setExpandedQuizDetails] = useState<number | null>(
    null
  );

  interface Quiz {
    id: number;
    title: string;
    workspace: string;
    attempts: number;
    avgScore: number;
    dueDate: string;
  }

  type PerformanceData = {
    scoreRange: string;
    studentCount: number;
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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

  const recentQuizzes: Quiz[] = [
    {
      id: 1,
      title: "Math Quiz 1",
      workspace: "Mathematics 101",
      attempts: 15,
      avgScore: 85,
      dueDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Physics Test",
      workspace: "Physics Advanced",
      attempts: 12,
      avgScore: 78,
      dueDate: "2024-01-18",
    },
    {
      id: 3,
      title: "Convolution Test",
      workspace: "Image Processing",
      attempts: 120,
      avgScore: 78,
      dueDate: "2024-01-18",
    },
  ];

  const performanceData: Record<number, PerformanceData[]> = {
    1: [
      { scoreRange: "90-100%", studentCount: 5 },
      { scoreRange: "80-89%", studentCount: 8 },
      { scoreRange: "70-79%", studentCount: 6 },
      { scoreRange: "60-69%", studentCount: 3 },
      { scoreRange: "50-59%", studentCount: 2 },
      { scoreRange: "0-49%", studentCount: 1 },
    ],
    2: [
      { scoreRange: "90-100%", studentCount: 8 },
      { scoreRange: "80-89%", studentCount: 4 },
      { scoreRange: "70-79%", studentCount: 6 },
      { scoreRange: "60-69%", studentCount: 21 },
      { scoreRange: "50-59%", studentCount: 2 },
      { scoreRange: "0-49%", studentCount: 10 },
    ],
    3: [
      { scoreRange: "90-100%", studentCount: 17 },
      { scoreRange: "80-89%", studentCount: 23 },
      { scoreRange: "70-79%", studentCount: 19 },
      { scoreRange: "60-69%", studentCount: 21 },
      { scoreRange: "50-59%", studentCount: 28 },
      { scoreRange: "0-49%", studentCount: 12 },
    ],
  };

  const toggleQuizDetails = (quizId: number) => {
    setExpandedQuizDetails(expandedQuizDetails === quizId ? null : quizId);
  };

  const getQuizPerformanceData = (quizId: number): PerformanceData[] => {
    return performanceData[quizId] ?? [];
  };

  const getChartData = (quizId: number) => ({
    labels: getQuizPerformanceData(quizId).map((item) => item.scoreRange),
    datasets: [
      {
        label: "Number of Students",
        data: getQuizPerformanceData(quizId).map((item) => item.studentCount),
        backgroundColor: alpha(theme.palette.primary.main, 0.6),
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "revert", gap: 1, mb: 3 }}>
        <BarChartIcon sx={{ fontSize: 30}} />
        <Typography variant="h4"  fontWeight="bold">
          Quiz Analytics
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 3,
          "& > *": {
            flex: { xs: "1 1 100%", lg: "1 1 calc(50% - 12px)" },
          },
        }}
      >
        <Card elevation={2}>
          <CardHeader
            title="Quiz Performance by Workspace"
            subheader="Average scores across your workspaces"
            titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
            subheaderTypographyProps={{
              variant: "body2",
              color: "text.secondary",
            }}
          />
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Mathematics 101</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    85% (22 attempts)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Physics Advanced</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    78% (16 attempts)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={78}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Chemistry Basics</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    92% (28 attempts)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={92}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Quiz Difficulty Analysis */}
        <Card elevation={2}>
          <CardHeader
            title="Quiz Difficulty Analysis"
            subheader="Performance trends by question difficulty"
            titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
            subheaderTypographyProps={{
              variant: "body2",
              color: "text.secondary",
            }}
          />
          <CardContent>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">Easy Questions</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    94% avg
                  </Typography>
                  <Chip
                    label="Excellent"
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      fontWeight: "medium",
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">Medium Questions</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    82% avg
                  </Typography>
                  <Chip
                    label="Good"
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      fontWeight: "medium",
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">Hard Questions</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    67% avg
                  </Typography>
                  <Chip
                    label="Needs Focus"
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      fontWeight: "medium",
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Quiz Results with Expandable Charts */}
      <Card elevation={2}>
        <CardHeader
          title="Recent Quiz Results"
          subheader="Detailed breakdown of your latest quizzes"
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
          subheaderTypographyProps={{
            variant: "body2",
            color: "text.secondary",
          }}
        />
        <CardContent>
          <Stack spacing={3}>
            {recentQuizzes.map((quiz) => (
              <Box key={quiz.id}>
                {/* Main Quiz Row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.action.hover, 0.04),
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
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Box sx={{ textAlign: "center", minWidth: 60 }}>
                      <Typography variant="caption" color="text.secondary">
                        Attempts
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {quiz.attempts}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "center", minWidth: 60 }}>
                      <Typography variant="caption" color="text.secondary">
                        Avg Score
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color="primary.main"
                      >
                        {quiz.avgScore}%
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "center", minWidth: 80 }}>
                      <Typography variant="caption" color="text.secondary">
                        Due Date
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {quiz.dueDate}
                      </Typography>
                    </Box>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => toggleQuizDetails(quiz.id)}
                      endIcon={
                        <Box
                          sx={{
                            transition: "transform 0.3s ease",
                            transform:
                              expandedQuizDetails === quiz.id
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        >
                          <ExpandMore />
                        </Box>
                      }
                    >
                      {expandedQuizDetails === quiz.id
                        ? "Hide Details"
                        : "View Details"}
                    </Button>
                  </Box>
                </Box>

                {/* Expandable Chart Section with Smooth Transitions */}
                <Collapse
                  in={expandedQuizDetails === quiz.id}
                  timeout={500}
                  easing={{
                    enter: "cubic-bezier(0.4, 0, 0.2, 1)",
                    exit: "cubic-bezier(0.4, 0, 0.6, 1)",
                  }}
                >
                  <Fade
                    in={expandedQuizDetails === quiz.id}
                    timeout={600}
                    style={{
                      transitionDelay:
                        expandedQuizDetails === quiz.id ? "150ms" : "0ms",
                    }}
                  >
                    <Box sx={{ ml: 2, mt: 2 }}>
                      <Card variant="outlined">
                        <CardHeader
                          title="Student Score Distribution"
                          subheader={`Number of students in each score range for ${quiz.title}`}
                          titleTypographyProps={{ variant: "h6" }}
                          subheaderTypographyProps={{
                            variant: "body2",
                            color: "text.secondary",
                          }}
                        />
                        <CardContent>
                          <Box sx={{ height: 300, mb: 3 }}>
                            <Bar
                              data={getChartData(quiz.id)}
                              options={chartOptions}
                            />
                          </Box>

                          {/* Summary Statistics */}
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 3,
                              "& > *": {
                                flex: {
                                  xs: "1 1 100%",
                                  sm: "1 1 calc(33.333% - 16px)",
                                },
                                textAlign: "center",
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
                                {getQuizPerformanceData(quiz.id).reduce(
                                  (sum, range) => sum + range.studentCount,
                                  0
                                )}
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
                                {getQuizPerformanceData(quiz.id)[0]
                                  ?.studentCount || 0}{" "}
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
                                {getQuizPerformanceData(quiz.id)
                                  .slice(-2)
                                  .reduce(
                                    (sum, range) => sum + range.studentCount,
                                    0
                                  )}{" "}
                                students
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  </Fade>
                </Collapse>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
