import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Chip,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
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
  const theme = useTheme();
  useMediaQuery(theme.breakpoints.down("sm"));

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

  const mainGroups = groups.filter((group) => group.type === "Main");
  const customGroups = groups.filter((group) => group.type === "Custom");

  return (
    <Box sx={{ mt: 4 }}>
      {/* Create Group */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 1.5 }}
      >
        <Typography variant="h6" gutterBottom>
          Create a New Main Group
        </Typography>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
          <TextField
            label="Group Name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            required
            fullWidth
            variant="outlined"
            sx={{ flex: { sm: "1 1 40%" } }}
          />
          <TextField
            label="Description (Optional)"
            value={newGroup.description}
            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{ flex: { sm: "1 1 40%" } }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateGroup}
            disabled={!newGroup.name.trim()}
            sx={{
              flexShrink: 0,
              minHeight: 56,
              flex: { sm: "1 1 20%" },
            }}
          >
            Create
          </Button>
        </Box>
      </Paper>

      {/* Existing Main Groups */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Existing Main Groups ({mainGroups.length})
        </Typography>
        {mainGroups.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              textAlign: "center",
              py: 6,
              borderRadius: 3,
              borderStyle: "dashed",
              borderColor: "divider",
            }}
          >
            <GroupsIcon sx={{ fontSize: 48, color: "action.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No main groups yet
            </Typography>
            <Typography color="text.secondary">
              Get started by creating your first main group above.
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {mainGroups.map((group) => (
              <Card
                key={group.groupId}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: theme.shadows[6],
                  },
                  width: {
                    xs: "100%",
                    sm: `calc(50% - ${theme.spacing(1.5)})`,
                    md: `calc(33.333% - ${theme.spacing(2)})`,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <GroupIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" component="div" noWrap>
                      {group.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      flexGrow: 1,
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "40px",
                    }}
                  >
                    {group.description || "No description provided."}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "auto",
                    }}
                  >
                    <Chip
                      size="small"
                      label={`Created: ${new Date(group.createdAt).toLocaleDateString()}`}
                      variant="outlined"
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteGroup(group.groupId)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(211, 47, 47, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Student Created Custom Groups */}
      {customGroups.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Student Created Custom Groups ({customGroups.length})
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {customGroups.map((group) => (
              <Card
                key={group.groupId}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: theme.shadows[6],
                  },
                  width: {
                    xs: "100%",
                    sm: `calc(50% - ${theme.spacing(1.5)})`,
                    md: `calc(33.333% - ${theme.spacing(2)})`,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <GroupIcon color="secondary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" component="div" noWrap>
                      {group.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      flexGrow: 1,
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "40px",
                    }}
                  >
                    {group.description || "No description provided."}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "auto",
                    }}
                  >
                    <Chip
                      size="small"
                      label={`Created: ${new Date(group.createdAt).toLocaleDateString()}`}
                      variant="outlined"
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteGroup(group.groupId)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(211, 47, 47, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
