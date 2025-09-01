import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { _404headingStyles, containerStyles, secondHeadingStyles, typographyStyles } from "../styles/pages/NotFound";

function NotFound() {
  return (
    <Container
      maxWidth="md"
      sx={containerStyles}
    >
      <Typography
        variant="h1"
        component="h1"
        sx={_404headingStyles}
      >
        404
      </Typography>

      <Typography variant="h5" sx={secondHeadingStyles}>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>

      <Typography variant="body1" sx={typographyStyles}>
        It might have been removed, had its name changed, or is temporarily
        unavailable.
      </Typography>

      <Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/"
          sx={{ mr: 2 }}
        >
          Back to Home
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
