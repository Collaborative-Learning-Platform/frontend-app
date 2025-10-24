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
  ToggleButton,
  ToggleButtonGroup,
  List,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Description as FileTextIcon,
  Add as PlusIcon,
  Search as SearchIcon,
  // FilterList as FilterIcon,
  GridView as Grid3X3Icon,
  ViewList as ListIcon,
  People as UsersIcon,
  // Star as StarIcon,
  MoreHoriz as MoreHorizontalIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import NewDocumentDialog from '../components/UserDocuments/NewDocumentDialog';
import { useAuth } from '../contexts/Authcontext';
import axiosInstance from '../api/axiosInstance';
import { useSnackbar } from '../contexts/SnackbarContext';

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

// Interface for group with documents
interface GroupWithDocuments {
  groupId: string;
  name: string;
  documents: DocumentResponse[];
}

// Interface for workspace with groups
interface WorkspaceWithGroups {
  workspaceId: string;
  name: string;
  groups: GroupWithDocuments[];
}

export const UserDocuments = () => {
  const snackBar = useSnackbar();
  const auth = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewModeWorkspace, setViewModeWorkspace] = useState<'grid' | 'list'>(
    'grid'
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workspaceDocuments, setWorkspaceDocuments] = useState<
    WorkspaceWithGroups[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentResponse | null>(null);

  // Function to fetch documents grouped by workspace and group
  const fetchDocuments = async () => {
    if (!auth.user_id) return;

    setIsLoading(true);
    setError('');

    try {
      // Call the endpoint via gateway
      const response = await axiosInstance.get(
        `/documents/user/${auth.user_id}`
      );

      console.log('Documents by workspace response:', response.data);

      if (response.data.success) {
        // response.data.data structure:
        // [{
        //   workspaceId: string,
        //   name: string,
        //   groups: [{
        //     groupId: string,
        //     name: string,
        //     documents: [{
        //       documentId: string,
        //       name: string,
        //       title: string,
        //       groupId: string,
        //       createdBy: string
        //     }]
        //   }]
        // }]
        if (response.data.data && response.data.data.length > 0) {
          setWorkspaceDocuments(response.data.data);
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError('An error occurred while fetching documents');
      snackBar.showSnackbar(
        'An error occurred while fetching documents',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch documents when component mounts
  useEffect(() => {
    fetchDocuments();
  }, [auth.user_id]); // Re-fetch when user ID changes

  const handleCreate = async ({
    title,
    groupId,
  }: {
    title: string;
    groupId: string;
  }) => {
    try {
      const createdBy = auth.user_id;
      const res = await axiosInstance.post('/documents/create', {
        title,
        groupId,
        createdBy,
      });
      console.log('Document create response:', res);

      if (res.data.success) {
        await fetchDocuments();

        const groupDetails = await axiosInstance.get(
          `workspace/groups/${res.data.data.groupId}/fetchDetails`
        );
        console.log(groupDetails);

        logJoinedDocument(
          res.data.data.name,
          res.data.data.title,
          res.data.data.createdBy,
          groupDetails.data.data.groupId
        );
        console.log('Navigating to:', `/document-editor/${res.data.data.name}`);
        navigate(`/document-editor/${res.data.data.name}`, {
          state: {
            documentId: res.data.data.id,
            title: res.data.data.title,
            groupId: groupDetails.data.data.groupId,
            groupName: groupDetails.data.data.name,
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

  // Flatten and filter workspace documents based on the search query
  const filteredWorkspaceDocuments = workspaceDocuments
    .map((workspace) => ({
      ...workspace,
      groups: workspace.groups
        .map((group) => ({
          ...group,
          documents: group.documents.filter(
            (doc) =>
              doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              doc.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((group) => group.documents.length > 0), // Exclude groups with no matching documents
    }))
    .filter((workspace) => workspace.groups.length > 0); // Exclude workspaces with no groups

  // const filteredDocuments = recentDocuments.filter(
  //   (doc) =>
  //     doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     doc.owner.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    document: DocumentResponse
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // const handleRecentViewModeChange = (
  //   _event: React.MouseEvent<HTMLElement>,
  //   newRecentViewMode: 'grid' | 'list'
  // ) => {
  //   if (newRecentViewMode !== null) {
  //     setViewModeRecent(newRecentViewMode);
  //   }
  // };

  const handleWorkspaceViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newWorkspaceViewMode: 'grid' | 'list'
  ) => {
    if (newWorkspaceViewMode !== null) {
      setViewModeWorkspace(newWorkspaceViewMode);
    }
  };

  const handleWorkspaceDocumentClick = async (
    doc: DocumentResponse,
    group: GroupWithDocuments
  ) => {
    logJoinedDocument(doc.name, doc.title, doc.createdBy, group.groupId);
    navigate(`/document-editor/${doc.name}`, {
      state: {
        documentId: doc.documentId,
        title: doc.title,
        groupId: group.groupId,
        groupName: group.name,
      },
    });

    addContributor(doc.documentId);
  };

  const handleDeleteMenuClick = () => {
    if (selectedDocument) {
      handleDeleteDocument(selectedDocument.documentId);
    }
    handleMenuClose();
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const res = await axiosInstance.delete(`/documents/${documentId}`);
      if (res.data.success) {
        snackBar.showSnackbar('Document deleted!', 'success');
        await fetchDocuments(); // Refresh the list
      } else {
        snackBar.showSnackbar(res.data.message || 'Delete failed', 'error');
      }
    } catch (err) {
      snackBar.showSnackbar('Delete failed', 'error');
    }
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

  // Calculate the total number of filtered documents
  const totalFilteredDocuments = filteredWorkspaceDocuments.reduce(
    (count, workspace) =>
      count +
      workspace.groups.reduce(
        (groupCount, group) => groupCount + group.documents.length,
        0
      ),
    0
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Header */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileTextIcon
                  sx={{
                    fontSize: { xs: 24, sm: 28 },
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
                >
                  My Documents
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Button
                variant="contained"
                startIcon={<PlusIcon />}
                onClick={() => setDialogOpen(true)}
              >
                New Document
              </Button>
              <NewDocumentDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onCreate={handleCreate}
                userId={auth.user_id ?? ''}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto', py: { xs: 2, sm: 3 } }}>
        <Box sx={{ maxWidth: 'lg', mx: 'auto', width: '100%' }}>
          {/* Search Documents Section */}
          <Box sx={{ mb: theme.spacing(3), width: '100%' }}>
            <Typography variant="h5" fontWeight="bold">
              Document Library
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and access your document collections
            </Typography>
          </Box>

          <Card sx={{ mb: theme.spacing(3) }}>
            <CardHeader
              avatar={<SearchIcon color="primary" />}
              title="Search Documents"
              subheader="Find your documents by title, content, or owner"
            />
            <CardContent>
              <TextField
                fullWidth
                placeholder="Search documents..."
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

          {/* Workspaces and Documents */}
          {/* Error State */}
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
          {/* Loading State for Workspaces */}
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
          ) : workspaceDocuments.length > 0 ? (
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
                {/* Error State */}
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
                      <UsersIcon color="primary" />
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        {searchQuery
                          ? `Search Results (${totalFilteredDocuments})`
                          : 'My Workspaces'}
                      </Typography>
                    </Box>
                    <ToggleButtonGroup
                      value={viewModeWorkspace}
                      exclusive
                      onChange={handleWorkspaceViewModeChange}
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

              {filteredWorkspaceDocuments.map((workspace) => (
                <Box key={workspace.workspaceId} sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      pb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      sx={{ color: theme.palette.primary.main }}
                    >
                      Workspace: {workspace.name}
                    </Typography>
                  </Box>

                  {workspace.groups
                    .filter((group) => group.documents.length > 0)
                    .map((group) => (
                      <Box key={group.groupId} sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight="500"
                            sx={{ color: theme.palette.primary.main }}
                          >
                            <Chip
                              label={group.name}
                              size="small"
                              sx={{
                                mr: 1,
                                color: theme.palette.primary.main,
                                borderColor: theme.palette.primary.main,
                              }}
                            />
                            Group Documents
                          </Typography>
                        </Box>

                        {viewModeWorkspace === 'grid' ? (
                          <Grid
                            container
                            spacing={2}
                            sx={{ width: '100%', margin: 0 }}
                          >
                            {group.documents.map((doc) => (
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
                                  onClick={() =>
                                    handleWorkspaceDocumentClick(doc, group)
                                  }
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
                                          handleMenuOpen(e, doc);
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
                                          {new Date(
                                            doc.lastEdited
                                          ).toLocaleDateString()}{' '}
                                          {new Date(
                                            doc.lastEdited
                                          ).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
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
                                          {doc.contributorIds?.length || 1}{' '}
                                          collaborators
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
                                            ? `${(
                                                doc.sizeInBytes / 1024
                                              ).toFixed(1)} KB`
                                            : `${(
                                                doc.sizeInBytes / 1048576
                                              ).toFixed(1)} MB`}
                                        </Typography>
                                        <Chip
                                          label={group.name}
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
                            {group.documents.map((doc) => (
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
                                  onClick={() =>
                                    navigate(`/document-editor/${doc.name}`)
                                  }
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
                                          {new Date(
                                            doc.lastEdited
                                          ).toLocaleDateString()}
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
                                          label={group.name}
                                          size="small"
                                          variant="outlined"
                                        />
                                        <IconButton
                                          size="small"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleMenuOpen(e, doc);
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
                    ))}
                </Box>
              ))}
            </Box>
          ) : !error ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 4,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  mb: 3,
                  opacity: 0.5,
                }}
              >
                <FileTextIcon
                  sx={{
                    fontSize: 120,
                    color: theme.palette.text.secondary,
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ mb: 2, color: theme.palette.text.primary }}
              >
                No Workspaces Found
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 400 }}
              >
                Join a workspace to get started and begin collaborating on
                documents with your team.
              </Typography>
              {/* <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                }}
                onClick={() => {
                  // You can add navigation to workspace join page here
                  console.log('Navigate to join workspace');
                }}
              >
                Explore Workspaces
              </Button> */}
            </Box>
          ) : null}
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
        <MenuItem onClick={handleDeleteMenuClick} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserDocuments;
