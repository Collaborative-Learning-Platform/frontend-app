import { useState } from "react";
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
  AccessTime as ClockIcon,
  People as UsersIcon,
  Star as StarIcon,
  MoreHoriz as MoreHorizontalIcon,
  FolderOpen as FolderOpenIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

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

interface Folder {
  id: number;
  name: string;
  count: number;
  color: string;
}

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
  {
    id: 3,
    title: "Technical Specifications",
    lastModified: "3 days ago",
    collaborators: 2,
    size: "3.2 MB",
    folder: "Design",
    starred: true,
    owner: "Mike Johnson",
  },
  {
    id: 4,
    title: "Budget Analysis 2024",
    lastModified: "1 week ago",
    collaborators: 4,
    size: "1.1 MB",
    folder: "Design",
    starred: false,
    owner: "Emma Davis",
  },
  {
    id: 5,
    title: "Design System Guidelines",
    lastModified: "2 weeks ago",
    collaborators: 6,
    size: "4.7 MB",
    folder: "Marketing",
    starred: true,
    owner: "You",
  },
  {
    id: 6,
    title: "Meeting Notes - Sprint Planning",
    lastModified: "3 weeks ago",
    collaborators: 8,
    size: "892 KB",
    folder: "Projects",
    starred: false,
    owner: "Team Lead",
  },
];

const folders: Folder[] = [
  { id: 1, name: "Projects", count: 12, color: "#3b82f6" },
  { id: 2, name: "Marketing", count: 8, color: "#10b981" },
  { id: 3, name: "Design", count: 15, color: "#8b5cf6" },
  { id: 4, name: "Archive", count: 24, color: "#6b7280" },
];

export const UserDocuments = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
        <CardContent sx={{ py: 3, px: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2}}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FileTextIcon
                  sx={{ fontSize: 28, color: theme.palette.primary.main }}
                />
                <Typography variant="h4" fontWeight="bold">
                  My Documents
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button variant="contained" startIcon={<PlusIcon />}>
                New Document
              </Button>
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
        <CardContent sx={{ py: 2, px: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flex: 1,
              }}
            >
              <TextField
                placeholder="Search documents, folders, and people..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ maxWidth: 400, flex: 1 }}
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
              >
                Filter
              </Button>
            </Box>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="grid">
                <Grid3X3Icon />
              </ToggleButton>
              <ToggleButton value="list">
                <ListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <Box sx={{ maxWidth: "lg", mx: "auto", width: "100%" }}>
          {/* Quick Access Folders */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
              Folders
            </Typography>
            <Grid container spacing={2}>
              {folders.map((folder) => (
                <Grid size={{ xs: 6, md: 3 }} key={folder.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: theme.shadows[4],
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            backgroundColor: folder.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FolderOpenIcon
                            sx={{ color: "white", fontSize: 20 }}
                          />
                        </Box>
                        <Box>
                          <Typography fontWeight="500">
                            {folder.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {folder.count} items
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Recent Documents */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                {searchQuery
                  ? `Search Results (${filteredDocuments.length})`
                  : "Recent Documents"}
              </Typography>
              <Button variant="text" size="small" startIcon={<ClockIcon />}>
                Sort by Modified
              </Button>
            </Box>

            {viewMode === "grid" ? (
              <Grid container spacing={2}>
                {filteredDocuments.map((doc) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={doc.id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        height: 280, // Fixed height for uniform cards
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
                          title={doc.title} // Shows full title on hover
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
                              mt: "auto", // Push to bottom
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
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
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
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {doc.lastModified}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
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
