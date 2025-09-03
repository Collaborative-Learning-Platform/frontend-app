import {
  Box,
  useTheme,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import BookIcon from "@mui/icons-material/Book";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import { useState } from "react";

interface FlashcardSet {
  id: string;
  title: string;
  subject: string;
  cardCount: number;
  createdAt: string;
  isShared: boolean;
}

export const FlashCardLibrary = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);

  // Mock data for flashcard library
  const flashcardSets: FlashcardSet[] = [
    {
      id: "1",
      title: "Biology Chapter 5: Cell Structure",
      subject: "Biology",
      cardCount: 15,
      createdAt: "2024-01-15",
      isShared: false,
    },
    {
      id: "2",
      title: "Spanish Vocabulary: Food & Dining",
      subject: "Spanish",
      cardCount: 20,
      createdAt: "2024-01-12",
      isShared: true,
    },
    {
      id: "3",
      title: "Physics: Newton's Laws",
      subject: "Physics",
      cardCount: 10,
      createdAt: "2024-01-10",
      isShared: false,
    },
    {
      id: "4",
      title: "World History: Renaissance",
      subject: "History",
      cardCount: 25,
      createdAt: "2024-01-08",
      isShared: true,
    },
  ];

  const filteredSets = flashcardSets.filter(
    (set) =>
      set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    setId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedSetId(setId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSetId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: theme.spacing(3),
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Flashcard Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and study your flashcard collections
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />}>
          New Set
        </Button>
      </Box>

      <Card sx={{ mb: theme.spacing(3) }}>
        <CardHeader
          avatar={<SearchIcon />}
          title="Search Flashcards"
          subheader="Find your flashcard sets by title or subject"
        />
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Box sx={{ mb: theme.spacing(3) }}>
        <Typography variant="h6" sx={{ mb: theme.spacing(2) }}>
          Your Collections ({filteredSets.length})
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: theme.spacing(2),
          }}
        >
          {filteredSets.map((set) => (
            <Card
              key={set.id}
              sx={{
                cursor: "pointer",
                "&:hover": { boxShadow: theme.shadows[4] },
              }}
            >
              <CardHeader
                avatar={<LibraryBooksIcon />}
                action={
                  <IconButton onClick={(e) => handleMenuClick(e, set.id)}>
                    <MoreVertIcon />
                  </IconButton>
                }
                title={
                  <Typography variant="subtitle1" fontWeight="medium" noWrap>
                    {set.title}
                  </Typography>
                }
                subheader={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Chip
                      label={set.subject}
                      size="small"
                      icon={<BookIcon />}
                      variant="outlined"
                    />
                    {set.isShared && (
                      <Chip
                        label="Shared"
                        size="small"
                        icon={<PeopleIcon />}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight="bold"
                  >
                    {set.cardCount} cards
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(set.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};
