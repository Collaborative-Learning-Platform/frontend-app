// Theme mode type
export type ThemeMode = 'light' | 'dark';

// Theme exports
export { lightTheme } from './lightTheme';
export { darkTheme } from './darkTheme';

// Function to get theme by mode
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import type { Theme } from '@mui/material/styles';

export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};
