import { useEffect, useState } from "react";
import { Box, Button, Typography, Grow, useTheme, Skeleton } from "@mui/material";
import { Add as PlusIcon, WorkspacesOutlined } from "@mui/icons-material";
import WorkspaceCard from "../workpsaces/WorkspaceCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../contexts/Authcontext";


export interface Workspace {
  workspaceId: string;      // UUID from backend
  name: string;             // Workspace name
  description: string;      // Workspace description
  createdAt: string;        // ISO date string
  createdBy: string;        // User ID of the creator
  tutorCount: number;       // Number of tutors
  studentCount: number;     // Number of students
  groups?: number;          // Optional: number of groups
  status?: string;          // Optional: status, e.g., "Active"
  lastActivity?: string;    // Optional: last activity timestamp or description
}


export function UserWorkspaces() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user_id } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEnterWorkspace = (id: string, name: string) => {
    navigate(`/workspace/${id}/${name}`);
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get<{
          success: boolean;
          message: string;
          data: Workspace[];
        }>(`/workspace/getWorkspacesByUser/${user_id}`);

        if (res.data.success) {
          setWorkspaces(res.data.data);
        } else {
          console.error("Failed to fetch workspaces:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching workspaces:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user_id) fetchWorkspaces();
  }, [user_id]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Box sx={{ py: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: { xs: "flex-start", sm: "space-between" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 3, sm: 2 },
          mb: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <WorkspacesOutlined sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              My Workspaces
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              Manage and access your learning spaces
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          sx={{
            minWidth: { xs: "100%", sm: "180px" },
            height: 44,
            fontSize: "0.95rem",
            fontWeight: 500,
            borderRadius: 1,
            textTransform: "none",
            boxShadow: theme.shadows[2],
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          Join Workspace
        </Button>
      </Box>

      {/* Workspaces Grid */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        ) : workspaces.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(auto-fit, minmax(300px, 1fr))",
              },
              gap: { xs: 2, sm: 3, md: 3 },
            }}
          >
            {workspaces.map((workspace, index) => (
              <Grow key={workspace.workspaceId} in timeout={400 + index * 100}>
                <Box>
                  <WorkspaceCard
                    workspace={{
                      id: workspace.workspaceId,
                      name: workspace.name,
                      description: workspace.description,
                      tutors: workspace.tutorCount,
                      students: workspace.studentCount,
                      groups: workspace.groups || 0,
                      status: "Active",
                      created: formatDate(workspace.createdAt),
                      lastActivity: "N/A",
                      color: "#1976d2",
                    }}
                    onView={() => handleEnterWorkspace(workspace.workspaceId, workspace.name)}
                    onManage={() => handleEnterWorkspace(workspace.workspaceId, workspace.name)}
                  />
                </Box>
              </Grow>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              textAlign: "center",
            }}
          >
            <WorkspacesOutlined sx={{ fontSize: 80, color: theme.palette.text.disabled, mb: 2 }} />
            <Typography variant="h5" fontWeight="500" color="text.primary" gutterBottom>
              No Workspaces Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
              Start your learning journey by joining your first workspace.
            </Typography>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              sx={{ px: 3, py: 1.5, fontSize: "0.95rem", fontWeight: 500, borderRadius: 1, textTransform: "none" }}
            >
              Join Your First Workspace
            </Button>
          </Box>
        )}
      </Box>

      {/* Stats Section */}
      {!loading && workspaces.length > 0 && (
        <Box
          sx={{
            mt: 6,
            px: { xs: 2, sm: 3, md: 4 },
            py: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            mx: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 3,
              textAlign: "center",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="600" color="text.primary">
                {workspaces.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Workspaces
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="600" color="text.primary">
                {workspaces.reduce((sum, ws) => sum + (ws.groups || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Groups
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="600" color="text.primary">
                {workspaces.reduce((sum, ws) => sum + ws.studentCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
