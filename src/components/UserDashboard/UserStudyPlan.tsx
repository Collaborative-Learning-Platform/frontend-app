import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { Lightbulb as LightbulbIcon } from "@mui/icons-material";
import React, { useState } from "react";
import StudyPlanGeneratorModal from "./StudyPlanGeneratorModal";

const mockStudyPlan = [
  {
    id: 1,
    task: "Review Data Structures",
    priority: "high",
    estimatedTime: "2 hours",
    completed: false,
  },
  {
    id: 2,
    task: "Practice Calculus Problems",
    priority: "medium",
    estimatedTime: "1.5 hours",
    completed: true,
  },
  {
    id: 3,
    task: "Read Physics Chapter 5",
    priority: "low",
    estimatedTime: "45 min",
    completed: false,
  },
  {
    id: 4,
    task: "Group Discussion: Algorithms",
    priority: "high",
    estimatedTime: "1 hour",
    completed: false,
  },
];

export function UserStudyPlan() {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return theme.palette.error.main;
      case "medium":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Personalized Study Plan
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-generated plan based on your performance and goals
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<LightbulbIcon />}
          onClick={() => setOpenModal(true)}
        >
          Generate Plan
        </Button>
      </Box>
      {openModal && (
        <StudyPlanGeneratorModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
      <Card>
        <CardHeader
          title="Today's Tasks"
          subheader="Complete these tasks to stay on track"
        />
        <CardContent>
          <List>
            {mockStudyPlan.map((task, index) => (
              <React.Fragment key={task.id}>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox checked={task.completed} disabled />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                          color: task.completed
                            ? "text.disabled"
                            : "text.primary",
                        }}
                      >
                        {task.task}
                      </Typography>
                    }
                    secondary={`Estimated: ${task.estimatedTime}`}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: getPriorityColor(task.priority),
                      }}
                    />
                    <Chip
                      label={task.priority}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </ListItem>
                {index < mockStudyPlan.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
