# Theme System

This folder contains the theme configuration for the application, providing light and dark mode support with Material-UI integration.

## Structure

```
theme/
├── index.ts          # Main exports for the theme system
├── themes.ts         # Theme utilities and types
├── lightTheme.ts     # Light theme configuration
└── darkTheme.ts      # Dark theme configuration
```

## Usage

### Basic Usage with Index File

The `index.ts` file provides a single entry point for all theme-related imports:

```tsx
// Import everything you need from the theme index
import { ThemeProvider, ThemeToggle, useTheme } from '../theme';

function App() {
  return (
    <ThemeProvider>
      <div>
        <ThemeToggle />
        {/* Your app content */}
      </div>
    </ThemeProvider>
  );
}
```

### Multiple Imports from Index

```tsx
// Import multiple items at once
import { 
  ThemeProvider, 
  ThemeToggle, 
  useTheme, 
  getTheme,
  lightTheme,
  darkTheme,
  type ThemeMode 
} from '../theme';

function MyComponent() {
  const { mode, toggleTheme } = useTheme();
  const currentTheme = getTheme(mode);
  
  return (
    <div>
      <ThemeToggle />
      <p>Current mode: {mode}</p>
    </div>
  );
}
```

### Using Theme Context

```tsx
import { useTheme } from '../theme';

function MyComponent() {
  const { mode, toggleTheme, theme } = useTheme();
  
  return (
    <div>
      <p>Current mode: {mode}</p>
      <p>Primary color: {theme.palette.primary.main}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Direct Theme Access

```tsx
import { lightTheme, darkTheme, getTheme } from '../theme';

// Get specific theme
const theme = getTheme('dark');

// Use individual themes
const lightPrimaryColor = lightTheme.palette.primary.main;
const darkPrimaryColor = darkTheme.palette.primary.main;
```

### TypeScript Usage

```tsx
import { type ThemeMode, getTheme } from '../theme';

function themeSwitcher(mode: ThemeMode) {
  const theme = getTheme(mode);
  return theme;
}
```

## Features

- **Persistent Theme**: Theme preference is saved to localStorage
- **Smooth Transitions**: Components include transition animations
- **Material-UI Integration**: Full integration with MUI components
- **TypeScript Support**: Complete type definitions
- **Customizable**: Easy to extend and modify theme properties

## Theme Configuration

Both themes include customizations for:

- **Palette**: Colors for primary, secondary, background, text, etc.
- **Typography**: Font families, sizes, and weights
- **Components**: Custom styles for MUI components
- **Shape**: Border radius and other shape properties

## Components

- **ThemeProvider**: Context provider for theme management
- **ThemeToggle**: Button component to switch between themes
- **ThemeDemo**: Demonstration page showing all theme features
