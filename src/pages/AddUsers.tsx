import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip,
  Paper,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import {
  CloudUpload,
  Description,
  CheckCircle,
  Error,
  Info,
  ArrowBack,
  FileUpload,
  Delete as DeleteIcon,
  GroupAdd,
  People,
  PersonAdd,
  Warning,
  Email,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { visuallyHidden } from "@mui/utils";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

interface FailedUser {
  email: string;
  reason: string;
}

interface BulkUploadResponse {
  success: boolean;
  message: string;
  successCount: number;
  failedCount: number;
  existingCount: number;
  failedUsers: FailedUser[];
  existingUsers: string[];
  successfulUsers: string[];
}

const AddUsers = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<BulkUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const theme = useTheme();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResponse(null);
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
        setError(null);
        setResponse(null);
      } else {
        setError("Please upload a valid file type: CSV or Excel (.xlsx, .xls)");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }
    setUploading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axiosInstance.post("/auth/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      const data = res.data;
      if (!data.success) {
        setError(data.error || "Bulk Addition failed");
      } else {
        setResponse(data);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.error?.message ||
          "Network error. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedFile(null);
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[2],
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <People sx={{ fontSize: 40, color: "primary.main" }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Bulk User Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Upload CSV or Excel files to add multiple users at once
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Instructions Card  */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
          }}
        >
          <CardHeader
            avatar={<Info color="primary" />}
            title="File Requirements"
            subheader="Follow these guidelines for successful upload"
            sx={{
              "& .MuiCardHeader-title": {
                fontWeight: "bold",
              },
            }}
          />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                  Required Columns
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  name, email, role, password
                </Typography>
              </Box>
              
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                  Valid Roles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  admin, tutor, user
                </Typography>
              </Box>
              
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                  File Formats
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CSV, Excel (.xlsx, .xls)
                </Typography>
              </Box>
              
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                  File Size Limit
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Maximum 10MB per file
                </Typography>
              </Box>
              
              <Box sx={{ flex: '1 1 200px', minWidth: '200px', display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Description />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  Download Template
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Main Upload Section */}
        <Box>
            {/* File Upload Card */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: theme.shadows[4] }}>
              <CardHeader
                avatar={<FileUpload color="primary" />}
                title="Upload User Data"
                subheader="Upload the CSV or Excel file containing user information"
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
                      borderRadius: theme.shape.borderRadius,
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
              </CardContent>
            </Card>

            {/* Upload Settings Card */}
            <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
              <CardHeader
                avatar={<GroupAdd color="primary" />}
                title="Upload Settings"
                subheader="Configure your bulk upload preferences"
                sx={{
                  "& .MuiCardHeader-title": {
                    fontWeight: "bold",
                  },
                }}
              />
              <CardContent>
                <Stack gap={3}>
                  {/* Status Messages */}
                  <Fade in={!!error} timeout={300}>
                    <Box>
                      {error && (
                        <Alert
                          severity="error"
                          icon={<Error />}
                          onClose={() => setError(null)}
                          sx={{ borderRadius: 2 }}
                        >
                          {error}
                        </Alert>
                      )}
                    </Box>
                  </Fade>

                  <Fade in={!!response} timeout={300}>
                    <Box>
                      {response && (
                        <Alert
                          severity="success"
                          icon={<CheckCircle />}
                          sx={{ borderRadius: 2 }}
                        >
                          {response.message}
                        </Alert>
                      )}
                    </Box>
                  </Fade>

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
                </Stack>
              </CardContent>
            </Card>

            {/* Results Display */}
            {response && (
              <Fade in={!!response} timeout={500}>
                <Box sx={{ mt: 3 }}>
                  {(() => {
                    // Calculate actual counts from arrays to handle discrepancies
                    const actualSuccessCount = response.successfulUsers?.length || response.successCount || 0;
                    const actualFailedCount = response.failedUsers?.length || response.failedCount || 0;
                    const actualExistingCount = response.existingUsers?.length || response.existingCount || 0;
                    
                    return (
                      <>
                        {/* Statistics Overview Cards */}
                        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
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
                            Successful
                          </Typography>
                        </Box>
                        <Typography variant="h3" fontWeight="bold" color="success.main">
                          {actualSuccessCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Users added successfully
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)}, ${alpha(theme.palette.error.main, 0.05)})`,
                          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Error sx={{ color: 'error.main', mr: 1 }} />
                          <Typography variant="h6" color="error.main" fontWeight="bold">
                            Failed
                          </Typography>
                        </Box>
                        <Typography variant="h3" fontWeight="bold" color="error.main">
                          {actualFailedCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Users failed to add
                        </Typography>
                      </Paper>
                    </Box>

                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
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
                          {actualExistingCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Users already exist
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>

                        {/* Charts Section */}
                        {(actualSuccessCount + actualFailedCount + actualExistingCount) > 0 && (
                    <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <Card sx={{ borderRadius: 2, height: '100%' }}>
                          <CardHeader
                            title="Upload Results Distribution"
                            subheader="Visual breakdown of upload results"
                          />
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Successful', value: actualSuccessCount, color: theme.palette.success.main },
                                    { name: 'Failed', value: actualFailedCount, color: theme.palette.error.main },
                                    { name: 'Existing', value: actualExistingCount, color: theme.palette.warning.main }
                                  ].filter(item => item.value > 0)}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={120}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {[
                                    { name: 'Successful', value: actualSuccessCount, color: theme.palette.success.main },
                                    { name: 'Failed', value: actualFailedCount, color: theme.palette.error.main },
                                    { name: 'Existing', value: actualExistingCount, color: theme.palette.warning.main }
                                  ].filter(item => item.value > 0).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </Box>

                    <Box sx={{ flex: 1 }}>
                      <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardHeader
                          title="Results Summary"
                          subheader="Detailed statistics comparison"
                        />
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={[
                                { category: 'Successful', count: actualSuccessCount, color: theme.palette.success.main },
                                { category: 'Failed', count: actualFailedCount, color: theme.palette.error.main },
                                { category: 'Existing', count: actualExistingCount, color: theme.palette.warning.main }
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="category" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {[
                                  { category: 'Successful', count: actualSuccessCount, color: theme.palette.success.main },
                                  { category: 'Failed', count: actualFailedCount, color: theme.palette.error.main },
                                  { category: 'Existing', count: actualExistingCount, color: theme.palette.warning.main }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>
                  )}

                  {/* User Lists Section */}
                  <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
                    {/* Successful Users */}
                    {response.successfulUsers && response.successfulUsers.length > 0 && (
                      <Box sx={{ flex: 1, minWidth: '300px' }}>
                        <Card sx={{ borderRadius: 2, height: '100%' }}>
                          <CardHeader
                            avatar={<CheckCircle color="success" />}
                            title="Successfully Added Users"
                            subheader={`${response.successfulUsers.length} users`}
                            action={
                              <Chip
                                label={actualSuccessCount}
                                color="success"
                                size="small"
                              />
                            }
                          />
                          <CardContent sx={{ pt: 0 }}>
                            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                              {response.successfulUsers.map((email, index) => (
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
                    {response.failedUsers && response.failedUsers.length > 0 && (
                      <Box sx={{ flex: 1, minWidth: '300px' }}>
                        <Card sx={{ borderRadius: 2, height: '100%' }}>
                          <CardHeader
                            avatar={<Error color="error" />}
                            title="Failed to Add Users"
                            subheader={`${response.failedUsers.length} users`}
                            action={
                              <Chip
                                label={actualFailedCount}
                                color="error"
                                size="small"
                              />
                            }
                          />
                          <CardContent sx={{ pt: 0 }}>
                            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                              {response.failedUsers.map((failedUser, index) => (
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
                    {response.existingUsers && response.existingUsers.length > 0 && (
                      <Box sx={{ flex: 1, minWidth: '300px' }}>
                        <Card sx={{ borderRadius: 2, height: '100%' }}>
                          <CardHeader
                            avatar={<Warning color="warning" />}
                            title="Already Existing Users"
                            subheader={`${response.existingUsers.length} users`}
                            action={
                              <Chip
                                label={actualExistingCount}
                                color="warning"
                                size="small"
                              />
                            }
                          />
                          <CardContent sx={{ pt: 0 }}>
                            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                              {response.existingUsers.map((email, index) => (
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
                      </>
                    );
                  })()}
                </Box>
              </Fade>
            )}
          </Box>
      </Container>
    </Box>
  );
};

export default AddUsers;
