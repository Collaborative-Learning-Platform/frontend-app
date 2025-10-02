import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  useTheme
} from '@mui/material';
import {
  FolderOpen,
  SearchOff,
  CloudUpload,
  Add
} from '@mui/icons-material';

interface ResourceEmptyStateProps {
  isSearching?: boolean;
  searchTerm?: string;
  onAddResource?: () => void;
  onClearFilters?: () => void;
}

const ResourceEmptyState: React.FC<ResourceEmptyStateProps> = ({
  isSearching = false,
  searchTerm = '',
  onAddResource,
  onClearFilters
}) => {
  const theme = useTheme();

  if (isSearching) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: theme.palette.background.default,
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <SearchOff 
          sx={{ 
            fontSize: 64, 
            color: theme.palette.text.secondary, 
            mb: 2 
          }} 
        />
        <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
          No resources found
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          No resources match your search criteria "{searchTerm}".
          <br />
          Try adjusting your search terms or filters.
        </Typography>
        {onClearFilters && (
          <Button
            variant="outlined"
            onClick={onClearFilters}
            sx={{ mr: 2 }}
          >
            Clear Filters
          </Button>
        )}
        {onAddResource && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddResource}
          >
            Add Resource
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        bgcolor: theme.palette.background.default,
        border: `1px dashed ${theme.palette.divider}`,
        borderRadius: 2
      }}
    >
      <FolderOpen 
        sx={{ 
          fontSize: 64, 
          color: theme.palette.text.secondary, 
          mb: 2 
        }} 
      />
      <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
        No resources yet
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
        This workspace doesn't have any resources yet.
        <br />
        Start by uploading files or adding links to share with your team!
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {onAddResource && (
          <Button
            variant="contained"
            size="large"
            startIcon={<CloudUpload />}
            onClick={onAddResource}
            sx={{ px: 4 }}
          >
            Upload Your First Resource
          </Button>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2,
          mt: 2 
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              📄 Upload documents, PDFs, and files
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              🎥 Share videos and presentations  
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              🔗 Add useful links and references
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ResourceEmptyState;
