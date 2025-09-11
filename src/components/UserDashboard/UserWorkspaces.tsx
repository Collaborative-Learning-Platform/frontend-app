import { Box, Button, Typography, Grow, useTheme } from "@mui/material";
import { Add as PlusIcon, WorkspacesOutlined } from "@mui/icons-material";
import WorkspaceCard from "../workpsaces/WorkspaceCard";
import { useNavigate } from "react-router-dom";

const mockWorkspaces = [
  {
    id: 1,
    name: "Computer Science 101",
    description: "Introduction to Programming and Computer Science",
    students: 45,
    tutors: 2,
    groups: 4,
    status: "Active",
    created: "2024-01-15",
    lastActivity: "2 hours ago",
    color: "#1976d2",
  },
  {
    id: 2,
    name: "Mathematics Advanced",
    description: "Calculus, Linear Algebra, and Statistics",
    students: 32,
    tutors: 2,
    groups: 3,
    status: "Active",
    created: "2024-01-20",
    lastActivity: "1 hour ago",
    color: "#388e3c",
  },
  {
    id: 3,
    name: "Physics Fundamentals",
    description: "Classical Mechanics and Thermodynamics",
    students: 28,
    tutors: 1,
    groups: 2,
    status: "Active",
    created: "2024-01-25",
    lastActivity: "30 minutes ago",
    color: "#7b1fa2",
  },
  {
    id: 4,
    name: "Chemistry Fundamentals",
    description: "Organic and Inorganic Chemistry Basics",
    students: 28,
    tutors: 2,
    groups: 3,
    status: "Active",
    created: "2024-02-01",
    lastActivity: "45 minutes ago",
    color: "#7b1fa2",
  },
  {
    id: 5,
    name: "Engineer and Society",
    description: "Ethics and Social Responsibility in Engineering",
    students: 28,
    tutors: 1,
    groups: 2,
    status: "Active",
    created: "2024-02-05",
    lastActivity: "3 hours ago",
    color: "#7b1fa2",
  },
  {
    id: 6,
    name: "Software Engineering",
    description: "Software Development Lifecycle and Best Practices",
    students: 28,
    tutors: 3,
    groups: 8,
    status: "Active",
    created: "2024-02-10",
    lastActivity: "1 hour ago",
    color: "#7b1fa2",
  },
];



export function UserWorkspaces() {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleEnterWorkspace = (id: number | string) => {
    // console.log("Entering workspace:", id);
    navigate(`/workspace/${id}`); 
    };

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
            <WorkspacesOutlined 
              sx={{ 
                fontSize: 32, 
                color: theme.palette.primary.main,
              }} 
            />
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
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
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
        <Box
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {mockWorkspaces.length > 0 ? (
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
              {mockWorkspaces.map((workspace, index) => (
                <Grow
                  key={workspace.id}
                  in
                  timeout={400 + index * 100}
                  style={{ transformOrigin: "center" }}
                >
                  <Box>
                    <WorkspaceCard
                      workspace={workspace}
                      onView={() => handleEnterWorkspace(workspace.id)}
                      onManage={() => handleEnterWorkspace(workspace.id)}
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
              <WorkspacesOutlined 
                sx={{ 
                  fontSize: 80, 
                  color: theme.palette.text.disabled,
                  mb: 2,
                }} 
              />
              <Typography
                variant="h5"
                fontWeight="500"
                color="text.primary"
                gutterBottom
              >
                No Workspaces Yet
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 400 }}
              >
                Start your learning journey by joining your first workspace.
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlusIcon />}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  borderRadius: 1,
                  textTransform: "none",
                }}
              >
                Join Your First Workspace
              </Button>
            </Box>
          )}
        </Box>

        {/* Stats Section */}
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
                {mockWorkspaces.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Workspaces
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="600" color="text.primary">
                {mockWorkspaces.reduce((sum, workspace) => sum + workspace.groups, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Groups
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="600" color="text.primary">
                {mockWorkspaces.reduce((sum, workspace) => sum + workspace.students, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
}