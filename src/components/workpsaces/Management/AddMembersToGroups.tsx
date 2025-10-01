import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  Avatar,
  Button,
  Typography,
  Divider,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Badge,
  Fade,
  Skeleton,
  Stack,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import axiosInstance from "../../../api/axiosInstance";

interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  groupId: string | null;
  setSuccess: (msg: string | null) => void;
  setError: (msg: string | null) => void;
}

export default function AddMembersDialog({
  open,
  onClose,
  workspaceId,
  groupId,
  setSuccess,
  setError,
}: Props) {
  const theme = useTheme();
  const [workspaceUsers, setWorkspaceUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [existingMembers, setExistingMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkspaceUsers = async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/workspace/users/fetch/${workspaceId}`);
      if (res.data.success) {
        // console.log("Fetched users:", res.data.data);
        const extractedUsers: User[] = res.data.data.map((wu: any) => ({
          userId: wu.user.userId,
          name: wu.user.name,
          email: wu.user.email,
          role: wu.role,
          avatar: wu.user.avatar || "",
        }));
        setWorkspaceUsers(extractedUsers);
      } else {
        setError(res.data.message || "Failed to load users");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingGroupMembers = async () => {
    if (!groupId) return;
    try {
      const res = await axiosInstance.get(`/workspace/groups/${groupId}/users`);
      if (res.data.success) {
        console.log("Fetched group members:", res.data.data);
        const members = res.data.data.map((user: any) => user.userId);
        setExistingMembers(members);         
        setSelectedUsers(members);           
      } else {
        setError(res.data.message || "Failed to load group members");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch group members");
    }
  };

  useEffect(() => {
    if (open && workspaceId) {
      fetchWorkspaceUsers();
      if (groupId) {
        fetchExistingGroupMembers();
      }
    } else if (!open) {
      // Reset state when dialog closes
      setSearchQuery("");
      setSelectedUsers([]);
      setExistingMembers([]);
      setWorkspaceUsers([]);
    }
  }, [open, workspaceId, groupId]);

  const handleToggleUser = (userId: string) => {
    if (existingMembers.includes(userId)) return; 
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (!groupId) return;
    setSubmitting(true);
    try {
      
      const newMembers = selectedUsers.filter((id) => !existingMembers.includes(id));

      const res = await axiosInstance.post(`/workspace/groups/${groupId}/users/add`, {
        members: newMembers,
      });
      console.log("AddMembers response:", res);
      if (res.data.success) {
        setSuccess("Members added successfully");
        onClose();
        setSelectedUsers([]);
        setExistingMembers([]);
        setSearchQuery("");
      } else {
        setError(res.data.message || "Failed to add members");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add members");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = workspaceUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const students = filteredUsers.filter((user) => user.role === "user");
  const tutors = filteredUsers.filter((user) => user.role === "tutor");

  const newMembersCount = selectedUsers.filter((id) => !existingMembers.includes(id)).length;

  const renderSkeletons = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            mx: 1,
            mb: 1,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <ListItem>
            <ListItemAvatar>
              <Skeleton 
                variant="circular" 
                width={40} 
                height={40}
                sx={{
                  bgcolor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.grey[700], 0.3)
                    : undefined
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton 
                  variant="text" 
                  width="60%" 
                  sx={{
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.grey[700], 0.3)
                      : undefined
                  }}
                />
              }
              secondary={
                <Skeleton 
                  variant="text" 
                  width="80%"
                  sx={{
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.grey[700], 0.3)
                      : undefined
                  }}
                />
              }
            />
            <Skeleton 
              variant="rectangular" 
              width={40} 
              height={20}
              sx={{
                borderRadius: 1,
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.grey[700], 0.3)
                  : undefined
              }}
            />
          </ListItem>
        </Paper>
      ))}
    </>
  );

  const renderUserList = (users: User[], sectionTitle: string, icon: React.ReactNode) => (
    <>
      {users.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              mb: 1,
              px: 2,
            }}
          >
            {icon}
            <Typography variant="h6" color="text.primary">
              {sectionTitle}
            </Typography>
            <Chip
              label={users.length}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Divider sx={{ mb: 1 }} />
          {users.map((user) => {
            const isExisting = existingMembers.includes(user.userId);
            const isSelected = selectedUsers.includes(user.userId);
            return (
              <Fade in key={user.userId}>
                <Paper
                  elevation={0}
                  sx={{
                    mx: 1,
                    mb: 1,
                    border: 1,
                    borderColor: isSelected && !isExisting 
                      ? "primary.main" 
                      : "divider",
                    borderRadius: 2,
                    bgcolor: isExisting 
                      ? alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.15 : 0.1)
                      : isSelected 
                        ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05)
                        : "background.paper",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": !isExisting ? {
                      bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.08),
                      borderColor: "primary.light",
                      transform: "translateY(-1px)",
                      boxShadow: theme.palette.mode === 'dark' 
                        ? `0 4px 8px ${alpha(theme.palette.common.black, 0.3)}`
                        : 1,
                    } : {},
                    cursor: isExisting ? "default" : "pointer",
                  }}
                >
                  <ListItem
                    onClick={!isExisting ? () => handleToggleUser(user.userId) : undefined}
                    sx={{
                      borderRadius: 2,
                      cursor: isExisting ? "default" : "pointer",
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          isExisting ? (
                            <CheckCircleIcon
                              sx={{
                                width: 16,
                                height: 16,
                                color: "success.main",
                                bgcolor: theme.palette.background.paper,
                                borderRadius: "50%",
                                border: theme.palette.mode === 'dark'
                                  ? `1px solid ${theme.palette.success.main}`
                                  : "none",
                              }}
                            />
                          ) : null
                        }
                      >
                        <Avatar
                          src={user.avatar || undefined}
                          sx={{
                            bgcolor: isExisting 
                              ? "success.main" 
                              : isSelected 
                                ? "primary.main" 
                                : theme.palette.mode === 'dark'
                                  ? "grey.700"
                                  : "grey.400",
                            color: isExisting || isSelected
                              ? "white"
                              : theme.palette.mode === 'dark'
                                ? "grey.300"
                                : "white",
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {user.name}
                          </Typography>
                          {isExisting && (
                            <Chip 
                              label="Already added" 
                              size="small" 
                              color="success"
                              variant={theme.palette.mode === 'dark' ? "outlined" : "filled"}
                              sx={{ 
                                fontSize: "0.7rem", 
                                height: 20,
                                "& .MuiChip-label": { px: 1 },
                                bgcolor: theme.palette.mode === 'dark' 
                                  ? alpha(theme.palette.success.main, 0.15)
                                  : undefined,
                                borderColor: theme.palette.mode === 'dark'
                                  ? "success.main"
                                  : undefined,
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      }
                    />
                    <Checkbox
                      checked={isSelected}
                      disabled={isExisting}
                      color="primary"
                      sx={{
                        transform: "scale(1.1)",
                      }}
                    />
                  </ListItem>
                </Paper>
              </Fade>
            );
          })}
        </>
      )}
    </>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'dark' 
            ? `0 8px 32px ${alpha(theme.palette.common.black, 0.6)}`
            : 3,
          bgcolor: theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : "background.paper",
          border: theme.palette.mode === 'dark'
            ? `1px solid ${alpha(theme.palette.primary.main, 0.2)} `
            : "none",
          overflow: "hidden", 
          "& > *": {
            "&:first-of-type": {
              borderTopLeftRadius: "inherit",
              borderTopRightRadius: "inherit",
            },
            "&:last-child": {
              borderBottomLeftRadius: "inherit",
              borderBottomRightRadius: "inherit",
            },
          },
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.primary.main, 0.2)
            : "primary.main",
          color: theme.palette.mode === 'dark' 
            ? "primary.light" 
            : "primary.contrastText",
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 2.5,
          borderBottom: theme.palette.mode === 'dark' 
            ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
            : "none",
          borderTopLeftRadius: "inherit",
          borderTopRightRadius: "inherit",
        }}
      >
        <PersonAddIcon />
        <Box>
          <Typography variant="h6" component="div">
            Add Members to Group
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Select workspace members to add to the group
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent 
        sx={{ 
          p: 0,
          maxHeight: 500,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          bgcolor: "transparent",
          "&.MuiDialogContent-dividers": {
            bgcolor: "transparent",
            borderTop: `1px solid ${theme.palette.divider}`,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            pb: 2,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`
              : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            flexShrink: 0,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search members by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.background.paper, 0.8)
                  : "grey.50",
                "&:hover": {
                  bgcolor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.9)
                    : "grey.100",
                },
                "&.Mui-focused": {
                  bgcolor: theme.palette.mode === 'dark' 
                    ? theme.palette.background.paper
                    : "background.paper",
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}`
                    : "none",
                },
              },
            }}
          />
          
          {newMembersCount > 0 && (
            <Box sx={{ mt: 2 }}>
              <Chip
                label={`${newMembersCount} new member${newMembersCount > 1 ? 's' : ''} selected`}
                color="primary"
                variant="filled"
                icon={<GroupIcon />}
                sx={{ fontWeight: "medium" }}
              />
            </Box>
          )}
        </Box>

        <Box 
          sx={{ 
            flex: 1,
            overflow: "auto",
            minHeight: 0,
          }}
        >
          {loading ? (
            <List sx={{ px: 2 }}>
              {renderSkeletons()}
            </List>
          ) : (
            <Stack spacing={0}>
              {tutors.length > 0 && renderUserList(tutors, "Tutors", <SchoolIcon color="primary" />)}
              {students.length > 0 && renderUserList(students, "Students", <GroupIcon color="primary" />)}
              
              {filteredUsers.length === 0 && !loading && (
                <Box 
                  sx={{ 
                    p: 4, 
                    textAlign: "center",
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.background.paper, 0.3)
                      : "grey.50",
                    mx: 2,
                    borderRadius: 2,
                    border: `1px dashed ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {searchQuery ? "No members found matching your search" : "No members available"}
                  </Typography>
                  {searchQuery && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Try adjusting your search terms
                    </Typography>
                  )}
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3, 
        bgcolor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.5)
          : "grey.50", 
        gap: 1,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottomLeftRadius: "inherit",
        borderBottomRightRadius: "inherit",
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleAddMembers}
          loading={submitting}
          disabled={newMembersCount === 0}
          startIcon={<PersonAddIcon />}
          sx={{ 
            borderRadius: 2,
            minWidth: 140,
          }}
        >
          Add {newMembersCount > 0 ? `${newMembersCount} ` : ""}Member{newMembersCount !== 1 ? "s" : ""}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
