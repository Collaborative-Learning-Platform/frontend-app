import { Box, Button, Typography } from "@mui/material";
import { Add as PlusIcon } from "@mui/icons-material";
import WorkspaceCard from "./WorkspaceCard";

const mockWorkspaces = [
  {
    id: 1,
    name: "Computer Science 101",
    groups: 4,
    members: 45,
    color: "#1976d2",
  },
  {
    id: 2,
    name: "Mathematics Advanced",
    groups: 3,
    members: 32,
    color: "#388e3c",
  },
  {
    id: 3,
    name: "Physics Fundamentals",
    groups: 2,
    members: 28,
    color: "#7b1fa2",
  },
  {
    id: 4,
    name: "Chemistry Fundamentals",
    groups: 3,
    members: 28,
    color: "#7b1fa2",
  },
  {
    id: 5,
    name: "Engineer and Society",
    groups: 2,
    members: 28,
    color: "#7b1fa2",
  },
  {
    id: 6,
    name: "Software Engineering",
    groups: 8,
    members: 28,
    color: "#7b1fa2",
  },
];

const handleEnterWorkspace = (id: number) => {
  console.log("Entering workspace:", id);
};

export function UserWorkspaces() {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "flex-start", sm: "space-between" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 2, sm: 0 },
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            My Workspaces
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlusIcon />}
            sx={{
              minWidth: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.875rem", sm: "0.875rem" },
              py: { xs: 1, sm: 0.75 },
            }}
          >
            Join Workspace
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {mockWorkspaces.map((workspace) => (
            <Box
              key={workspace.id}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 12px)",
                  md: "1 1 calc(33.333% - 16px)",
                },
              }}
            >
              <WorkspaceCard
                workspace={workspace}
                onEnter={handleEnterWorkspace}
              />
            </Box>
          ))}
        </Box>
      </>
    );
}