import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { 
  DarkMode, 
  LightMode 
} from '@mui/icons-material';
import { useTheme } from '../theme';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  variant?: 'default' | 'contained' | 'outlined';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium', 
  showTooltip = true,
  variant = 'default'
}) => {
  const { mode, toggleTheme } = useTheme();

  const getBackgroundSx = () => {
    if (variant === 'contained') {
      return {
        backgroundColor: mode === 'light' ? 'primary.main' : 'secondary.main',
        color: mode === 'light' ? 'primary.contrastText' : 'secondary.contrastText',
        '&:hover': {
          backgroundColor: mode === 'light' ? 'primary.dark' : 'secondary.dark',
        },
      };
    }
    if (variant === 'outlined') {
      return {
        border: '1px solid',
        borderColor: mode === 'light' ? 'primary.main' : 'secondary.main',
        color: mode === 'light' ? 'primary.main' : 'secondary.main',
        '&:hover': {
          backgroundColor: mode === 'light' ? 'primary.light' : 'secondary.light',
          opacity: 0.1,
        },
      };
    }
    return {
      color: mode === 'light' ? 'text.primary' : 'text.primary',
      '&:hover': {
        backgroundColor: 'action.hover',
      },
    };
  };

  const toggleButton = (
    <IconButton
      onClick={toggleTheme}
      size={size}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      sx={{
        transition: 'all 0.3s ease-in-out',
        ...getBackgroundSx(),
        '&:hover': {
          transform: 'scale(1.05)',
          ...getBackgroundSx()['&:hover'],
        },
        '& .MuiSvgIcon-root': {
          fontSize: size === 'small' ? '1.25rem' : size === 'large' ? '1.75rem' : '1.5rem',
        },
      }}
    >
      {mode === 'light' ? (
        <DarkMode />
      ) : (
        <LightMode />
      )}
    </IconButton>
  );

  if (showTooltip) {
    return (
      <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
        {toggleButton}
      </Tooltip>
    );
  }

  return toggleButton;
};
