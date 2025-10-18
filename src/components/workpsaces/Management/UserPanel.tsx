import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Alert,
  Snackbar,
  Skeleton,
  CircularProgress,
  alpha,
  Paper,
  Chip,
} from "@mui/material";
import { 
  Delete, 
  UploadFile,
  CloudUpload,
  CheckCircle,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  Warning,
  PersonAdd,
  Email,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import { motion } from "framer-motion";
import axiosInstance from "../../../api/axiosInstance";


interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  avatar?: string;
}

interface FailedUser {
  email: string;
  reason: string;
}

interface UploadSummary {
  total: number;
  added: number;
  existing: number;
  failed: number;
  successfulUsers?: string[];
  failedUsers?: FailedUser[];
  existingUsers?: string[];
}

interface Props {
  workspaceId: string;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  loading?: boolean;
}

export default function UsersPanel({ workspaceId, users, setUsers, loading = false }: Props) {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [summary, setSummary] = useState<UploadSummary | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = [".csv", ".xlsx", ".xls"];
      const fileExtension = file.name
        .toLowerCase()
        .substr(file.name.lastIndexOf("."));

      if (allowedTypes.includes(fileExtension)) {
        setSelectedFile(file);
        setSummary(null);
        setSuccessMsg(`File "${file.name}" selected successfully`);
      } else {
        setErrorMsg("Please upload a valid file type: CSV or Excel (.xlsx, .xls)");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type
      const allowedTypes = [".csv", ".xlsx", ".xls"];
      const fileExtension = file.name
        .toLowerCase()
        .substr(file.name.lastIndexOf("."));

      if (allowedTypes.includes(fileExtension)) {
        setSelectedFile(file);
        setSummary(null);
        setSuccessMsg(`File "${file.name}" selected successfully`);
      } else {
        setErrorMsg("Please upload a valid file type: CSV or Excel (.xlsx, .xls)");
      }
    }
  };

  const handleRemoveFile = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedFile(null);
    setSuccessMsg("File removed");
  };

  const handleUploadAreaClick = (event: React.MouseEvent) => {
    if (selectedFile) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const setS3ProfilePictureDownloadURL = async (userId: string) => {
    try {
      const response = await axiosInstance.post('/storage/generate-profile-pic-download-url',{userId: userId})
      return response.data.downloadUrl;
    } catch (error) {
      console.error("Error generating profile pic download URL", error);
      return null;
    }
  }

  // Function to load S3 profile pictures for all users
  const loadUserProfilePictures = async () => {
    try {
      const updatedUsers = await Promise.all(
        users.map(async (user) => {
          const s3Url = await setS3ProfilePictureDownloadURL(user.userId);
          return {
            ...user,
            avatar: s3Url || user.avatar 
          };
        })
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error loading profile pictures:", error);
    }
  };

  // Load profile pictures when users list changes
  React.useEffect(() => {
    if (users.length > 0) {
      loadUserProfilePictures();
    }
  }, [users.length]); // Only trigger when the number of users changes


  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMsg("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setSummary(null);
    setSuccessMsg("Starting file upload...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axiosInstance.post(
        `/workspace/users/BulkAddition/${workspaceId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Upload response:", response.data);
      const data = response.data.data;

      if (response.data.success) {
        setSuccessMsg("Users uploaded successfully.");

        const newlyAddedUsers = data.results
          .filter((r: any) => r.success)
          .map((r: any) => ({
            userId: r.userId,
            name: r.name || "Unknown",
            email: r.email || "",
            role: r.role,
            joinedAt: new Date().toISOString(),
            avatar: "", 
          }));

        // Load profile pictures for newly added users
        const usersWithProfilePics = await Promise.all(
          newlyAddedUsers.map(async (user: User) => {
            const s3Url = await setS3ProfilePictureDownloadURL(user.userId);
            return {
              ...user,
              avatar: s3Url || user.avatar
            };
          })
        );

        setUsers([...users, ...usersWithProfilePics]);

        // Extract detailed user lists - API returns them directly
        const successfulUsers = (data.results || [])
          .filter((r: any) => r.success)
          .map((r: any) => r.email);
        
        const failedUsers = (data.failedUsers || []).map((user: any) => ({
          email: user.email,
          reason: user.error || user.message || "Unknown error"
        }));
        
        const existingUsers = (data.existingUsers || []).map((user: any) => user.email);

        console.log("Extracted lists:", {
          successfulUsers,
          failedUsers,
          existingUsers,
          summary: data.summary
        });

        setSummary({
          total: data.summary.total,
          added: data.summary.added,
          existing: data.summary.existing,
          failed: data.summary.failed,
          successfulUsers: successfulUsers,
          failedUsers: failedUsers,
          existingUsers: existingUsers,
        });
      } else {
        setErrorMsg(data.message || "Failed to upload users.");
      }

      setSelectedFile(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || "Failed to upload users.";
      setErrorMsg(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axiosInstance.delete(`/workspaces/${workspaceId}/users/${userId}`);
      setUsers(users.filter((user) => user.userId !== userId));
      setSuccessMsg("User removed successfully.");
    } catch (error) {
      setErrorMsg("Failed to remove user.");
    }
  };

  // Debug logging
  React.useEffect(() => {
    if (summary) {
      console.log("Summary state updated:", summary);
    }
  }, [summary]);

  return (
    <Box>
      {/* Upload Card */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: theme.shadows[4] }}>
        <CardHeader 
          avatar={<UploadFile color="primary" />}
          title="Add Users" 
          subheader="Upload CSV or Excel file to add multiple users at once"
          sx={{
            "& .MuiCardHeader-title": {
              fontWeight: "bold",
            },
          }}
        />
        <CardContent>
          <label
            htmlFor={selectedFile ? undefined : "file-upload"}
            style={{
              display: "block",
              cursor: selectedFile ? "default" : "pointer",
            }}
            onClick={handleUploadAreaClick}
          >
            <Box
              sx={{
                border: `2px dashed`,
                borderColor: isDragOver
                  ? theme.palette.primary.main
                  : selectedFile
                  ? theme.palette.success.main
                  : theme.palette.grey[300],
                borderRadius: 3,
                p: theme.spacing(4),
                textAlign: "center",
                transition: theme.transitions.create(
                  ["border-color", "background-color"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                width: "100%",
                boxSizing: "border-box",
                display: "block",
                backgroundColor: isDragOver
                  ? alpha(theme.palette.primary.main, 0.08)
                  : selectedFile
                  ? alpha(theme.palette.success.main, 0.04)
                  : "transparent",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(
                    theme.palette.primary.main,
                    0.02
                  ),
                },
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                style={visuallyHidden}
                accept=".csv,.xlsx,.xls"
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: theme.spacing(2),
                }}
              >
                {selectedFile ? (
                  // Show uploaded file details
                  <Box>
                    <CheckCircle
                      sx={{
                        fontSize: theme.spacing(6),
                        color: "success.main",
                      }}
                    />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color="success.main"
                      >
                        File uploaded successfully!
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: theme.spacing(1) }}
                      >
                        {selectedFile.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatFileSize(selectedFile.size)}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={handleRemoveFile}
                      color="error"
                      sx={{ mt: theme.spacing(1) }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  // Show upload prompt
                  <Box>
                    <CloudUpload
                      sx={{
                        fontSize: theme.spacing(6),
                        color: "text.secondary",
                      }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Click to upload or drag and drop
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        CSV, Excel (.xlsx, .xls) - max 10MB
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </label>

          {/* Upload Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            startIcon={
              uploading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CloudUpload />
              )
            }
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                backgroundColor:
                  theme.palette.action.disabledBackground,
              },
            }}
          >
            {uploading ? "Uploading Users..." : "Upload Users"}
          </Button>
        </CardContent>
      </Card>

      {/* Summary Card */}
      {summary && (
        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          {/* Successful Users Card */}
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.05)})`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    Added
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  {summary.added}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users added successfully
                </Typography>
              </Paper>
            </motion.div>
          </Box>

          {/* Failed Users Card */}
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)}, ${alpha(theme.palette.error.main, 0.05)})`,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ErrorIcon sx={{ color: 'error.main', mr: 1 }} />
                  <Typography variant="h6" color="error.main" fontWeight="bold">
                    Failed
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color="error.main">
                  {summary.failed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users failed to add
                </Typography>
              </Paper>
            </motion.div>
          </Box>

          {/* Existing Users Card */}
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.05)})`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Warning sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    Existing
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color="warning.main">
                  {summary.existing}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users already exist
                </Typography>
              </Paper>
            </motion.div>
          </Box>
        </Box>
      )}

      {/* Detailed User Lists */}
      {summary && (
        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Successful Users */}
          {summary.successfulUsers && summary.successfulUsers.length > 0 && (
            <Box sx={{ flex: 1, minWidth: '300px' }}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardHeader
                  avatar={<CheckCircle color="success" />}
                  title="Successfully Added Users"
                  subheader={`${summary.successfulUsers.length} users`}
                  action={
                    <Chip
                      label={summary.added}
                      color="success"
                      size="small"
                    />
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {summary.successfulUsers.map((email, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.success.main, width: 32, height: 32 }}>
                            <PersonAdd sx={{ fontSize: 16 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={email}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 'medium'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Failed Users */}
          {summary.failedUsers && summary.failedUsers.length > 0 && (
            <Box sx={{ flex: 1, minWidth: '300px' }}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardHeader
                  avatar={<ErrorIcon color="error" />}
                  title="Failed to Add Users"
                  subheader={`${summary.failedUsers.length} users`}
                  action={
                    <Chip
                      label={summary.failed}
                      color="error"
                      size="small"
                    />
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {summary.failedUsers.map((failedUser, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.error.main, width: 32, height: 32 }}>
                            <Email sx={{ fontSize: 16 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={failedUser.email}
                          secondary={failedUser.reason}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 'medium'
                          }}
                          secondaryTypographyProps={{
                            variant: 'caption',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Existing Users */}
          {summary.existingUsers && summary.existingUsers.length > 0 && (
            <Box sx={{ flex: 1, minWidth: '300px' }}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardHeader
                  avatar={<Warning color="warning" />}
                  title="Already Existing Users"
                  subheader={`${summary.existingUsers.length} users`}
                  action={
                    <Chip
                      label={summary.existing}
                      color="warning"
                      size="small"
                    />
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {summary.existingUsers.map((email, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 32, height: 32 }}>
                            <Email sx={{ fontSize: 16 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={email}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 'medium'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      )}

      {/* Users List */}
      <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
        <CardHeader 
          title="Workspace Users" 
          subheader={`Total: ${users.length} user${users.length !== 1 ? 's' : ''}`}
          sx={{
            "& .MuiCardHeader-title": {
              fontWeight: "bold",
            },
          }}
        />
        <CardContent>
          <List>
            {loading ? (
              // Loading skeleton for users
              Array.from({ length: 5 }).map((_, index) => (
                <ListItem 
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" disabled>
                      <Skeleton variant="circular" width={24} height={24} />
                    </IconButton>
                  }
                  sx={{
                    py: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    mb: 1,
                    background: `${theme.palette.background.paper}`,
                  }}
                >
                  <ListItemAvatar>
                    <Skeleton 
                      variant="circular" 
                      width={40} 
                      height={40}
                      animation="wave"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Skeleton 
                        variant="text" 
                        width={`${Math.random() * 30 + 40}%`} 
                        height={24} 
                        sx={{ mb: 0.5 }}
                        animation="wave"
                      />
                    }
                    secondary={
                      <Skeleton 
                        variant="text" 
                        width={`${Math.random() * 40 + 50}%`} 
                        height={20}
                        animation="wave"
                      />
                    }
                  />
                </ListItem>
              ))
            ) : users.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No users in this workspace yet.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Upload a CSV file to add users.
                </Typography>
              </Box>
            ) : (
              users.map((user) => (
                <ListItem
                  key={user.userId}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteUser(user.userId)}
                      sx={{
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  }
                  sx={{
                    py: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    mb: 1,
                    background: `${theme.palette.background.paper}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: theme.palette.primary.main,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={user.avatar} sx={{ width: 40, height: 40 }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight="medium" component="span">
                          {user.name}
                        </Typography>
                        <Chip 
                          label={user.role} 
                          size="small" 
                          sx={{ 
                            ml: 1, 
                            height: 20,
                            fontSize: '0.75rem',
                            textTransform: 'capitalize'
                          }} 
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {user.email} • Joined: {new Date(user.joinedAt).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </CardContent>
      </Card>

      {/* Snackbar for Success */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>

      {/* Snackbar for Error */}
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
