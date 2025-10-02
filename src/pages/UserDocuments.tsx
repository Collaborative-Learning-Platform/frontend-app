import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Description as FileTextIcon,
  Add as PlusIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  GridView as Grid3X3Icon,
  ViewList as ListIcon,
  People as UsersIcon,
  Star as StarIcon,
  MoreHoriz as MoreHorizontalIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import NewDocumentDialog from "../components/UserDocuments/NewDocumentDialog";
import { useAuth } from "../contexts/Authcontext";
import axiosInstance from "../api/axiosInstance";

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

interface Document {
  id: number;
  title: string;
  lastModified: string;
  collaborators: number;
  size: string;
  folder: string;
  starred: boolean;
  owner: string;
}

// Removed Folder interface

// const groups = [
//   { id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab", name: "Team Alpha" },
//   { id: "b2c3d4e5-f6a7-8901-bcde-2345678901bc", name: "Team Beta" },
// ]; // Replace with API fetched groups

const recentDocuments: Document[] = [
  {
    id: 1,
    title: "Project Proposal Q4",
    lastModified: "2 hours ago",
    collaborators: 3,
    size: "2.4 MB",
    folder: "Archived",
    starred: true,
    owner: "You",
  },
  {
    id: 2,
    title: "Marketing Strategy",
    lastModified: "1 day ago",
    collaborators: 5,
    size: "1.8 MB",
    folder: "Marketing",
    starred: false,
    owner: "Sarah Chen",
  },
];

export const UserDocuments = () => {
  const auth = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workspaceDocuments, setWorkspaceDocuments] = useState<
    WorkspaceWithGroups[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch documents grouped by workspace and group
  const fetchDocuments = async () => {
    if (!auth.user_id) return;

    setIsLoading(true);
    setError("");

    try {
      // Call the endpoint via gateway
      const response = await axiosInstance.get(
        `/documents/user/${auth.user_id}`
      );

      console.log("Documents by workspace response:", response.data);

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
        setWorkspaceDocuments(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch documents");
      }
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      setError(err.message || "An error occurred while fetching documents");
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
      const res = await axiosInstance.post("/documents/create", {
        title,
        groupId,
        createdBy,
      });
      console.log("Document create response:", res);

      if (res.data.success) {
        // Refresh the document list
        await fetchDocuments();

        const groupDetails = await axiosInstance.get(
          `workspace/groups/${res.data.data.groupId}/fetchDetails`
        );
        console.log(groupDetails);
        console.log("Navigating to:", `/document-editor/${res.data.data.name}`);
        navigate(`/document-editor/${res.data.data.name}`, {
          state: {
            documentId: res.data.data.id,
            title: res.data.data.title,
            groupId: groupDetails.data.data.groupId,
            groupName: groupDetails.data.data.name,
          },
        });
      } else {
        console.warn("Document creation failed:", res.data);
      }
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const filteredDocuments = recentDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    _docId: number
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: "grid" | "list"
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
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
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FileTextIcon
                  sx={{
                    fontSize: { xs: 24, sm: 28 },
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
                >
                  My Documents
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
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
                userId={auth.user_id ?? ""}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "stretch", sm: "center" },
                gap: { xs: 1, sm: 2 },
                flex: 1,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                placeholder="Search documents, folders, and people..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  maxWidth: { xs: "100%", sm: 400 },
                  flex: 1,
                  width: { xs: "100%", sm: "auto" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ color: theme.palette.text.secondary }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterIcon />}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Filter
              </Button>
            </Box>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <ToggleButton value="grid" sx={{ flex: { xs: 1, sm: "none" } }}>
                <Grid3X3Icon />
              </ToggleButton>
              <ToggleButton value="list" sx={{ flex: { xs: 1, sm: "none" } }}>
                <ListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: { xs: 2, sm: 3 } }}>
        <Box sx={{ maxWidth: "lg", mx: "auto", width: "100%" }}>
          {/* Error State */}
          {error && (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {/* Recent Documents */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                mb: 2,
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 0 },
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 1,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                {searchQuery
                  ? `Search Results (${filteredDocuments.length})`
                  : "Recent Documents"}
              </Typography>
            </Box>

            {viewMode === "grid" ? (
              <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                {filteredDocuments.map((doc) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={doc.id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        height: { xs: 260, sm: 280 },
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": {
                          boxShadow: theme.shadows[4],
                          transform: "translateY(-2px)",
                          "& .document-actions": {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <CardHeader
                        sx={{ pb: 1 }}
                        title={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <FileTextIcon />
                            {doc.starred && (
                              <StarIcon
                                sx={{ fontSize: 16, color: "#fbbf24" }}
                              />
                            )}
                          </Box>
                        }
                        action={
                          <IconButton
                            size="small"
                            className="document-actions"
                            sx={{ opacity: 0, transition: "opacity 0.2s" }}
                            onClick={(e) => handleMenuOpen(e, doc.id)}
                          >
                            <MoreHorizontalIcon />
                          </IconButton>
                        }
                      />
                      <CardContent
                        sx={{
                          pt: 0,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="500"
                          sx={{
                            mb: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={doc.title}
                        >
                          {doc.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            flex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CalendarIcon sx={{ fontSize: 14 }} />
                            <Typography variant="body2" color="text.secondary">
                              {doc.lastModified}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <UsersIcon sx={{ fontSize: 14 }} />
                            <Typography variant="body2" color="text.secondary">
                              {doc.collaborators} collaborators
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mt: "auto",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {doc.size}
                            </Typography>
                            <Chip
                              label={doc.folder}
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
                  <Box key={doc.id}>
                    <Card
                      sx={{
                        mb: 1,
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: theme.shadows[2],
                        },
                      }}
                    >
                      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: { xs: "flex-start", sm: "center" },
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: { xs: 1, sm: 0 },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: { xs: "flex-start", sm: "center" },
                              gap: 2,
                              flex: 1,
                              flexDirection: { xs: "column", sm: "row" },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <FileTextIcon />
                              {doc.starred && (
                                <StarIcon
                                  sx={{ fontSize: 16, color: "#fbbf24" }}
                                />
                              )}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                fontWeight="500"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {doc.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Owned by {doc.owner}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: { xs: "flex-start", sm: "center" },
                              gap: { xs: 2, sm: 3 },
                              flexDirection: { xs: "column", sm: "row" },
                              width: { xs: "100%", sm: "auto" },
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ order: { xs: 1, sm: 0 } }}
                            >
                              {doc.lastModified}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                order: { xs: 0, sm: 1 },
                              }}
                            >
                              <UsersIcon sx={{ fontSize: 14 }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {doc.collaborators}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {doc.size}
                            </Typography>
                            <Chip
                              label={doc.folder}
                              size="small"
                              variant="outlined"
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, doc.id)}
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

          {/* Workspaces and Documents */}
          {/* Loading State for Workspaces */}
          {isLoading ? (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <Typography>Loading your documents...</Typography>
            </Box>
          ) : (
            workspaceDocuments.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    mb: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    pb: 1,
                  }}
                >
                  <Typography variant="h6" fontWeight="600">
                    My Workspaces
                  </Typography>
                </Box>

                {workspaceDocuments.map((workspace) => (
                  <Box key={workspace.workspaceId} sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
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
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
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

                          <Grid
                            container
                            spacing={2}
                            sx={{ width: "100%", margin: 0 }}
                          >
                            {group.documents.map((doc) => (
                              <Grid
                                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                key={doc.documentId}
                              >
                                <Card
                                  sx={{
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    height: { xs: 260, sm: 280 },
                                    display: "flex",
                                    flexDirection: "column",
                                    "&:hover": {
                                      boxShadow: theme.shadows[4],
                                      transform: "translateY(-2px)",
                                      "& .document-actions": {
                                        opacity: 1,
                                      },
                                    },
                                  }}
                                  onClick={() =>
                                    navigate(`/document-editor/${doc.name}`)
                                  }
                                >
                                  <CardHeader
                                    sx={{ pb: 1 }}
                                    title={
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
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
                                          transition: "opacity 0.2s",
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMenuOpen(
                                            e,
                                            parseInt(doc.documentId)
                                          );
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
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      fontWeight="500"
                                      sx={{
                                        mb: 2,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                      title={doc.title}
                                    >
                                      {doc.title}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        flex: 1,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
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
                                          ).toLocaleDateString()}{" "}
                                          {new Date(
                                            doc.lastEdited
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <UsersIcon sx={{ fontSize: 14 }} />
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          {doc.contributorIds?.length || 1}{" "}
                                          collaborators
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          mt: "auto",
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
                        </Box>
                      ))}
                  </Box>
                ))}
              </Box>
            )
          )}
        </Box>
      </Box>

      {/* Document Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleMenuClose}>Open</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download</MenuItem>
        <MenuItem onClick={handleMenuClose}>Rename</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserDocuments;
