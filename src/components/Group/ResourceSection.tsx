import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Avatar,
  Divider,
  Chip,
  Stack,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Autocomplete
} from '@mui/material';
import { 
  Folder, 
  InsertDriveFile, 
  PictureAsPdf, 
  VideoLibrary, 
  Link as LinkIcon,
  Download,
  MoreVert,
  Add,
  CloudUpload,
  Delete as DeleteIcon,
  Refresh,
  Search,
  FilterList,
  Clear,
  AccessTime
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../contexts/Authcontext';
import { useSnackbar } from '../../contexts/SnackbarContext';

interface ApiResource {
  resourceId: string;
  groupId: string;
  userId: string;
  fileName: string;
  s3Key: string;
  description: string;
  contentType: string;
  size: number | null;
  createdAt: string;
  estimatedCompletionTime?: number; // in minutes
  tags: Array<{
    tagId: string;
    tag: string;
    resourceId: string;
  }>;
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'document' | 'image' | 'other' | 'executable';
  size?: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
  fileName: string;
  contentType: string;
  description?: string;
  tags?: string[];
  estimatedCompletionTime?: number; // in minutes
}

interface ResourceSectionProps {
  groupId: string;
}

const ResourceSection = ({ groupId }: ResourceSectionProps) => {
  const theme = useTheme();
  const { user_id } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  // New state for upload form
  const [resourceDescription, setResourceDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState<number | ''>('');
  const [completionTimeUnit, setCompletionTimeUnit] = useState<'minutes' | 'hours'>('minutes');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'type'>('date');
  
  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  // Predefined tags for resources
  const availableTags = [
    'Study Material',
    'Assignment',
    'Tutorial',
    'Reference',
    'Video Lecture',
    'Notes',
    'Presentation',
    'Project',
    'Research',
    'Documentation',
    'Code',
    'Images',
    'Important',
    'Draft',
    'Final',
    'Exam Prep',
    'Homework',
    'Lab Report',
    'Textbook',
    'Article',
    'Sample Code',
    'Template',
    'Guidelines',
    'Requirements',
    'Solution'
  ];

  // Transform API resource to our Resource interface
  const transformApiResource = (apiResource: ApiResource): Resource => {
    const getResourceType = (contentType: string, fileName: string): Resource['type'] => {
      if (contentType.includes('pdf')) return 'pdf';
      if (contentType.startsWith('video/')) return 'video';
      if (contentType.startsWith('image/')) return 'image';
      if (contentType.includes('text/') || fileName.endsWith('.txt') || fileName.endsWith('.md')) return 'document';
      if (contentType.includes('application/vnd.') || fileName.endsWith('.docx') || fileName.endsWith('.doc') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) return 'document';
      if (contentType.includes('application/x-msdownload') || fileName.endsWith('.exe')) return 'executable';
      return 'other';
    };

    const formatFileSize = (bytes: number | null) => {
      if (!bytes) return undefined;
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return {
      id: apiResource.resourceId,
      name: apiResource.fileName,
      fileName: apiResource.fileName,
      type: getResourceType(apiResource.contentType, apiResource.fileName),
      size: formatFileSize(apiResource.size),
      uploadedBy: `User (${apiResource.userId.slice(0, 8)}...)`, // Show partial user ID for now
      uploadedAt: apiResource.createdAt,
      contentType: apiResource.contentType,
      description: apiResource.description,
      tags: apiResource.tags.map(tag => tag.tag),
      estimatedCompletionTime: apiResource.estimatedCompletionTime,
    };
  };

  // Fetch resources from API
  const fetchResources = useCallback(async () => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/storage/list-group-resources/${groupId}`);
      if (response.data.success) {
        console.log('Fetched resources:', response.data);
        const transformedResources = response.data.data.map(transformApiResource);
        setResources(transformedResources);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      showSnackbar('Failed to load resources', 'error');
    } finally {
      setLoading(false);
    }
  }, [groupId, showSnackbar]);

  useEffect(() => {
    fetchResources();
  }, [groupId]);

  // Filter and sort resources
  const filteredAndSortedResources = React.useMemo(() => {
    let filtered = resources.filter(resource => {
      // Search query filter
      const matchesSearch = !searchQuery || 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Tags filter
      const matchesTags = filterTags.length === 0 || 
        filterTags.some(filterTag => resource.tags?.includes(filterTag));

      return matchesSearch && matchesTags;
    });

    // Sort resources
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });

    return filtered;
  }, [resources, searchQuery, filterTags, sortBy]);

  // Get all unique tags from resources
  const allAvailableTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    resources.forEach(resource => {
      resource.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [resources]);

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

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Format completion time
  const formatCompletionTime = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle closing upload dialog and reset form
  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setResourceDescription('');
    setSelectedTags([]);
    setEstimatedCompletionTime('');
    setCompletionTimeUnit('minutes');
    setUploadProgress(0);
  };

  // Handle drag and drop
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile || !user_id) {
      showSnackbar('Please select a file and ensure you are logged in', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Calculate estimated completion time in minutes
      const completionTimeInMinutes = estimatedCompletionTime 
        ? (completionTimeUnit === 'hours' 
            ? (estimatedCompletionTime as number) * 60 
            : (estimatedCompletionTime as number))
        : undefined;

      // Request pre-signed URL from backend
      const uploadResponse = await axiosInstance.post('/storage/generate-upload-url', {
        groupId,
        userId: user_id,
        fileName: selectedFile.name,
        contentType: selectedFile.type,
        fileSize: selectedFile.size,
        description: resourceDescription,
        tags: selectedTags.length > 0 ? selectedTags : ['resource'],
        estimatedCompletionTime: completionTimeInMinutes,
      });

      const { uploadUrl } = uploadResponse.data;

      // Upload file directly to S3
      await axiosInstance.put(uploadUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type,
        },
        timeout: 600000, 
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      showSnackbar('File uploaded successfully!', 'success');
      handleCloseUploadDialog();
      
      // Refresh resources list
      fetchResources();

    } catch (error) {
      console.error('Upload error:', error);
      showSnackbar('Failed to upload file', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Handle file download
  const handleDownload = async (resource: Resource) => {
    try {
      const response = await axiosInstance.post('/storage/generate-download-url', {
        resourceId: resource.id,
      });

      const downloadUrl = response.data.downloadUrl;
      
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = resource.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar('Download started', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showSnackbar('Failed to download file', 'error');
    }
  };

  // Handle resource deletion with confirmation
  const handleDeleteClick = (resource: Resource) => {
    setResourceToDelete(resource);
    setDeleteConfirmOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteConfirm = async () => {
    if (!resourceToDelete) return;
    
    try {
      await axiosInstance.delete(`/storage/delete-resource/${resourceToDelete.id}`);
      showSnackbar('Resource deleted successfully', 'success');
      fetchResources();
    } catch (error) {
      console.error('Delete error:', error);
      showSnackbar('Failed to delete resource', 'error');
    }
    setDeleteConfirmOpen(false);
    setResourceToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setResourceToDelete(null);
  };

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, resource: Resource) => {
    setAnchorEl(event.currentTarget);
    setSelectedResource(resource);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedResource(null);
  };

  return (
    <>
      <Card id="resource-section" sx={{ borderRadius: 3, boxShadow: theme.shadows[4], mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
                <Folder sx={{ fontSize: 24 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Resources
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {(searchQuery || filterTags.length > 0) 
                    ? `${filteredAndSortedResources.length} of ${resources.length} resources` 
                    : `${resources.length} shared files and materials`
                  }
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {(searchQuery || filterTags.length > 0) && (
                <IconButton
                  onClick={() => {
                    setSearchQuery('');
                    setFilterTags([]);
                  }}
                  sx={{ color: theme.palette.warning.main }}
                  title="Clear all filters"
                >
                  <Clear />
                </IconButton>
              )}
              <IconButton
                onClick={fetchResources}
                disabled={loading}
                sx={{ color: theme.palette.primary.main }}
              >
                <Refresh />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setUploadDialogOpen(true)}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  '&:hover': { bgcolor: theme.palette.primary.dark, transform: 'translateY(-1px)' },
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  minWidth: { xs: '100%', sm: 'auto' },
                  transition: 'all 0.3s ease'
                }}
              >
                Add Resource
              </Button>
            </Box>
          </Box>

          {/* Search and Filter Controls */}
          {!loading && resources.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Stack spacing={2}>
                {/* Search Bar */}
                <TextField
                  fullWidth
                  placeholder="Search resources by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    endAdornment: searchQuery && (
                      <IconButton 
                        size="small" 
                        onClick={() => setSearchQuery('')}
                        sx={{ color: 'text.secondary' }}
                      >
                        <Clear />
                      </IconButton>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                />

                {/* Filter and Sort Row */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Filter by Tags */}
                  <Box sx={{ minWidth: 200, flex: 1 }}>
                    <Autocomplete
                      multiple
                      size="small"
                      options={allAvailableTags}
                      value={filterTags}
                      onChange={(_, newValue) => setFilterTags(newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option}
                            label={option}
                            size="small"
                            color="primary"
                            variant="filled"
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={filterTags.length === 0 ? "Filter by tags..." : ""}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <FilterList sx={{ mr: 1, color: 'text.secondary' }} />
                            ),
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Sort Dropdown */}
                  <TextField
                    select
                    size="small"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'type')}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="date">Sort by Date</MenuItem>
                    <MenuItem value="name">Sort by Name</MenuItem>
                    <MenuItem value="type">Sort by Type</MenuItem>
                  </TextField>

                  {/* Results Count */}
                  {(searchQuery || filterTags.length > 0) && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                      {filteredAndSortedResources.length} of {resources.length} resources
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          )}

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Empty State */}
          {!loading && resources.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Folder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                No resources yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Upload files to share with your group members
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload First Resource
              </Button>
            </Box>
          )}

          {/* No results found state */}
          {!loading && resources.length > 0 && filteredAndSortedResources.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                No resources found
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchQuery('');
                  setFilterTags([]);
                }}
              >
                Clear Filters
              </Button>
            </Box>
          )}

          {/* Resource List */}
          {!loading && filteredAndSortedResources.length > 0 && (
            <Stack spacing={1}>
              {filteredAndSortedResources.map((resource, idx) => (
                <Box key={resource.id}>
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
                        onClick={() => handleDownload(resource)}
                      >
                        <Download />
                      </IconButton>
                      <IconButton 
                        sx={{ color: 'text.secondary' }}
                        onClick={(e) => handleMenuOpen(e, resource)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </Box>
                  {idx < resources.length - 1 && <Divider />}
                </Box>
              ))}
            </Stack>
          )}

          {/* Footer */}
          {!loading && filteredAndSortedResources.length > 5 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Showing {filteredAndSortedResources.length} 
                {searchQuery || filterTags.length > 0 ? ` of ${resources.length}` : ''} resources
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => !uploading && handleCloseUploadDialog()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUpload />
            Upload Resource
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* File Upload Area */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Select File
              </Typography>
              <label htmlFor="file-upload">
                <Box
                  sx={{
                    border: `2px dashed`,
                    borderColor: isDragOver 
                      ? theme.palette.primary.main 
                      : selectedFile 
                        ? theme.palette.success.main 
                        : theme.palette.grey[300],
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: selectedFile ? 'default' : 'pointer',
                    bgcolor: isDragOver ? `${theme.palette.primary.main}08` : 'transparent',
                    transition: 'all 0.3s ease',
                    ...(!selectedFile && {
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: `${theme.palette.primary.main}04`
                      }
                    })
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <InsertDriveFile sx={{ color: theme.palette.success.main }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedFile.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {formatFileSize(selectedFile.size)}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton 
                        onClick={() => setSelectedFile(null)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Drop files here or click to browse
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Supports all file types (max 50MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </label>
              
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                style={{ ...visuallyHidden }}
              />
            </Box>

            {/* Description Field */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Description (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a description for this resource..."
                value={resourceDescription}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setResourceDescription(e.target.value);
                  }
                }}
                disabled={uploading}
                variant="outlined"
                helperText={`${resourceDescription.length}/500 characters`}
              />
            </Box>

            {/* Tags Selection */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Tags (Optional)
              </Typography>
              <Autocomplete
                multiple
                options={availableTags}
                value={selectedTags}
                onChange={(_, newValue) => {
                  if (newValue.length <= 5) {
                    setSelectedTags(newValue);
                  }
                }}
                disabled={uploading}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={selectedTags.length >= 5 ? "Maximum 5 tags reached" : "Select or type tags..."}
                    variant="outlined"
                  />
                )}
                freeSolo
                filterSelectedOptions
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                Select from suggestions or type your own tags (max 5)
              </Typography>
            </Box>

            {/* Estimated Completion Time */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Estimated Completion Time (Optional)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  type="number"
                  placeholder="e.g., 30"
                  value={estimatedCompletionTime}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEstimatedCompletionTime(value === '' ? '' : Number(value));
                  }}
                  disabled={uploading}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                  inputProps={{ min: 1, max: 999 }}
                />
                <TextField
                  select
                  value={completionTimeUnit}
                  onChange={(e) => setCompletionTimeUnit(e.target.value as 'minutes' | 'hours')}
                  disabled={uploading}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 100 }}
                >
                  <MenuItem value="minutes">Minutes</MenuItem>
                  <MenuItem value="hours">Hours</MenuItem>
                </TextField>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                How long would it take someone to complete/study this resource?
              </Typography>
            </Box>

            {/* Upload Progress */}
            {uploading && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Uploading...</Typography>
                  <Typography variant="body2">{uploadProgress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseUploadDialog}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedResource && handleDownload(selectedResource)}>
          <ListItemIcon>
            <Download />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => selectedResource && handleDeleteClick(selectedResource)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{resourceToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResourceSection;
