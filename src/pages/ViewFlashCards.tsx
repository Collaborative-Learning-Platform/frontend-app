import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FlashcardCarousel } from '../components/Flashcard/Flashcard Carousel/FlashcardCarousel';

export default function ViewFlashCards() {
  const theme = useTheme();
  const location = useLocation();
  const { flashcardId } = useParams();

  // Get flashcard data from navigation state
  const [cards, setCards] = useState([]);
  const [flashcardTitle, setFlashcardTitle] = useState(
    'Interactive Flashcards'
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('Location state:', location.state);

      if (location.state?.flashcardSet) {
        const flashcardSet = location.state.flashcardSet;
        console.log('Flashcard set:', flashcardSet);

        setFlashcardTitle(flashcardSet.title || 'Interactive Flashcards');

        // The data structure uses 'flashcardContent' not 'flashcards'
        // and the content has 'front'/'back' not 'question'/'answer'
        const flashcardData =
          flashcardSet.flashcardContent || flashcardSet.flashcards || [];
        console.log('Flashcard data:', flashcardData);

        const transformedCards = flashcardData.map(
          (card: any, index: number) => ({
            id: index + 1,
            front: card.front || card.question,
            back: card.back || card.answer,
            category: flashcardSet.subject || 'Study Material',
          })
        );

        console.log('Transformed cards:', transformedCards);

        if (transformedCards.length === 0) {
          setError('No flashcards found in this set.');
        } else {
          setCards(transformedCards);
        }
      } else {
        setError(
          'No flashcard data found. Please navigate from the flashcard library.'
        );
      }
    } catch (err) {
      setError('Error loading flashcards. Please try again.');
      console.error('Error loading flashcards:', err);
    } finally {
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mb: theme.spacing(3), width: '100%' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: theme.spacing(3), width: '100%' }}>
        <Typography variant="h5" fontWeight="bold">
          {flashcardTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click to flip, navigate with arrows, and track your progress.
        </Typography>
      </Box>
      {/* Flashcard Carousel */}
      <FlashcardCarousel cards={cards} />
    </>
  );
}
