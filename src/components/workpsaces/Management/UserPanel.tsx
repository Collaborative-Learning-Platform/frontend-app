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
} from "@mui/material";
import { Clear, Delete, UploadFile } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import axiosInstance from "../../../api/axiosInstance";


interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  avatar?: string;
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setSelectedFile(event.target.files[0]);
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

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axiosInstance.post(
        `/workspace/users/BulkAddition/${workspaceId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

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

        setSummary({
          total: data.summary.total,
          added: data.summary.added,
          existing: data.summary.existing,
          failed: data.summary.failed,
        });
      } else {
        setErrorMsg(data.message || "Failed to upload users.");
      }

      setSelectedFile(null);
    } catch (error: any) {
      console.error(error);
      setErrorMsg("Failed to upload users.");
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

  const chartData = summary
    ? [
        { name: "Added", value: summary.added, color: theme.palette.success.main },
        { name: "Existing", value: summary.existing, color: theme.palette.info.main },
        { name: "Failed", value: summary.failed, color: theme.palette.error.main },
      ]
    : [];

  const DarkTooltip = ({ active, payload, label }: any) => {
  if (active ) {
    return (
      <Box
        sx={{
          backgroundColor: "#121212", 
          color: "#fff",
          padding: "8px 12px",
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
          fontSize: 14,
        }}
      >
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="body2">{`Users: ${payload[0].value}`}</Typography>
      </Box>
    );
  }
    return null;
  };    

  return (
    <Box>
      {/* Upload Card */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Add Users" />
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button variant="outlined" component="label">
              Choose File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </Button>
            {selectedFile && (
              <>
                <Typography variant="body2">{selectedFile.name}</Typography>
                <IconButton onClick={() => setSelectedFile(null)} size="small">
                  <Clear />
                </IconButton>
              </>
            )}
            <Button
              onClick={handleUpload}
              variant="contained"
              disabled={!selectedFile}
              startIcon={<UploadFile />}
            >
              Upload
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Summary Card */}
      {summary && (
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Upload Summary" />
          <CardContent>
            <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
              {["added", "existing", "failed"].map((key) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {summary[key]}
                  </Typography>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total: {summary.total}
                </Typography>
              </motion.div>
            </Box>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="value"  fill={theme.palette.primary.main} fillOpacity={1}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color}
                     />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Users
      </Typography>
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
                border: `1px solid transparent`,
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
        ) : (
          users.map((user) => (
            <ListItem
              key={user.userId}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteUser(user.userId)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={user.avatar}>{user.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${user.name} (${user.role})`}
                secondary={`${user.email} - Joined: ${new Date(
                  user.joinedAt
                ).toLocaleDateString()}`}
              />
            </ListItem>
          ))
        )}
      </List>

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
