import {
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Schedule as ClockIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type QuizCardProps = {
  id: string;
  title: string;
  workspace: string;
  duration: string;
  dueDate: string;
  onStart?: (id: number) => void;
};

const QuizCard = ({
  id,
  title,
  workspace,
  duration,
  dueDate,
}: QuizCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/attempt/${quizId}`);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2 },
        mb: 2,
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 2, sm: 1 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant={isMobile ? "body1" : "subtitle1"}
            fontWeight="medium"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" },
              lineHeight: 1.3,
              mb: 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={title}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              mb: { xs: 1, sm: 0.5 },
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={workspace}
          >
            {workspace}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mt: 0.5,
            }}
          >
            <ClockIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
            >
              {duration}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", sm: "column" },
            alignItems: { xs: "center", sm: "flex-end" },
            justifyContent: { xs: "space-between", sm: "center" },
            gap: { xs: 1, sm: 0 },
            minWidth: { sm: 120 },
          }}
        >
          <Chip
            label={dueDate}
            variant="outlined"
            size={isMobile ? "small" : "small"}
            sx={{
              mb: { xs: 0, sm: 1 },
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              height: { xs: 24, sm: 28 },
            }}
          />

          <Button
            variant="contained"
            size={isMobile ? "small" : "small"}
            onClick={() => handleStartQuiz(id)}
            sx={{
              minWidth: { xs: 80, sm: "100%" },
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              py: { xs: 0.5, sm: 0.75 },
              
            }}
          >
            Start Quiz
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default QuizCard;
