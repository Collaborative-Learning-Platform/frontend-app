'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  //   Button,
  Typography,
  IconButton,
  useTheme,
  Stack,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Flashcard } from '../Flashcard';

interface FlashcardData {
  id: number;
  front: string;
  back: string;
  category?: string;
}

interface FlashcardCarouselProps {
  cards: FlashcardData[];
}

export function FlashcardCarousel({ cards }: FlashcardCarouselProps) {
  //   const cards = [
  //     {
  //       id: 1,
  //       front: 'What is the capital of France?',
  //       back: 'Paris 🇫🇷',
  //       category: 'Geography',
  //     },
  //     {
  //       id: 2,
  //       front: 'Who developed the theory of relativity?',
  //       back: 'Albert Einstein 🧠',
  //       category: 'Science',
  //     },
  //     {
  //       id: 3,
  //       front: 'What is 7 × 8?',
  //       back: '56 ➕',
  //       category: 'Math',
  //     },
  //     {
  //       id: 4,
  //       front: 'Which language runs in a web browser?',
  //       back: 'JavaScript 🌐',
  //       category: 'Programming',
  //     },
  //     {
  //       id: 5,
  //       front: 'Who painted the Mona Lisa?',
  //       back: 'Leonardo da Vinci 🎨',
  //       category: 'Art',
  //     },
  //   ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % cards.length);
  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  const goToCard = (index: number) => setCurrentIndex(index);

  // Optional: keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length]);

  if (cards.length === 0) {
    return (
      <Box
        sx={{
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
        }}
      >
        No flashcards available
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* Card Display */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 400, md: 500 },
        }}
      >
        <Flashcard
          key={cards[currentIndex].id}
          front={cards[currentIndex].front}
          back={cards[currentIndex].back}
          category={cards[currentIndex].category}
        />
      </Box>

      {/* Navigation Controls */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <IconButton
          onClick={goToPrevious}
          disabled={cards.length <= 1}
          sx={{
            width: 56,
            height: 56,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Progress Indicator */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              color: 'text.secondary',
            }}
          >
            {currentIndex + 1} / {cards.length}
          </Typography>

          <Stack direction="row" spacing={1}>
            {cards.map((_, index) => (
              <Box
                key={index}
                onClick={() => goToCard(index)}
                sx={{
                  width: index === currentIndex ? 24 : 8,
                  height: 8,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor:
                    index === currentIndex
                      ? theme.palette.primary.main
                      : theme.palette.action.hover,
                  '&:hover': {
                    backgroundColor:
                      index === currentIndex
                        ? theme.palette.primary.main
                        : theme.palette.action.selected,
                  },
                }}
              />
            ))}
          </Stack>
        </Stack>

        <IconButton
          onClick={goToNext}
          disabled={cards.length <= 1}
          sx={{
            width: 56,
            height: 56,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Stack>

      {/* Keyboard Hint */}
      <Typography
        variant="body2"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        Use arrow keys to navigate • Click card to flip
      </Typography>
    </Box>
  );
}
