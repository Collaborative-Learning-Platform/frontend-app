import { Box, IconButton, Typography, Tooltip, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Workspace {
  workspaceId: string;
  name: string;
  description?: string;
}

interface Props {
  workspace: Workspace | null;
  onBack: () => void;
}

export default function WorkspaceHeader({ workspace, onBack }: Props) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="Back to Workspaces">
          <IconButton
            onClick={onBack}
            edge="start"
            sx={{ color: "inherit", mr: 2 }}
          >
            <ArrowBackIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Box>
          <Typography variant="h4" fontWeight="bold">
            {workspace?.name || "Loading..."}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {workspace?.description || "Manage your workspace settings"}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
