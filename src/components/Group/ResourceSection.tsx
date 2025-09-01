import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import { 
  Folder, 
  InsertDriveFile, 
  PictureAsPdf, 
  VideoLibrary, 
  Link as LinkIcon,
  Download,
  MoreVert,
  Add
} from '@mui/icons-material';

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  size?: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

interface ResourceSectionProps {
  groupId: string;
}

const ResourceSection = ({ groupId }: ResourceSectionProps) => {
  const resources: Resource[] = [
    {
      id: '1',
      name: 'Software Engineering Principles.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'Theekshana Dissanayake',
      uploadedAt: '2 hours ago',
      url: '#'
    },
    {
      id: '2',
      name: 'Agile Development Tutorial',
      type: 'video',
      size: '45.2 MB',
      uploadedBy: 'Kavindi Silva',
      uploadedAt: '1 day ago',
      url: '#'
    },
    {
      id: '3',
      name: 'React Documentation',
      type: 'link',
      uploadedBy: 'Ravindu Perera',
      uploadedAt: '3 days ago',
      url: 'https://reactjs.org/docs'
    },
    {
      id: '4',
      name: 'Project Requirements.docx',
      type: 'document',
      size: '1.8 MB',
      uploadedBy: 'Sachini Fernando',
      uploadedAt: '1 week ago',
      url: '#'
    }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <PictureAsPdf sx={{ color: '#f44336' }} />;
      case 'video': return <VideoLibrary sx={{ color: '#2196f3' }} />;
      case 'link': return <LinkIcon sx={{ color: '#4caf50' }} />;
      case 'document': return <InsertDriveFile sx={{ color: '#ff9800' }} />;
      default: return <InsertDriveFile />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'video': return 'Video';
      case 'link': return 'Link';
      case 'document': return 'Document';
      default: return 'File';
    }
  };

  return (
    <Card id="resource-section">
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          justifyContent: 'space-between', 
          gap: { xs: 2, sm: 0 },
          mb: { xs: 2, sm: 3 } 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: (theme) => theme.palette.accent.resources, 
              mr: 2,
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 }
            }}>
              <Folder sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </Avatar>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: 'text.primary'
                }}
              >
                Resources
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Shared files and materials
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ 
              bgcolor: (theme) => theme.palette.accent.resources,
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 600,
              minWidth: { xs: '100%', sm: 'auto' },
              '&:hover': { 
                bgcolor: '#dc2626',
                transform: 'translateY(-1px)',
                boxShadow: (theme) => `0 8px 25px ${theme.palette.accent.resources}4D`
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Add Resource
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.5, sm: 1 } }}>
          {resources.map((resource, index) => (
            <Box key={resource.id}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                '&:hover': { 
                  bgcolor: 'grey.50',
                  transform: 'translateX(4px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <Box sx={{ mr: { xs: 1.5, sm: 2 } }}>
                  {getResourceIcon(resource.type)}
                </Box>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' }, 
                    gap: { xs: 0.5, sm: 1 }, 
                    mb: 0.5 
                  }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        color: 'text.primary'
                      }}
                    >
                      {resource.name}
                    </Typography>
                    <Chip 
                      label={getResourceTypeLabel(resource.type)} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.75rem', 
                        height: { xs: 18, sm: 20 },
                        borderColor: 'rgba(0,0,0,0.12)'
                      }}
                    />
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' }, 
                    gap: { xs: 0.5, sm: 2 } 
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      By {resource.uploadedBy}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      {resource.uploadedAt}
                    </Typography>
                    {resource.size && (
                      <Typography 
                        variant="caption" 
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {resource.size}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                  <IconButton 
                    size="small" 
                    sx={{ 
                      color: (theme) => theme.palette.accent.whiteboard,
                      '&:hover': {
                        bgcolor: (theme) => `${theme.palette.accent.whiteboard}14`,
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <Download sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </IconButton>
                  <IconButton 
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.04)'
                      }
                    }}
                  >
                    <MoreVert sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </IconButton>
                </Box>
              </Box>
              {index < resources.length - 1 && <Divider sx={{ mx: 2 }} />}
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            sx={{ 
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              borderColor: (theme) => theme.palette.accent.resources,
              color: (theme) => theme.palette.accent.resources,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 600,
              '&:hover': {
                borderColor: '#dc2626',
                bgcolor: (theme) => `${theme.palette.accent.resources}0A`,
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            View All Resources
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResourceSection;