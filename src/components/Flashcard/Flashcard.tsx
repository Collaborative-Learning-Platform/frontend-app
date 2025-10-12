import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material';

interface FlashcardProps {
  front: string;
  back: string;
  category?: string;
}

export function Flashcard({ front, back, category }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = useTheme();

  return (
    <Box
      sx={{
        perspective: '1000px',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        onClick={() => setIsFlipped(!isFlipped)}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          cursor: 'pointer',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <Card
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            border: '2px solid',
            borderColor: 'divider',
            transition: 'border-color 0.3s',
            '&:hover': {
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          {category && (
            <Chip
              label={category.toUpperCase()}
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                fontFamily: 'monospace',
                letterSpacing: 1,
                backgroundColor: theme.palette.action.hover,
              }}
            />
          )}
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography
              variant="h5"
              component="p"
              sx={{ fontWeight: 600, lineHeight: 1.5 }}
            >
              {front}
            </Typography>
          </CardContent>

          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: theme.palette.text.secondary,
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Click to flip</span>
          </Box>
        </Card>

        {/* Back */}
        <Card
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            border: '2px solid',
            borderColor: 'primary.main',
          }}
        >
          {category && (
            <Chip
              label={category.toUpperCase()}
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                fontFamily: 'monospace',
                letterSpacing: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'inherit',
              }}
            />
          )}
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="p" sx={{ lineHeight: 1.5 }}>
              {back}
            </Typography>
          </CardContent>

          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Click to flip</span>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
