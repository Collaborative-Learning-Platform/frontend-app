import {
  Box,
  useTheme,
  Typography,
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Alert,
  AlertTitle,
  CircularProgress,
  alpha,
  LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookIcon from '@mui/icons-material/Book';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/Authcontext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

interface FlashcardContent {
  id: number;
  front: string;
  back: string;
}

interface FlashcardSet {
  flashcardId: string;
  title: string;
  subject: string;
  cardCount: number;
  flashcardContent: FlashcardContent[];
  resourceId: string;
  createdAt: string;
}

export const FlashCardLibrary = () => {
  const { user_id } = useAuth();
  const snackbar = useSnackbar();
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch flashcards from the API
  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user_id) return;

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching flashcards for user:', user_id);

        const response = await axiosInstance.get('/aiservice/flashcards');

        console.log('Flashcards API response:', response.data);

        if (response.data.success) {
          setFlashcardSets(response.data.data || []);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setError('Failed to load flashcards. Check your connection.');
        snackbar.showSnackbar('Failed to load flashcards', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user_id]);

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

  const getSelectedSet = () => {
    if (!selectedSetId) return null;
    return flashcardSets.find((set) => set.flashcardId === selectedSetId);
  };

  // Navigate to view flashcards page
  const handleCardClick = (flashcardSet: FlashcardSet) => {
    navigate(`/flashcard/view/${flashcardSet.flashcardId}`, {
      state: { flashcardSet },
    });
  };

  const handleDeleteSet = async () => {
    handleMenuClose();
    if (!selectedSetId) return;
    const selectedSet = getSelectedSet();
    if (selectedSet) {
      try {
        setDeleting(true);
        const response = await axiosInstance.delete(
          `/aiservice/flashcards/${selectedSetId}`
        );

        if (response.data.success) {
          // Remove the deleted flashcard from the local state
          setFlashcardSets((prevSets) =>
            prevSets.filter((set) => set.flashcardId !== selectedSetId)
          );
          console.log('Flashcard set deleted successfully');
          snackbar.showSnackbar(
            'Flashcard set deleted successfully',
            'success'
          );
          setDeleting(false);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error deleting flashcard set:', error);
        snackbar.showSnackbar('Failed to delete flashcard set', 'error');
      } finally {
        setDeleting(false);
      }
    }
  };

  // Date formatting removed as per request

  return (
    <>
      <Box sx={{ mb: theme.spacing(3), width: '100%' }}>
        <Typography variant="h5" fontWeight="bold">
          Flashcard Library
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and study your flashcard collections
        </Typography>
      </Box>

      <Card sx={{ mb: theme.spacing(3) }}>
        <CardHeader
          avatar={<SearchIcon color="primary" />}
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
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {loading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: theme.spacing(4),
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Loading your flashcards...
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box
          sx={{
            py: theme.spacing(4),
            mx: 'auto',
          }}
        >
          <Alert severity="error">
            <AlertTitle align="left">Error</AlertTitle>
            {error}
          </Alert>
        </Box>
      )}

      {/* No flashcards found */}
      {!loading && !error && flashcardSets.length === 0 && (
        <Box sx={{ textAlign: 'center', py: theme.spacing(4) }}>
          <Typography variant="body1" color="text.secondary">
            No flashcards found. Create your first flashcard set to get started!
          </Typography>
        </Box>
      )}

      {/* Results */}
      {!loading && !error && flashcardSets.length > 0 && (
        <Box sx={{ mb: theme.spacing(3) }}>
          <Typography variant="h6" sx={{ mb: theme.spacing(2) }}>
            Your Collections ({filteredSets.length})
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: theme.spacing(2),
            }}
          >
            {filteredSets.map((set) => (
              <Card
                key={set.flashcardId}
                onClick={() => handleCardClick(set)}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.primary.main, 0.15)
                        : alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-4px)',
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardHeader
                  avatar={<LibraryBooksIcon fontSize="small" color="primary" />}
                  action={
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when clicking menu
                        handleMenuClick(e, set.flashcardId);
                      }}
                      sx={{ p: 0.5 }}
                      size="small"
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  }
                  title={
                    <Tooltip title={set.title}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          pr: 1, // Add right padding to prevent overlap with action button
                        }}
                      >
                        {set.title}
                      </Typography>
                    </Tooltip>
                  }
                  subheader={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Subject chip moved to card content */}
                    </Box>
                  }
                  sx={{
                    pb: 1, // Slightly increased bottom padding of header
                    pt: 2, // More padding to the top for better spacing
                    px: 2, // Consistent horizontal padding
                    '& .MuiCardHeader-content': {
                      overflow: 'hidden',
                      minWidth: 0, // Allow content to shrink
                    },
                    '& .MuiCardHeader-avatar': {
                      marginRight: 1.5, // Less space for the icon
                    },
                  }}
                />
                <CardContent
                  sx={{
                    pt: 1.5,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                      py: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary.main"
                        fontWeight="bold"
                        sx={{ flexShrink: 0, fontSize: '1.1rem' }}
                      >
                        {set.cardCount}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flexShrink: 0 }}
                      >
                        cards
                      </Typography>
                    </Box>
                    <Tooltip title={set.subject}>
                      <Chip
                        label={set.subject}
                        size="small"
                        icon={<BookIcon fontSize="small" />}
                        variant="outlined"
                        sx={{
                          maxWidth: '150px',
                          height: 24,
                          '& .MuiChip-label': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '0.75rem',
                            px: 0.5,
                          },
                          '& .MuiChip-icon': {
                            fontSize: '0.875rem',
                            ml: 0.5,
                          },
                        }}
                      />
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {/* <MenuItem onClick={handleEditSet}>Edit</MenuItem> */}
        <MenuItem
          onClick={handleDeleteSet}
          sx={{ color: 'error.main' }}
          disableRipple
        >
          Delete
        </MenuItem>
      </Menu>
      {deleting && (
        <Card
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 250,
            p: 2,
            boxShadow: 3,
            zIndex: 1000,
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
            Deleting flashcard set...
          </Typography>
          <LinearProgress color="error" />
        </Card>
      )}
    </>
  );
};
