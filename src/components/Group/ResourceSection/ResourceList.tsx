import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  useTheme
} from '@mui/material';
import {
  FolderOpen,
  SearchOff
} from '@mui/icons-material';
import ResourceItem from './ResourceItem';
import type { Resource } from './types';

interface ResourceListProps {
  resources: Resource[];
  onDownload: (resource: Resource) => void;
  onDelete: (resourceId: string) => void;
  loading?: boolean;
  searchTerm?: string;
}

const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  onDownload,
  onDelete,
  loading = false,
  searchTerm = ''
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Loading resources...
        </Typography>
      </Box>
    );
  }

  if (resources.length === 0) {
    const isSearching = searchTerm.trim() !== '';
    
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: theme.palette.background.default,
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        {isSearching ? (
          <>
            <SearchOff 
              sx={{ 
                fontSize: 48, 
                color: theme.palette.text.secondary, 
                mb: 2 
              }} 
            />
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
              No resources found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No resources match your search criteria "{searchTerm}".
              <br />
              Try adjusting your search terms or filters.
            </Typography>
          </>
        ) : (
          <>
            <FolderOpen 
              sx={{ 
                fontSize: 48, 
                color: theme.palette.text.secondary, 
                mb: 2 
              }} 
            />
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
              No resources yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              This workspace doesn't have any resources yet.
              <br />
              Upload files or add links to get started!
            </Typography>
          </>
        )}
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {resources.map((resource) => (
        <ResourceItem
          key={resource.id}
          resource={resource}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
};

export default ResourceList;
