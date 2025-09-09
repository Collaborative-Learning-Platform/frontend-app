import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
  Stack,
  Paper,
} from "@mui/material";

function About() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          About <span style={{ color: "#1976d2" }}>Learni</span>
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.7 }}
        >
          Learni is a collaborative learning platform designed to bring{" "}
          <strong>Admins, Tutors, and Students</strong> together in an engaging
          and productive way.  
          <br />
          Our goal is to make online education more interactive with{" "}
          group-based quizzes, real-time collaboration, and resource sharing —
          all in one place.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <Button component={Link} to="/" variant="contained">
            Back to Home
          </Button>

        </Stack>

        <Typography variant="caption" color="text.secondary">
          🚀 Built with React, NestJS, and PostgreSQL — empowering modern
          education.
        </Typography>
      </Paper>
    </Container>
  );
}

export default About;
