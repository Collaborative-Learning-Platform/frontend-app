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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Groups as GroupsIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import axiosInstance from "../../../api/axiosInstance";
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
}

export default function GroupsPanel({
  workspaceId,
  groups,
  setGroups,
  setError,
  setSuccess,
}: Props) {
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [openAddMembers, setOpenAddMembers] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const theme = useTheme();
  useMediaQuery(theme.breakpoints.down("sm"));

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) {
      setError("Group name is required");
      return;
    }
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
        setSuccess("Group created successfully");
      } else {
        setError(res.data.message || "Failed to create group");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create group");
    }
  };

  const handleOpenAddMembers = (groupId: string) => {
    setSelectedGroupId(groupId);
    setOpenAddMembers(true);
  }



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
              startIcon={<AddIcon />}
              onClick={handleCreateGroup}
              disabled={!newGroup.name.trim()}
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
              Create
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
        
        {mainGroups.length === 0 ? (
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
                      onClick={() => handleDeleteGroup(group.groupId)}
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
      {customGroups.length > 0 && (
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
                      onClick={() => handleDeleteGroup(group.groupId)}
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
    </Box>
    
  );
}
