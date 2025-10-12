import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import {
  CloudUpload,
  Description,
  CheckCircle,
  Info,
  ArrowBack,
  FileUpload,
  Delete as DeleteIcon,
  People,
  PersonAdd,
  Warning,
  Email,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useSnackbar } from "../contexts/SnackbarContext";

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
  const [isDragOver, setIsDragOver] = useState(false);

  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = [".csv", ".xlsx", ".xls"];
      const fileExtension = file.name
        .toLowerCase()
        .substr(file.name.lastIndexOf("."));

      if (allowedTypes.includes(fileExtension)) {
        setSelectedFile(file);
        setResponse(null);
        showSnackbar(`File "${file.name}" selected successfully`, "success");
      } else {
        showSnackbar("Please upload a valid file type: CSV or Excel (.xlsx, .xls)", "error");
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
        setResponse(null);
        showSnackbar(`File "${file.name}" selected successfully`, "success");
      } else {
        showSnackbar("Please upload a valid file type: CSV or Excel (.xlsx, .xls)", "error");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showSnackbar("Please select a file.", "warning");
      return;
    }
    
    setUploading(true);
    setResponse(null);
    
    // Show upload start message
    showSnackbar("Starting file upload...", "info");

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
        const errorMessage = data.error || "Bulk Addition failed";
        showSnackbar(errorMessage, "error");
      } else {
        setResponse(data);
        const successMessage = `Upload completed! ${data.successCount || 0} users added successfully`;
        showSnackbar(successMessage, "success");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || "Network error. Please try again.";
      showSnackbar(errorMessage, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedFile(null);
    showSnackbar("File removed", "info");
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

  const handleDownloadTemplate = () => {
    // Create template data
    const templateData = [
      ["name", "email", "role", "password"],
      ["John Doe", "john.doe@example.com", "user", "Abcd1234"],
      ["Jane Smith", "jane.smith@example.com", "tutor", "Abcd1234"],
      ["Admin User", "admin@example.com", "admin", "Abcd1234"]
    ];

    // Convert to CSV format
    const csvContent = templateData
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "bulk_user_upload_template.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      showSnackbar("Template file downloaded successfully", "success");
    } else {
      showSnackbar("Download not supported in this browser", "error");
    }
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
                  onClick={handleDownloadTemplate}
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
                          <ErrorIcon sx={{ color: 'error.main', mr: 1 }} />
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
                            avatar={<ErrorIcon color="error" />}
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
