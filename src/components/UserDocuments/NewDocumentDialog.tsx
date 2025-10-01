import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  useTheme,
} from "@mui/material";
import axiosInstance from "../../api/axiosInstance";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (doc: { title: string; groupId: string }) => void;
  userId: string;
}

export default function NewDocumentDialog({
  open,
  onClose,
  onCreate,
  userId,
}: Props) {
  const theme = useTheme();
  const [title, setTitle] = useState("Untitled-Document");
  const [workspaceId, setWorkspaceId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [workspaces, setWorkspaces] = useState<{ id: string; name: string }[]>(
    []
  );
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

  // fetch workspaces when dialog opens
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await axiosInstance.get(
          `/workspace/getWorkspacesByUser/${userId}`
        );
        console.log(res.data.data);
        const filtered = res.data.data.map((ws: any) => ({
          id: ws.workspaceId,
          name: ws.name,
        }));
        setWorkspaces(filtered);
      } catch (err) {
        console.error("Failed to fetch workspaces:", err);
        setWorkspaces([]); // safe fallback
      }
    };
    if (open) {
      fetchWorkspaces();
    }
  }, [open, userId]);

  // fetch groups when a workspace is selected
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axiosInstance.post(
          `/workspace/groups/fetchByUserId`,
          {
            userId,
            workspaceId,
          }
        );
        console.log(res.data.data);
        const filtered = res.data.data.map((gr: any) => ({
          id: gr.groupId,
          name: gr.name,
        }));
        setGroups(filtered);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        setGroups([]); // safe fallback
      }
    };

    if (workspaceId) {
      fetchGroups();
    } else {
      setGroups([]);
    }
  }, [workspaceId, userId]);

  const handleSubmit = () => {
    if (!groupId) return;
    onCreate({ title, groupId });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3,
          width: 350,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2,
        }}
      >
        Create New Document
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <TextField
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        {/* Workspace Selector */}
        <TextField
          select
          margin="dense"
          label="Workspace"
          fullWidth
          value={workspaceId}
          onChange={(e) => {
            setWorkspaceId(e.target.value);
            setGroupId(""); // reset group
          }}
          sx={{ mb: 2 }}
        >
          {workspaces.map((w) => (
            <MenuItem key={w.id} value={w.id}>
              {w.name}
            </MenuItem>
          ))}
        </TextField>
        {/* Group Selector (depends on workspace) */}
        <TextField
          select
          margin="dense"
          label="Group"
          fullWidth
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          disabled={!workspaceId}
        >
          {groups.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
