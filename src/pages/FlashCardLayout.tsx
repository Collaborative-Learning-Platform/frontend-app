import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { Masonry } from "@mui/lab";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StyleIcon from "@mui/icons-material/Style";
import AddIcon from "@mui/icons-material/Add";

// Mock flashcard stats - you can later replace with real data
const flashcardStats = {
  totalSets: 24,
  totalCards: 340,
  thisWeek: 12,
};

export const FlashCardLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if we're on the library page
  const isOnLibraryPage = location.pathname.includes("/flashcard-library");

  const handleButtonClick = () => {
    if (isOnLibraryPage) {
      // If on library page, navigate to generator (New Set functionality)
      navigate("/flashcard-generator");
    } else {
      // If on generator page, navigate to library
      navigate("/flashcard-library");
    }
  };
  return (
    <Box>
      {/* Header */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StyleIcon
                  sx={{
                    fontSize: { xs: 24, sm: 28 },
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
                >
                  Flashcards
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="contained"
                startIcon={isOnLibraryPage ? <AddIcon /> : <StyleIcon />}
                onClick={handleButtonClick}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  py: { xs: 1, sm: 1.5 },
                  minWidth: "140px",
                  height: "40px",
                  px: 2,
                }}
              >
                {isOnLibraryPage ? "New Set" : "View Library"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Box py={3}>
        {/* Render the child component (FlashCardGenerator or FlashCardLibrary) */}
        <Outlet />
      </Box>
      <Box py={3}>
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
    </Box>
  );
};
