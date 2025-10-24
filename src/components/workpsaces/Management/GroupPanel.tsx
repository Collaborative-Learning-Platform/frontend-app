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
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Groups as GroupsIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import axiosInstance from "../../../api/axiosInstance";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import AddMembersDialog from "./AddMembersToGroups";

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
  loading?: boolean;
}

export default function GroupsPanel({
  workspaceId,
  groups,
  setGroups,
  setError,
  setSuccess,
  loading = false,
}: Props) {
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [openAddMembers, setOpenAddMembers] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const theme = useTheme();
  useMediaQuery(theme.breakpoints.down("sm"));
  const { showSnackbar } = useSnackbar();

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) {
      showSnackbar("Group name is required", "error");
      return;
    }

    setIsCreating(true);
    try {
      const res = await axiosInstance.post(`/workspace/groups/createGroup`, {
        workspaceId,
        name: newGroup.name,
        description: newGroup.description,
        type: "Main",
      });
      if (res.data.success) {
        setGroups((prev) => [...prev, res.data.data]);
        setNewGroup({ name: "", description: "" });
        showSnackbar("Group created successfully", "success");
      } else {
        showSnackbar(res.data.message || "Failed to create group", "error");
      }
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || "Failed to create group", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenAddMembers = (groupId: string) => {
    setSelectedGroupId(groupId);
    setOpenAddMembers(true);
  }

  const handleDeleteClick = (groupId: string, groupName: string) => {
    setGroupToDelete({ id: groupId, name: groupName });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!groupToDelete) return;
    
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`workspace/groups/${groupToDelete.id}/delete`);
      setGroups((prev) => prev.filter((g) => g.groupId !== groupToDelete.id));
      showSnackbar("Group deleted successfully", "success");
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || "Failed to delete group", "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setGroupToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    if (isDeleting) return; 
    setDeleteConfirmOpen(false);
    setGroupToDelete(null);
  };

  const mainGroups = groups.filter((group) => group.type === "Main");
  const customGroups = groups.filter((group) => group.type === "Custom");

  return (
    <Box sx={{ mt: 4 }}>
      {/* Create Group */}
      <Card
        elevation={0}
        sx={{
          // background: `linear-gradient(135deg, ${theme.palette.primary.main}0A 0%, ${theme.palette.secondary.main}0A 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          mb: 4,
          overflow: "visible",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            // background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            borderRadius: "12px 12px 0 0",
          }
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              <AddIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
                Create New Group
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build collaborative learning spaces for your students
              </Typography>
            </Box>
          </Stack>
          
          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" }, 
            gap: 3 
          }}>
            <TextField
              label="Group Name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              required
              fullWidth
              variant="outlined"
              sx={{
                flex: { md: "2" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              label="Description (Optional)"
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{
                flex: { md: "2" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
              onClick={handleCreateGroup}
              disabled={isCreating || !newGroup.name.trim()}
              sx={{
                height: 56,
                borderRadius: 2,
                flex: { md: "1" },
                minWidth: { xs: "100%", md: 120 },
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 6px 25px ${theme.palette.primary.main}60`,
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  background: theme.palette.action.disabledBackground,
                  boxShadow: "none",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Existing Main Groups */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Main Groups
          </Typography>
          <Chip 
            label={mainGroups.length} 
            size="small"
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              color: "white",
              fontWeight: 600
            }}
          />
        </Stack>
        
        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(320px, 1fr))",
                lg: "repeat(auto-fill, minmax(350px, 1fr))",
              },
              gap: 3,
            }}
          >
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                elevation={0}
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}06 100%)`,
                  overflow: "hidden",
                  minHeight: 220,
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                  {/* Header with avatar and title */}
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <Skeleton 
                        variant="circular" 
                        width={48} 
                        height={48} 
                        sx={{ mr: 2 }}
                        animation="wave"
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton 
                          variant="text" 
                          width="75%" 
                          height={32} 
                          sx={{ mb: 0.5 }} 
                          animation="wave"
                        />
                        <Skeleton 
                          variant="rectangular" 
                          width={90} 
                          height={24} 
                          sx={{ borderRadius: 1.5 }} 
                          animation="wave"
                        />
                      </Box>
                    </Box>
                    <Skeleton 
                      variant="circular" 
                      width={32} 
                      height={32}
                      animation="wave"
                    />
                  </Box>

                  {/* Description */}
                  <Box sx={{ flexGrow: 1, mb: 3 }}>
                    <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} animation="wave" />
                    <Skeleton variant="text" width="85%" height={20} sx={{ mb: 0.5 }} animation="wave" />
                    <Skeleton variant="text" width="70%" height={20} animation="wave" />
                  </Box>

                  {/* Footer */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Skeleton variant="text" width="45%" height={20} />
                    <Skeleton 
                      variant="rectangular" 
                      width={70} 
                      height={36} 
                      sx={{ borderRadius: 1 }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : mainGroups.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              textAlign: "center",
              py: 8,
              px: 4,
              borderRadius: 3,
              border: `2px dashed ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}08 0%, transparent 70%)`,
              }
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 3,
                  backgroundColor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                }}
              >
                <GroupsIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                No main groups yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
                Main groups are the foundation of your workspace. Create your first group above to start organizing your students into collaborative learning spaces.
              </Typography>
            </Box>
          </Card>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(320px, 1fr))",
                lg: "repeat(auto-fill, minmax(350px, 1fr))",
              },
              gap: 3,
            }}
          >
            {mainGroups.map((group) => (
              <Card
                key={group.groupId}
                elevation={0}
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}06 100%)`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 40px ${theme.palette.primary.main}20`,
                    border: `1px solid ${theme.palette.primary.main}40`,
                  },
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <GroupIcon />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          fontWeight={600} 
                          sx={{ 
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {group.name}
                        </Typography>
                        <Chip
                          size="small"
                          label="Main Group"
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            fontSize: "0.75rem",
                            height: 20,
                          }}
                        />
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenAddMembers(group.groupId)}
                      sx={{
                        backgroundColor: `${theme.palette.primary.main}15`,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: `${theme.palette.primary.main}25`,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <PersonAddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      flexGrow: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.5,
                    }}
                  >
                    {group.description || "No description provided for this group."}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: "flex", 
                        alignItems: "center",
                        fontWeight: 500,
                      }}
                    >
                      Created {new Date(group.createdAt).toLocaleDateString()}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(group.groupId, group.name)}
                      sx={{
                        color: theme.palette.error.main,
                        "&:hover": {
                          backgroundColor: `${theme.palette.error.main}15`,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Student Created Custom Groups */}
      {(loading || customGroups.length > 0) && (
        <Box sx={{ mt: 6 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              Student Groups
            </Typography>
            <Chip 
              label={customGroups.length} 
              size="small"
              sx={{ 
                backgroundColor: theme.palette.secondary.main,
                color: "white",
                fontWeight: 600
              }}
            />
          </Stack>
          
          {loading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(auto-fill, minmax(320px, 1fr))",
                  lg: "repeat(auto-fill, minmax(350px, 1fr))",
                },
                gap: 3,
              }}
            >
              {[1, 2].map((item) => (
                <Card
                  key={item}
                  elevation={0}
                  sx={{
                    position: "relative",
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.secondary.main}06 100%)`,
                    overflow: "hidden",
                    minHeight: 220,
                  }}
                >
                  <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                    {/* Header with avatar and title */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                        <Skeleton 
                          variant="circular" 
                          width={48} 
                          height={48} 
                          sx={{ mr: 2 }}
                          animation="wave"
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Skeleton 
                            variant="text" 
                            width="70%" 
                            height={32} 
                            sx={{ mb: 0.5 }} 
                          />
                          <Skeleton 
                            variant="rectangular" 
                            width={110} 
                            height={24} 
                            sx={{ borderRadius: 1.5 }} 
                          />
                        </Box>
                      </Box>
                      <Skeleton 
                        variant="circular" 
                        width={32} 
                        height={32}
                      />
                    </Box>

                    {/* Description */}
                    <Box sx={{ flexGrow: 1, mb: 3 }}>
                      <Skeleton variant="text" width="95%" height={20} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="65%" height={20} />
                    </Box>

                    {/* Footer */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Skeleton variant="text" width="50%" height={20} />
                      <Skeleton 
                        variant="circular" 
                        width={32} 
                        height={32}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(auto-fill, minmax(320px, 1fr))",
                  lg: "repeat(auto-fill, minmax(350px, 1fr))",
                },
                gap: 3,
              }}
            >
              {customGroups.map((group) => (
              <Card
                key={group.groupId}
                elevation={0}
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.secondary.main}06 100%)`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 40px ${theme.palette.secondary.main}20`,
                    border: `1px solid ${theme.palette.secondary.main}40`,
                  },
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.secondary.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <GroupIcon />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          fontWeight={600} 
                          sx={{ 
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {group.name}
                        </Typography>
                        <Chip
                          size="small"
                          label="Student Group"
                          sx={{
                            backgroundColor: theme.palette.secondary.main,
                            color: "white",
                            fontSize: "0.75rem",
                            height: 20,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      flexGrow: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.5,
                    }}
                  >
                    {group.description || "No description provided for this student group."}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: "flex", 
                        alignItems: "center",
                        fontWeight: 500,
                      }}
                    >
                      Created {new Date(group.createdAt).toLocaleDateString()}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(group.groupId, group.name)}
                      sx={{
                        color: theme.palette.error.main,
                        "&:hover": {
                          backgroundColor: `${theme.palette.error.main}15`,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
            </Box>
          )}
        </Box>
      )}
      <AddMembersDialog
          open={openAddMembers}
          onClose={() => setOpenAddMembers(false)}
          workspaceId={workspaceId}
          groupId={selectedGroupId}
          setSuccess={setSuccess}
          setError={setError}
        />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        disableEscapeKeyDown={isDeleting}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 8px 40px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)'}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          fontWeight: 600,
          fontSize: '1.25rem'
        }}>
          Confirm Group Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ 
            color: theme.palette.text.primary,
            fontSize: '1rem',
            lineHeight: 1.6
          }}>
            Are you sure you want to delete the group <strong>"{groupToDelete?.name}"</strong>?
            <br />
            <br />
            This action cannot be undone. All group data, including members, discussions, and shared resources will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            variant="outlined"
            disabled={isDeleting}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 100
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 120,
              background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
              boxShadow: `0 4px 15px ${theme.palette.error.main}40`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                boxShadow: `0 6px 20px ${theme.palette.error.main}60`,
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
                boxShadow: 'none',
                transform: 'none',
              }
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Group'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    
  );
}
