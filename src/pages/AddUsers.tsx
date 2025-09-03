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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
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
} from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AddUsers = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<any>(null);
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
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
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

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Main Upload Section */}
          <Box sx={{ flex: 2 }}>
            {/* File Upload Card */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: theme.shadows[4] }}>
              <CardHeader
                avatar={<FileUpload color="primary" />}
                title="Upload User Data"
                subheader="Upload the CSV or Excel file containing user information"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
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
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
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
                          {typeof response === "string"
                            ? response
                            : "Users uploaded successfully!"}
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
          </Box>

          {/* Instructions Card */}
          <Card
            sx={{
              flex: 1,
              borderRadius: 2,
              height: "fit-content",
              boxShadow: theme.shadows[4],
            }}
          >
            <CardHeader
              avatar={<Info color="primary" />}
              title="File Requirements"
              subheader="Follow these guidelines for successful upload"
              sx={{
                backgroundColor: alpha(theme.palette.info.main, 0.04),
                "& .MuiCardHeader-title": {
                  fontWeight: "bold",
                },
              }}
            />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Required Columns"
                    secondary="name, email, role, password"
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Valid Roles"
                    secondary="admin, tutor, user"
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="File Formats"
                    secondary="CSV, Excel (.xlsx, .xls)"
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="File Size"
                    secondary="Maximum 10MB per file"
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<Description />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Download Template
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default AddUsers;
