import { Box, IconButton, Typography } from "@mui/material";
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
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      <IconButton onClick={onBack}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" fontWeight="bold" sx={{ ml: 1 }}>
        Manage Workspace: {workspace?.name || "Loading..."}
      </Typography>
    </Box>
  );
}
