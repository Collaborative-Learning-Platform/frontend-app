import { Box, Typography, useTheme } from '@mui/material';
import { FlashcardCarousel } from '../components/Flashcard/Flashcard Carousel/FlashcardCarousel';

const sampleCards = [
  {
    id: 1,
    front: 'What is React?',
    back: 'A JavaScript library for building user interfaces, maintained by Meta and a community of developers.',
    category: 'Web Development',
  },
  {
    id: 2,
    front: 'What does API stand for?',
    back: 'Application Programming Interface - a set of protocols and tools for building software applications.',
    category: 'Computer Science',
  },
  {
    id: 3,
    front: 'What is the capital of France?',
    back: 'Paris - the largest city in France and one of the most visited cities in the world.',
    category: 'Geography',
  },
  {
    id: 4,
    front: 'What is photosynthesis?',
    back: 'The process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.',
    category: 'Biology',
  },
  {
    id: 5,
    front: 'Who wrote "Romeo and Juliet"?',
    back: 'William Shakespeare - the famous English playwright and poet from the 16th century.',
    category: 'Literature',
  },
  {
    id: 6,
    front: 'Who wrote "Romeo and Juliet"?',
    back: 'William Shakespeare - the famous English playwright and poet from the 16th century.',
    category: 'Literature',
  },
];

export default function ViewFlashCards() {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ mb: theme.spacing(3), width: '100%' }}>
        <Typography variant="h5" fontWeight="bold">
          Interactive Flashcards
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click to flip, navigate with arrows, and track your progress.
        </Typography>
      </Box>
      {/* Flashcard Carousel */}
      <FlashcardCarousel cards={sampleCards} />
    </>
  );
}
