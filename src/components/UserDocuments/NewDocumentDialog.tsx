import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (doc: { title: string; groupId: string }) => void;
  groups: { id: string; name: string }[]; // pass groups from parent
}

export default function NewDocumentDialog({
  open,
  onClose,
  onCreate,
  groups,
}: Props) {
  const [title, setTitle] = useState("Untitled-Document");
  const [groupId, setGroupId] = useState("");

  const handleSubmit = () => {
    if (!groupId) return;
    onCreate({ title, groupId });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Document</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          select
          margin="dense"
          label="Group"
          fullWidth
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        >
          {groups.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
