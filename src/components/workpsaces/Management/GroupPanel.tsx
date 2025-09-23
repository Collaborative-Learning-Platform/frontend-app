import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Group as GroupIcon } from "@mui/icons-material";
import axiosInstance from "../../../api/axiosInstance";

interface Group {
  groupId: string;
  name: string;
  description?: string;
  type: string;
  createdAt: string;
}

interface Props {
  workspaceId: string;
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;
}

export default function GroupsPanel({
  workspaceId,
  groups,
  setGroups,
  setError,
  setSuccess,
}: Props) {
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });

const handleCreateGroup = async () => {
  if (!newGroup.name.trim()) {
    setError("Group name is required");
    return;
  }
  try {
    const res = await axiosInstance.post(`/workspace/createGroup`, {
      workspaceId,
      name: newGroup.name,
      description: newGroup.description,
      type: "Main",
    });
    if (res.data.success) {
      setGroups((prev) => [...prev, res.data.data]);
      setNewGroup({ name: "", description: "" });
      setSuccess("Group created successfully");
    } else {
      setError(res.data.message || "Failed to create group");
    }
  } catch (err: any) {
    setError(err?.response?.data?.message || "Failed to create group");
  }
};


  const handleDeleteGroup = async (groupId: string) => {
    try {
      await axiosInstance.delete(`/groups/${groupId}`);
      setGroups((prev) => prev.filter((g) => g.groupId !== groupId));
      setSuccess("Group deleted successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete group");
    }
  };

  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Create Group */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardHeader title="Create New Group" />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: { sm: "flex-end" },
            }}
          >
            <TextField
              label="Group Name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              fullWidth
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateGroup}
              disabled={!newGroup.name.trim()}
              sx={{ whiteSpace: "nowrap" }}
            >
              Create
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Existing Groups */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardHeader
          title="Existing Main Groups"
          subheader={`${groups.length} group${groups.length !== 1 ? "s" : ""} created`}
        />
        <CardContent>
          {groups.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <GroupIcon sx={{ fontSize: 48, color: "action.disabled", mb: 2 }} />
              <Typography color="text.secondary">No groups created yet</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "flex-start",
              }}
            >
              {groups.map((group) => (
                <Card
                  key={group.groupId}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 2,
                    p: 2,
                    flex: "1 1 300px", // responsive flex
                    maxWidth: "calc(33% - 16px)", // 3 per row max
                    minWidth: 250,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {group.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {group.description || "No description"}
                    </Typography>
                    <Chip
                      size="small"
                      label={`Created ${new Date(group.createdAt).toLocaleDateString()}`}
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                  <Box sx={{ textAlign: "right", mt: 2 }}>
                    <IconButton color="error" onClick={() => handleDeleteGroup(group.groupId)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
