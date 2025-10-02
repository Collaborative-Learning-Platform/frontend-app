import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  useTheme
} from '@mui/material';
import {
  PictureAsPdf,
  VideoLibrary,
  Link as LinkIcon,
  InsertDriveFile,
  Image as ImageIcon,
  Apps
} from '@mui/icons-material';
import type { Resource } from './types';

interface ResourceStatsProps {
  resources: Resource[];
}

const ResourceStats: React.FC<ResourceStatsProps> = ({ resources }) => {
  const theme = useTheme();

  // Calculate statistics
  const stats = React.useMemo(() => {
    const typeCount = resources.reduce((acc, resource) => {
      acc[resource.type] = (acc[resource.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalSize = resources.reduce((acc, resource) => {
      if (resource.size && resource.size !== 'Unknown') {
        // Parse size string and convert to bytes for calculation
        const sizeMatch = resource.size.match(/^([\d.]+)\s*(.*)/);
        if (sizeMatch) {
          const [, value, unit] = sizeMatch;
          const numValue = parseFloat(value);
          const multipliers: Record<string, number> = {
            'Bytes': 1,
            'KB': 1024,
            'MB': 1024 * 1024,
            'GB': 1024 * 1024 * 1024
          };
          acc += numValue * (multipliers[unit] || 1);
        }
      }
      return acc;
    }, 0);

    return {
      total: resources.length,
      typeCount,
      totalSize,
      withTags: resources.filter(r => r.tags && r.tags.length > 0).length,
      withEstimatedTime: resources.filter(r => r.estimatedCompletionTime).length
    };
  }, [resources]);

  const formatTotalSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <PictureAsPdf sx={{ color: theme.palette.error.main }} />;
      case 'video': return <VideoLibrary sx={{ color: theme.palette.secondary.main }} />;
      case 'link': return <LinkIcon sx={{ color: theme.palette.info.main }} />;
      case 'image': return <ImageIcon sx={{ color: theme.palette.success.main }} />;
      case 'document': return <InsertDriveFile sx={{ color: theme.palette.primary.main }} />;
      case 'executable': return <Apps sx={{ color: theme.palette.warning.main }} />;
      default: return <InsertDriveFile sx={{ color: theme.palette.grey[600] }} />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pdf: 'PDFs',
      video: 'Videos',
      link: 'Links',
      image: 'Images',
      document: 'Documents',
      executable: 'Executables',
      other: 'Other'
    };
    return labels[type] || 'Unknown';
  };

  if (resources.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
      <Typography variant="h6" gutterBottom>
        Resource Overview
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Total Resources */}
        <Box sx={{ flex: '1 1 200px', textAlign: 'center', minWidth: 150 }}>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Resources
          </Typography>
        </Box>

        {/* Total Size */}
        <Box sx={{ flex: '1 1 200px', textAlign: 'center', minWidth: 150 }}>
          <Typography variant="h4" color="secondary.main" fontWeight="bold">
            {formatTotalSize(stats.totalSize)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Size
          </Typography>
        </Box>

        {/* Tagged Resources */}
        <Box sx={{ flex: '1 1 200px', textAlign: 'center', minWidth: 150 }}>
          <Typography variant="h4" color="success.main" fontWeight="bold">
            {stats.withTags}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tagged Resources
          </Typography>
        </Box>

        {/* Timed Resources */}
        <Box sx={{ flex: '1 1 200px', textAlign: 'center', minWidth: 150 }}>
          <Typography variant="h4" color="info.main" fontWeight="bold">
            {stats.withEstimatedTime}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            With Est. Time
          </Typography>
        </Box>
      </Box>

      {/* Type Breakdown */}
      {Object.keys(stats.typeCount).length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            By Type:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(stats.typeCount).map(([type, count]) => (
              <Chip
                key={type}
                icon={getTypeIcon(type)}
                label={`${count} ${getTypeLabel(type)}`}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ResourceStats;
