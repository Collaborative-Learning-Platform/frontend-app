import { Box, Card, CardContent, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";
import { Outlet } from "react-router-dom";

// Mock flashcard stats - you can later replace with real data
const flashcardStats = {
  totalSets: 24,
  totalCards: 340,
  thisWeek: 12,
};

export const FlashCardLayout = () => {
  return (
    <Box>
      {/* Flashcard-specific Quick Stats */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ mb: 3, textAlign: "left" }}
        >
          Flashcards
        </Typography>

        <Masonry columns={3} spacing={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                {flashcardStats.totalSets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sets
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                {flashcardStats.totalCards}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cards
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" fontWeight="bold" color="info.main">
                {flashcardStats.thisWeek}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Week
              </Typography>
            </CardContent>
          </Card>
        </Masonry>
      </Box>

      {/* Render the child component (FlashCardGenerator or FlashCardLibrary) */}
      <Outlet />
    </Box>
  );
};
