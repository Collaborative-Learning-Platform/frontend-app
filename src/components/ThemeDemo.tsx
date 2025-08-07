import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  Alert,
  LinearProgress,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Palette,
  DarkMode,
  LightMode,
  Info,
  Warning,
  Error,
  CheckCircle,
} from '@mui/icons-material';
import { ThemeToggle, useTheme } from '../theme';

export const ThemeDemo: React.FC = () => {
  const { mode, theme } = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Theme Demonstration
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Current mode: {mode === 'light' ? 'Light' : 'Dark'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <ThemeToggle size="large" />
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
            Click to toggle theme
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Color Palette and Components Row */}
        <Box sx={{ display: { xs: 'flex', md: 'flex' }, flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Palette /> Color Palette
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                    }}
                  />
                  <Typography>Primary: {theme.palette.primary.main}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'secondary.main',
                      borderRadius: 1,
                    }}
                  />
                  <Typography>Secondary: {theme.palette.secondary.main}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  />
                  <Typography>Background: {theme.palette.background.default}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Components
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant="contained">Contained</Button>
                  <Button variant="outlined">Outlined</Button>
                  <Button variant="text">Text</Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Default" />
                  <Chip label="Primary" color="primary" />
                  <Chip label="Secondary" color="secondary" />
                </Box>
                <FormControlLabel control={<Switch defaultChecked />} label="Switch component" />
                <LinearProgress variant="determinate" value={75} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Alerts */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Alert Components
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert icon={<Info />} severity="info">
                This is an info alert in {mode} mode
              </Alert>
              <Alert icon={<CheckCircle />} severity="success">
                Theme switching works perfectly!
              </Alert>
              <Alert icon={<Warning />} severity="warning">
                This is a warning alert
              </Alert>
              <Alert icon={<Error />} severity="error">
                This is an error alert
              </Alert>
            </Box>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Typography Scale
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="h5">Heading 5</Typography>
              <Typography variant="h6">Heading 6</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">
                Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Body 2 (secondary): Sed do eiusmod tempor incididunt ut labore.
              </Typography>
              <Typography variant="caption" display="block">
                Caption text
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Paper Examples */}
        <Box sx={{ display: { xs: 'flex', md: 'flex' }, flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Paper Component
            </Typography>
            <Typography variant="body2">
              This is a Paper component that adapts to the current theme.
              Notice how it changes background color and elevation based on the theme mode.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Elevated Paper
            </Typography>
            <Typography variant="body2">
              This Paper has higher elevation for more prominent visual hierarchy.
            </Typography>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Theme Features
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={mode === 'light' ? <LightMode /> : <DarkMode />}
            label={`${mode} Mode Active`}
            color="primary"
            variant="outlined"
          />
          <Chip label="Persistent Theme" color="secondary" variant="outlined" />
          <Chip label="Smooth Transitions" color="success" variant="outlined" />
          <Chip label="Material-UI Integration" color="info" variant="outlined" />
        </Box>
      </Box>
    </Container>
  );
};
