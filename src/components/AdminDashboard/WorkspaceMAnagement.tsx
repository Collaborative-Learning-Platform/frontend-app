import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as PlusIcon,
  People as UsersIcon,
  Message as MessageSquareIcon,
  Description as FileTextIcon,
  BarChart as BarChart3Icon,
} from "@mui/icons-material";
import CreateWorkspaceModal from "../workpsaces/CreateWorkspaceModal";


export function WorkspaceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([
    {
      id: 1,
      name: "Advanced Mathematics",
      description: "Calculus, Linear Algebra, and Statistics",
      students: 45,
      tutors: 3,
      groups: 8,
      status: "Active",
      created: "2024-01-10",
      lastActivity: "2 hours ago",
    },
    {
      id: 2,
      name: "Physics Laboratory",
      description: "Experimental Physics and Lab Work",
      students: 32,
      tutors: 2,
      groups: 6,
      status: "Active",
      created: "2024-01-15",
      lastActivity: "30 minutes ago",
    },
    {
      id: 3,
      name: "Computer Science Fundamentals",
      description: "Programming, Algorithms, and Data Structures",
      students: 67,
      tutors: 4,
      groups: 12,
      status: "Active",
      created: "2023-12-20",
      lastActivity: "1 hour ago",
    },
  ]);

  function handleCreated(newWs: any) {
    // Best-effort shape mapping
    const mapped = {
      id: newWs?.id ?? Date.now(),
      name: newWs?.name ?? newWs?.title ?? "New Workspace",
      description: newWs?.description ?? "",
      students: newWs?.studentsCount ?? 0,
      tutors: newWs?.tutorsCount ?? 0,
      groups: newWs?.groupsCount ?? 0,
      status: newWs?.status ?? "Active",
      created: new Date().toISOString().slice(0, 10),
      lastActivity: "just now",
    };
    setWorkspaces((prev) => [mapped, ...prev]);
  }

  return (
    <Box sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Workspace Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage learning workspaces
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusIcon />} onClick={() => setIsWorkspaceModalOpen(true)}>
          Create Workspace
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          placeholder="Search workspaces..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 auto" },
            maxWidth: { sm: 320 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="outlined">Filter</Button>
        <Button variant="outlined">Export</Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 4,
        }}
      >
        {workspaces.map((workspace) => (
          <Box
            key={workspace.id}
            sx={{
              flex: {
                xs: "1 1 100%",
                md: "1 1 calc(50% - 12px)",
                lg: "1 1 calc(33.333% - 16px)",
              },
            }}
          >
            <Card
              sx={{
                height: "100%",
                transition: "box-shadow 0.2s",
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              <CardHeader
                title={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">{workspace.name}</Typography>
                    <Chip
                      label={workspace.status}
                      color={
                        workspace.status === "Active" ? "primary" : "default"
                      }
                      size="small"
                    />
                  </Box>
                }
                subheader={workspace.description}
                sx={{ pb: 2 }}
              />
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 120 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <UsersIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {workspace.students} Students
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 120 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MessageSquareIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {workspace.groups} Groups
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 120 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FileTextIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {workspace.tutors} Tutors
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 120 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BarChart3Icon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2">Analytics</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Created: {workspace.created}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last activity: {workspace.lastActivity}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button size="small" variant="contained" sx={{ flex: 1 }}>
                    Manage
                  </Button>
                  <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                    View
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Quick Stats */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 8px)",
              md: "1 1 calc(25% - 12px)",
            },
          }}
        >
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                156
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Workspaces
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 8px)",
              md: "1 1 calc(25% - 12px)",
            },
          }}
        >
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                2,847
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Participants
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 8px)",
              md: "1 1 calc(25% - 12px)",
            },
          }}
        >
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                1,234
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active Groups
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 8px)",
              md: "1 1 calc(25% - 12px)",
            },
          }}
        >
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                89%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Engagement Rate
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <CreateWorkspaceModal
        open={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onCreated={handleCreated}
        endpoint="/workspace/create" // adjust to your backend route
      />
    </Box>
  );
}
