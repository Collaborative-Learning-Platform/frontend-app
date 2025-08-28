import { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  TextField,
  Typography,
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  Share as ShareIcon,
  Save as SaveIcon,
  CloudDone as CloudDoneIcon,
  Sync as SyncIcon,
  MoreVert as MoreVertIcon,
  InsertDriveFile as DocumentIcon,
} from "@mui/icons-material";

export const Titlebar = () => {
  const [loggedInUsers, setLoggedInUsers] = useState<string[]>([]);
  const [documentName, setDocumentName] = useState<string>("Untitled Document");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const handleDocumentNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDocumentName(event.target.value);
    // Simulate auto-save trigger
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1500);
  };

  useEffect(() => {
    // Fetch logged in users from backend
    const fetchLoggedInUsers = async () => {
      // Mock data for demo
      setLoggedInUsers(["Sarah", "Mike", "Alex", "Emma"]);
    };

    fetchLoggedInUsers();
  }, []);

  return (
    <Box sx={{ width: "100%", flexGrow: 1, padding: 0 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          width: "100%",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ minHeight: 72, px: 3 }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Left Section - Document Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <DocumentIcon sx={{ color: "primary.main", fontSize: 20 }} />
                <TextField
                  value={documentName}
                  onChange={handleDocumentNameChange}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontSize: "1rem",
                      color: "text.primary",
                      width: { xs: 140, sm: 200, md: 280 },
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "4px 0",
                      "&:focus": {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                />
              </Box>

              {/* Save Status */}
              <Box
                sx={{
                  display: { xs: "none", lg: "flex" },
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: isSaving
                    ? "rgba(33, 150, 243, 0.08)"
                    : "rgba(76, 175, 80, 0.08)",
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  border: `1px solid ${
                    isSaving
                      ? "rgba(33, 150, 243, 0.2)"
                      : "rgba(76, 175, 80, 0.2)"
                  }`,
                  transition: "all 0.3s ease-in-out",
                  minWidth: 120,
                  justifyContent: "center",
                }}
              >
                <Fade in={!isSaving}>
                  <CloudDoneIcon sx={{ fontSize: 16, color: "success.main" }} />
                </Fade>
                <Fade in={isSaving}>
                  <SyncIcon
                    sx={{
                      fontSize: 16,
                      color: "info.main",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                </Fade>
                <Typography
                  variant="caption"
                  color={isSaving ? "info.main" : "success.main"}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  {isSaving
                    ? "Saving..."
                    : `Saved ${lastSaved.toLocaleTimeString()}`}
                </Typography>
              </Box>
            </Box>

            {/* Right Section - Actions & Collaborators */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShareIcon />}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(0,0,0,0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(25,118,210,0.04)",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  Share
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon />}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                    boxShadow: "0 2px 8px rgba(25,118,210,0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                      boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
                    },
                  }}
                >
                  Save
                </Button>
              </Box>

              {/* Collaborators */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {loggedInUsers.length} online
                </Typography>
                <AvatarGroup
                  max={3}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      border: "2px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  {loggedInUsers.map((user, index) => (
                    <Tooltip key={index} title={`${user} (online)`}>
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, ${
                            [
                              "#FF6B6B",
                              "#4ECDC4",
                              "#45B7D1",
                              "#96CEB4",
                              "#FFEAA7",
                            ][index % 5]
                          }, ${
                            [
                              "#FF8E53",
                              "#26D0CE",
                              "#6C5CE7",
                              "#81ECEC",
                              "#FDCB6E",
                            ][index % 5]
                          })`,
                          animation: "pulse 2s infinite",
                        }}
                      >
                        {user.charAt(0)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </Box>

              {/* More Options */}
              <Tooltip title="More options">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `}
      </style>
    </Box>
  );
};
