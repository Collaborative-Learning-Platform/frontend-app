import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Skeleton, Card, CardContent } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import GroupCard from "../components/workpsaces/GroupCard";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { gridTemplateColumnsStyles } from "../styles/pages/workspace";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/Authcontext";
import { useSnackbar } from "../contexts/SnackbarContext";

interface Group {
  groupId: string;
  name: string;
  description: string;
  type: "Main" | "Custom";
  createdAt: string;
  memberCount?: number;
}

//This page is for students to view all groups in a workspace
const WorkspacePage = () => {
  const { workspaceId, workspaceName } = useParams<{ workspaceId: string, workspaceName: string }>();
  const navigate = useNavigate();
  const { user_id } = useAuth();

  const [mainGroups, setMainGroups] = useState<Group[]>([]);
  const [otherGroups, setOtherGroups] = useState<Group[]>([]);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  
  const { showSnackbar } = useSnackbar();
  

  useEffect(() => {
    const fetchWorkspace = async (userId: string, workspaceId: string) => {
      try {
        setLoading(true);
        const response = await axiosInstance.post(`/workspace/groups/fetchByUserId`, {
          userId,
          workspaceId,
        });

        console.log("Fetched workspace data:", response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          const groups: Group[] = response.data.data;

          // Split groups by type
          setMainGroups(groups.filter((g) => g.type === "Main"));
          setOtherGroups(groups.filter((g) => g.type === "Custom"));
        }
      } catch (error) {
        console.error("Error fetching workspace data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId && user_id) fetchWorkspace(user_id, workspaceId);
  }, [workspaceId, user_id]);

  const handleClick = (groupId: string | number) => {
    navigate(`/workspace/${workspaceId}/group/${groupId}`);
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) {
      showSnackbar("Group name is required", "error");
      return;
    }
    try {
      const response = await axiosInstance.post(`/workspace/groups/customGroup/create`, {
        workspaceId,
        name: newGroup.name,
        description: newGroup.description,
        type: "Custom",
      });

      if (response.data.success) {
        console.log(response.data);
        const newGroupData = response.data.data;
        setOtherGroups(prev => [...prev, newGroupData]);
        setNewGroup({ name: "", description: "" });
        setCreateGroupOpen(false);
        showSnackbar("Group created successfully", "success");
      } else {
        showSnackbar(response.data.message || "Failed to create group", "error");
      }
    } catch (error: any) {
      showSnackbar(error?.response?.data?.message || "Failed to create group", "error");
    }
  };

  const handleCloseDialog = () => {
    setCreateGroupOpen(false);
    setNewGroup({ name: "", description: "" });
  };

  // Skeleton component for loading state
  const GroupCardSkeleton = () => (
    <Card sx={{ height: '200px' }}>
      <CardContent>
        <Skeleton variant="text" width="80%" height={32} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        {workspaceName}
      </Typography>

      {/* Main groups */}
      <Box mb={4}>
        <Typography variant="h6" mb={1}>
          Main groups
        </Typography>
        <Box display="grid" gap={2} sx={gridTemplateColumnsStyles}>
          {loading ? (
            // Show skeleton loading
            Array.from({ length: 3 }).map((_, index) => (
              <GroupCardSkeleton key={`main-skeleton-${index}`} />
            ))
          ) : (
            mainGroups.map((group) => (
              <GroupCard
                key={group.groupId}
                id={group.groupId}
                name={group.name}
                memberCount={group.memberCount}
                type="main"
                onClick={handleClick}
                footerSlot={
                  <Typography variant="caption" color="text.secondary">
                    {group.description || "No description"}
                  </Typography>
                }
              />
            ))
          )}
        </Box>
      </Box>

      {/* Other groups */}
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            Other groups
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateGroupOpen(true)}
            size="small"
            disabled={loading}
          >
            Create Group
          </Button>
        </Box>
        <Box display="grid" gap={2} sx={gridTemplateColumnsStyles}>
          {loading ? (
            // Show skeleton loading
            Array.from({ length: 2 }).map((_, index) => (
              <GroupCardSkeleton key={`other-skeleton-${index}`} />
            ))
          ) : (
            otherGroups.map((group) => (
              <GroupCard
                key={group.groupId}
                id={group.groupId}
                name={group.name}
                memberCount={group.memberCount}
                type="other"
                onClick={handleClick}
                footerSlot={
                  <Typography variant="caption" color="text.secondary">
                    {group.description || "No description"}
                  </Typography>
                }
              />
            ))
          )}
        </Box>
      </Box>

      {/* Create Group Dialog */}
      <Dialog open={createGroupOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Study Groups</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            variant="outlined"
            value={newGroup.name}
            onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newGroup.description}
            onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateGroup} variant="contained">
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkspacePage;
