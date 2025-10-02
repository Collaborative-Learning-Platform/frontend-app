import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add,
  Refresh
} from '@mui/icons-material';

interface ResourceHeaderProps {
  onAddResource: () => void;
  onRefresh: () => void;
  loading?: boolean;
  resourceCount?: number;
}

const ResourceHeader: React.FC<ResourceHeaderProps> = ({
  onAddResource,
  onRefresh,
  loading = false,
  resourceCount = 0
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 3 
    }}>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          Resources
        </Typography>
        {resourceCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            {resourceCount} resource{resourceCount !== 1 ? 's' : ''} available
          </Typography>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Refresh resources">
          <IconButton 
            onClick={onRefresh}
            disabled={loading}
            size="small"
          >
            <Refresh />
          </IconButton>
        </Tooltip>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddResource}
          size="small"
        >
          Add Resource
        </Button>
      </Box>
    </Box>
  );
};

export default ResourceHeader;
