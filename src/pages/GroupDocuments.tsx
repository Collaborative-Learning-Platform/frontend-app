import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  useTheme,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  List,
  Alert,
  AlertTitle,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Description as FileTextIcon,
  Add as PlusIcon,
  Search as SearchIcon,
  GridView as Grid3X3Icon,
  ViewList as ListIcon,
  People as UsersIcon,
  MoreHoriz as MoreHorizontalIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/Authcontext';
import axiosInstance from '../api/axiosInstance';
import { useSnackbar } from '../contexts/SnackbarContext';
import { GroupData } from './GroupPage';

// Interface for document response from API
interface DocumentResponse {
  documentId: string;
  name: string;
  title: string;
  groupId: string;
  createdBy: string;
  lastEdited: string;
  contributorIds: string[];
  sizeInBytes: number;
}
// Define the props interface with required properties
type GroupDocumentsProps = GroupData & {
  id: string;
};

export const GroupDocuments = (props: GroupDocumentsProps) => {
  const snackBar = useSnackbar();
  const groupId = props.id;
  const auth = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch documents for the specific group
  const fetchGroupDocuments = async () => {
    if (!groupId) {
      console.error('No groupId available for fetching documents');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Fetching documents for groupId:', groupId);
      console.log('Full request URL:', `/documents/group/${groupId}`);

      // Get the request config to check headers
      const config = axiosInstance.defaults;
      console.log('Request headers:', config.headers);

      const response = await axiosInstance.get(`/documents/group/${groupId}`);

      console.log('Group documents response:', response.data);

      if (response.data.success) {
        // Check if the data property exists and is an array
        if (Array.isArray(response.data.data)) {
          // Check if documents have expected properties
          if (response.data.data.length > 0) {
            console.log('Sample document structure:', response.data.data[0]);
          }

          setDocuments(response.data.data);
        } else {
          console.error(
            'API response data is not an array:',
            response.data.data
          );
          setDocuments([]);
        }
      } else {
        console.error('API returned success: false', response.data.message);
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      console.error('Error fetching group documents:', err);
      setError('An error occurred while fetching group documents');
      snackBar.showSnackbar('Error Fetching Documents', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch group details and documents when component mounts
  useEffect(() => {
    if (!groupId) {
      console.error('No valid groupId available!', {
        propsId: props.id,
        groupId,
      });
      setError('Invalid group ID. Cannot fetch documents.');
      return;
    }

    console.log('Calling fetchGroupDocuments with groupId:', groupId);
    fetchGroupDocuments();
  }, [groupId]);

  const handleCreateAndNavigateToNewDocument = async (groupId: string) => {
    try {
      const createdBy = auth.user_id;
      const res = await axiosInstance.post('/documents/create', {
        title: 'Untitled Document',
        groupId: groupId,
        createdBy,
      });
      console.log('Document create response:', res);

      if (res.data.success) {
        await fetchGroupDocuments();

        // Log the document creation activity
        logJoinedDocument(
          res.data.data.name,
          res.data.data.title,
          res.data.data.createdBy,
          groupId
        );

        console.log('Navigating to:', `/document-editor/${res.data.data.name}`);
        navigate(`/document-editor/${res.data.data.name}`, {
          state: {
            documentId: res.data.data.id,
            title: res.data.data.title,
            groupId: groupId,
            groupName: props.name,
          },
        });

        addContributor(res.data.data.id);
      } else {
        console.warn('Document creation failed:', res.data);
      }
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Debug: Log the documents state and filtered results
  useEffect(() => {
    console.log('Documents state updated:', documents);
    console.log('Filtered documents:', filteredDocuments);
  }, [documents, filteredDocuments]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    _docId: string
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: 'grid' | 'list'
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleDocumentClick = async (doc: DocumentResponse) => {
    logJoinedDocument(doc.name, doc.title, doc.createdBy, doc.groupId);
    navigate(`/document-editor/${doc.name}`, {
      state: {
        documentId: doc.documentId,
        title: doc.title,
        groupId: doc.groupId,
        groupName: props.name,
      },
    });

    addContributor(doc.documentId);
  };

  const addContributor = async (documentId: string) => {
    try {
      if (!auth.user_id) return;
      const response = await axiosInstance.put(
        `/documents/${documentId}/contributors`,
        {
          contributorIds: [auth.user_id],
        }
      );

      if (response.status !== 200) {
        console.error('Failed to add contributor:', response.data.message);
        throw new Error(response.data.message || 'Unknown error occurred');
      }

      console.log('Contributor added successfully:', response.data);
    } catch (error) {
      console.error('Error adding contributor:', error);
    }
  };

  const logJoinedDocument = async (
    name: string,
    title: string,
    createdBy: string,
    groupId: string
  ) => {
    try {
      await axiosInstance.post('/analytics/log-activity', {
        category: 'COLLABORATION',
        activity_type: 'JOINED_DOCUMENT',
        metadata: {
          name,
          title,
          createdBy,
          groupId,
        },
      });
    } catch (error) {
      console.error('Failed to log joined document activity:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto', py: { xs: 2, sm: 3 } }}>
        <Box sx={{ maxWidth: 'lg', mx: 'auto', width: '100%' }}>
          {/* Search Documents Section */}
          <Box
            sx={{
              mb: theme.spacing(3),
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Group Document Library
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage and access documents for this group
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => handleCreateAndNavigateToNewDocument(groupId)}
              disabled={!groupId}
              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
            >
              New Document
            </Button>
          </Box>
          {/* Error State */}
          <Card sx={{ mb: theme.spacing(3) }}>
            <CardHeader
              avatar={<SearchIcon color="primary" />}
              title="Search Documents"
              subheader="Find documents by title, content, or creator"
            />
            <CardContent>
              <TextField
                fullWidth
                placeholder="Search group documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>
          </Card>

          {error && (
            <Box
              sx={{
                py: theme.spacing(4),
                mx: 'auto',
              }}
            >
              <Alert severity="error">
                <AlertTitle align="left">Error</AlertTitle>
                {error}
              </Alert>
            </Box>
          )}

          {/* Documents Section */}
          {isLoading ? (
            <Box
              sx={{
                textAlign: 'center',
                my: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <CircularProgress size={40} />
              <Typography variant="body1" color="text.secondary">
                Loading your documents...
              </Typography>
            </Box>
          ) : filteredDocuments.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              <Card
                elevation={1}
                sx={{
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.primary.light}15)`,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  overflow: 'visible',
                }}
              >
                <CardContent sx={{ py: 1.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileTextIcon color="primary" />
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        {searchQuery
                          ? `Search Results (${filteredDocuments.length})`
                          : `Documents (${filteredDocuments.length})`}
                      </Typography>
                    </Box>
                    <ToggleButtonGroup
                      value={viewMode}
                      exclusive
                      onChange={handleViewModeChange}
                      size="small"
                      sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                      <ToggleButton
                        value="grid"
                        sx={{ flex: { xs: 1, sm: 'none' } }}
                      >
                        <Grid3X3Icon />
                      </ToggleButton>
                      <ToggleButton
                        value="list"
                        sx={{ flex: { xs: 1, sm: 'none' } }}
                      >
                        <ListIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </CardContent>
              </Card>

              {viewMode === 'grid' ? (
                <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
                  {filteredDocuments.map((doc) => (
                    <Grid
                      size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                      key={doc.documentId}
                    >
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          height: { xs: 260, sm: 280 },
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            boxShadow: theme.shadows[4],
                            transform: 'translateY(-2px)',
                            '& .document-actions': {
                              opacity: 1,
                            },
                          },
                        }}
                        onClick={() => handleDocumentClick(doc)}
                      >
                        <CardHeader
                          sx={{ pb: 1 }}
                          title={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <FileTextIcon />
                            </Box>
                          }
                          action={
                            <IconButton
                              size="small"
                              className="document-actions"
                              sx={{
                                opacity: 0.7,
                                transition: 'opacity 0.2s',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuOpen(e, doc.documentId);
                              }}
                            >
                              <MoreHorizontalIcon />
                            </IconButton>
                          }
                        />
                        <CardContent
                          sx={{
                            pt: 0,
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography
                            variant="body1"
                            fontWeight="500"
                            sx={{
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={doc.title}
                          >
                            {doc.title}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                              flex: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <CalendarIcon sx={{ fontSize: 14 }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {new Date(doc.lastEdited).toLocaleDateString()}{' '}
                                {new Date(doc.lastEdited).toLocaleTimeString(
                                  [],
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <UsersIcon sx={{ fontSize: 14 }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {doc.contributorIds?.length || 1} collaborators
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 'auto',
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {doc.sizeInBytes < 1024
                                  ? `${doc.sizeInBytes} B`
                                  : doc.sizeInBytes < 1048576
                                  ? `${(doc.sizeInBytes / 1024).toFixed(1)} KB`
                                  : `${(doc.sizeInBytes / 1048576).toFixed(
                                      1
                                    )} MB`}
                              </Typography>
                              <Chip
                                label={props.name || 'Group'}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <List>
                  {filteredDocuments.map((doc) => (
                    <Box key={doc.documentId}>
                      <Card
                        sx={{
                          mb: 1,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            boxShadow: theme.shadows[2],
                          },
                        }}
                        onClick={() => handleDocumentClick(doc)}
                      >
                        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: {
                                xs: 'flex-start',
                                sm: 'center',
                              },
                              justifyContent: 'space-between',
                              flexDirection: {
                                xs: 'column',
                                sm: 'row',
                              },
                              gap: { xs: 1, sm: 0 },
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: {
                                  xs: 'flex-start',
                                  sm: 'center',
                                },
                                gap: 2,
                                flex: 1,
                                flexDirection: {
                                  xs: 'column',
                                  sm: 'row',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <FileTextIcon />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  fontWeight="500"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {doc.title}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: {
                                  xs: 'flex-start',
                                  sm: 'center',
                                },
                                gap: { xs: 2, sm: 3 },
                                flexDirection: {
                                  xs: 'column',
                                  sm: 'row',
                                },
                                width: { xs: '100%', sm: 'auto' },
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ order: { xs: 1, sm: 0 } }}
                              >
                                {new Date(doc.lastEdited).toLocaleDateString()}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  order: { xs: 0, sm: 1 },
                                }}
                              >
                                <UsersIcon sx={{ fontSize: 14 }} />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {doc.contributorIds?.length || 1}
                                </Typography>
                              </Box>
                              <Chip
                                label={props.name || 'Group'}
                                size="small"
                                variant="outlined"
                              />
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMenuOpen(e, doc.documentId);
                                }}
                              >
                                <MoreHorizontalIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </List>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <FileTextIcon
                sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No documents found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery
                  ? `No documents match "${searchQuery}"`
                  : "This group doesn't have any documents yet. Create one to get started!"}
              </Typography>
              {!searchQuery && (
                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
                  onClick={() => handleCreateAndNavigateToNewDocument(groupId!)}
                  disabled={!groupId}
                >
                  Create First Document
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Document Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMenuClose}>Open</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download</MenuItem>
        <MenuItem onClick={handleMenuClose}>Rename</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default GroupDocuments;
