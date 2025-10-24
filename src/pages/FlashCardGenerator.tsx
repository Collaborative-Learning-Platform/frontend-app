import {
  Box,
  useTheme,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../contexts/Authcontext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { Masonry } from '@mui/lab';

// Define Resource interface based on DTO requirements
interface Resource {
  resourceId: string;
  fileName: string;
  contentType: string;
  description: string;
}

export const FlashCardGenerator = () => {
  const Snackbar = useSnackbar();
  const { user_id } = useAuth();
  const theme = useTheme();
  const numberOfCardsOptions = [
    { value: 5, text: 'Five' },
    { value: 10, text: 'Ten' },
  ];
  const [progress, setProgress] = useState(0);
  const [numberOfCards, SetNumberOfCards] = useState(10);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [flashcardStats, setFlashcardStats] = useState({
    totalSets: 0,
    totalCards: 0,
    thisWeek: 0,
  });
  // Fetch flashcard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user_id) return;
      try {
        const response = await axiosInstance.get('/aiservice/flashcards/stats');
        if (response.data && response.data.success && response.data.data) {
          setFlashcardStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch flashcard stats:', error);
        Snackbar.showSnackbar('Failed to load flashcard stats', 'error');
      }
    };
    fetchStats();
  }, [user_id]);

  const handleChangeCardNumber = (event: SelectChangeEvent) => {
    const newCardNumber = Number(event.target.value);
    SetNumberOfCards(newCardNumber);
  };

  const handleChangeResource = (event: SelectChangeEvent) => {
    const resourceId = event.target.value;
    const resource = filteredResources.find((r) => r.resourceId === resourceId);
    setSelectedResource(resource || null);
  };

  // Check if the file type is supported by Gemini
  const supportedMimeTypes = [
    'application/pdf',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/heic',
    'image/heif',
  ];

  // Filter resources to only show supported MIME types
  const filteredResources = resources.filter((resource) =>
    supportedMimeTypes.includes(resource.contentType)
  );

  // Generate flashcards function
  const handleGenerateFlashcards = async () => {
    if (!selectedResource) return;

    try {
      setProgress(0);
      setGenerating(true);

      const requestData = {
        resourceId: selectedResource.resourceId,
        fileName: selectedResource.fileName,
        contentType: selectedResource.contentType,
        description:
          selectedResource.description ||
          'Educational resource for flashcard generation',
        number: numberOfCards,
      };

      // Simulate progress increments
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90; // Don't go to 100 until done
          const newProgress = prev + Math.random() * 20;
          return Math.min(newProgress, 90); // Cap at 90%
        });
      }, 2300);

      const response = await axiosInstance.post(
        '/aiservice/generate-flashcards',
        requestData,
        {
          timeout: 120000, // 2 minutes specifically for flashcard generation
        }
      );
      clearInterval(interval);
      setProgress(100);

      console.log('Flashcards generated successfully:', response.data);

      // Handle success
      if (response.data.success) {
        Snackbar.showSnackbar(
          'Flashcards generated successfully! Check Flashcard Library!'
        );
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      Snackbar.showSnackbar('Failed to generate flashcards', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // Fetch user groups and their resources
  useEffect(() => {
    const fetchResources = async () => {
      if (!user_id) return;

      try {
        setLoading(true);

        // Get user's groups
        const groupsResponse = await getGroupsByUser(user_id);
        if (groupsResponse.success && groupsResponse.data.length > 0) {
          console.log(groupsResponse.data);
          const groupIds = groupsResponse.data.map(
            (group: any) => group.groupId
          );

          // Get resources for those groups
          const resourcesResponse = await getResourcesByGroupIds(groupIds);
          if (resourcesResponse.success && resourcesResponse.data) {
            console.log(resourcesResponse.data);
            setResources(resourcesResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        Snackbar.showSnackbar('Failed to load resources', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [user_id]);

  async function getGroupsByUser(userId: string) {
    const response = await axiosInstance.post('/workspace/groups/by-user', {
      userId,
    });
    return response.data;
  }

  async function getResourcesByGroupIds(groups: string[]) {
    const response = await axiosInstance.post(
      '/storage/resources/by-group-ids',
      { groups }
    );
    return response.data;
  }

  return (
    <Box>
      <Box sx={{ mb: theme.spacing(3) }}>
        <Typography variant="h5" fontWeight="bold">
          Generate FlashCards
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Transform your study materials into flashcards!
        </Typography>
      </Box>
      <Card sx={{ mt: theme.spacing(3) }}>
        <CardHeader
          avatar={<SettingsSuggestIcon />}
          title="Flashcard Settings"
          subheader="Customize how your flashcards will be generated"
        />
        <Box>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(3),
                alignItems: 'flex-start',
              }}
            >
              {/* Horizontal row for both dropdowns and button */}
              <Box
                sx={{
                  display: 'flex',
                  gap: theme.spacing(3),
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                }}
              >
                {/* Resource dropdown with its own container for mobile alignment */}
                <Box
                  sx={{
                    paddingLeft: theme.spacing(4), // Left padding only
                    order: { xs: 1, sm: 0 }, // First on mobile
                  }}
                >
                  <FormControl
                    sx={{
                      width: 350,
                      maxWidth: 350,
                      minWidth: 350,
                      '& .MuiSelect-select': {
                        overflow: 'hidden !important',
                        textOverflow: 'ellipsis !important',
                        whiteSpace: 'nowrap !important',
                        paddingRight: '40px !important',
                        maxWidth: '310px !important', // Account for padding and arrow space
                      },
                      '& .MuiInputBase-root': {
                        overflow: 'hidden',
                      },
                      '& .MuiInputBase-input': {
                        overflow: 'hidden !important',
                        textOverflow: 'ellipsis !important',
                        whiteSpace: 'nowrap !important',
                      },
                    }}
                  >
                    <Select
                      value={selectedResource?.resourceId || ''}
                      onChange={handleChangeResource}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Resource' }}
                      disabled={loading || filteredResources.length === 0}
                    >
                      <MenuItem value="" disableRipple>
                        {loading
                          ? 'Loading resources...'
                          : filteredResources.length === 0
                          ? 'No supported resources available'
                          : 'Select a resource'}
                      </MenuItem>
                      {filteredResources.map((resource) => (
                        <MenuItem
                          key={resource.resourceId}
                          value={resource.resourceId}
                          disableRipple
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {resource.fileName ||
                            `Resource ${resource.resourceId}`}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Select the resource for flashcard generation
                    </FormHelperText>
                  </FormControl>
                </Box>

                {/* Number of cards dropdown with container for mobile alignment */}
                <Box
                  sx={{
                    paddingLeft: theme.spacing(4), // Match resource dropdown container padding
                    order: { xs: 2, sm: 0 }, // Second on mobile
                  }}
                >
                  <FormControl
                    sx={{
                      width: 200,
                    }}
                  >
                    <Select
                      value={numberOfCards.toString()}
                      onChange={handleChangeCardNumber}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Card Number' }}
                    >
                      {numberOfCardsOptions.map((cardNumber, index) => (
                        <MenuItem
                          key={index}
                          value={cardNumber.value}
                          disableRipple
                        >
                          {cardNumber.text}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Select the number of Cards</FormHelperText>
                  </FormControl>
                </Box>

                {/* Button with container for mobile alignment */}
                <Box
                  sx={{
                    paddingLeft: theme.spacing(4), // Match resource dropdown container padding
                    order: { xs: 3, sm: 0 }, // Third on mobile
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={
                      generating ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <AddIcon />
                      )
                    }
                    disabled={!selectedResource || generating}
                    onClick={handleGenerateFlashcards}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      height: '56px', // Match the height of the select inputs
                      width: { xs: '350px', sm: 'auto' }, // Match resource dropdown width on mobile
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      '&:disabled': {
                        backgroundColor:
                          theme.palette.action.disabledBackground,
                        color: theme.palette.text.disabled,
                      },
                    }}
                  >
                    {generating ? 'Generating...' : 'Generate Flashcards'}
                  </Button>
                  <Box>
                    <Typography>
                      {generating ? (
                        <FormHelperText>
                          This may take some time...
                        </FormHelperText>
                      ) : (
                        <FormHelperText>
                          *Flashcards will be added to Flashcard Library
                        </FormHelperText>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>
      <Box py={3}>
        <Masonry columns={3} spacing={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                {flashcardStats.totalSets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sets
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                {flashcardStats.totalCards}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cards
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                {flashcardStats.thisWeek}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Week
              </Typography>
            </CardContent>
          </Card>
        </Masonry>
      </Box>
      {generating && (
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
            Generating flashcards...
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
          <Typography
            variant="caption"
            sx={{ mt: 1, display: 'block', textAlign: 'right' }}
          >
            {Math.round(progress)}%
          </Typography>
        </Card>
      )}
    </Box>
  );
};
