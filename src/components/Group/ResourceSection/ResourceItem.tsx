import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import {
  PictureAsPdf,
  VideoLibrary,
  Link as LinkIcon,
  InsertDriveFile,
  Download,
  MoreVert,
  Delete as DeleteIcon,
  AccessTime
} from '@mui/icons-material';
import type { Resource } from './types';
import { formatRelativeTime, formatCompletionTime } from './utils';

interface ResourceItemProps {
  resource: Resource;
  onDownload: (resource: Resource) => void;
  onDelete: (resourceId: string) => void;
}

const ResourceItem: React.FC<ResourceItemProps> = ({
  resource,
  onDownload,
  onDelete
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf': return <PictureAsPdf sx={{ color: theme.palette.error.main }} />;
      case 'video': return <VideoLibrary sx={{ color: theme.palette.secondary.main }} />;
      case 'link': return <LinkIcon sx={{ color: theme.palette.info.main }} />;
      case 'image': return <InsertDriveFile sx={{ color: theme.palette.success.main }} />;
      case 'document': return <InsertDriveFile sx={{ color: theme.palette.primary.main }} />;
      case 'executable': return <InsertDriveFile sx={{ color: theme.palette.warning.main }} />;
      default: return <InsertDriveFile sx={{ color: theme.palette.grey[600] }} />;
    }
  };

  const getResourceTypeLabel = (type: Resource['type']) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'video': return 'Video';
      case 'link': return 'Link';
      case 'image': return 'Image';
      case 'document': return 'Document';
      case 'executable': return 'Executable';
      default: return 'File';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = () => {
    onDownload(resource);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(resource.id);
    handleMenuClose();
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderRadius: 2,
          bgcolor: theme.palette.background.default,
          '&:hover': { boxShadow: theme.shadows[6], transform: 'translateX(4px)' },
          transition: 'all 0.3s ease'
        }}
      >
        <Avatar sx={{ bgcolor: 'transparent', mr: 2 }}>
          {getResourceIcon(resource.type)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {resource.name || resource.fileName}
            </Typography>
            <Chip 
              label={getResourceTypeLabel(resource.type)} 
              size="small" 
              variant="outlined" 
              sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main }} 
            />
          </Box>
          
          {/* Description */}
          {resource.description && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {resource.description}
            </Typography>
          )}
          
          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
              {resource.tags.slice(0, 3).map((tag, tagIdx) => (
                <Chip
                  key={tagIdx}
                  label={tag}
                  size="small"
                  variant="filled"
                  sx={{ 
                    bgcolor: `${theme.palette.primary.main}15`,
                    color: theme.palette.primary.main,
                    fontSize: '0.65rem',
                    height: 20
                  }}
                />
              ))}
              {resource.tags.length > 3 && (
                <Chip
                  label={`+${resource.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.65rem',
                    height: 20,
                    borderColor: theme.palette.grey[400],
                    color: theme.palette.text.secondary
                  }}
                />
              )}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              By {resource.uploadedBy}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formatRelativeTime(resource.uploadedAt)}
            </Typography>
            {resource.size && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {resource.size}
              </Typography>
            )}
            {resource.estimatedCompletionTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatCompletionTime(resource.estimatedCompletionTime)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            sx={{ color: theme.palette.primary.main }}
            onClick={() => onDownload(resource)}
          >
            <Download />
          </IconButton>
          <IconButton 
            sx={{ color: 'text.secondary' }}
            onClick={handleMenuOpen}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <Download />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={handleDelete}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ResourceItem;
