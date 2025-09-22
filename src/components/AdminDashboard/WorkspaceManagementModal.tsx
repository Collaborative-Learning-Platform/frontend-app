import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Divider,
  LinearProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Group as GroupIcon,
  People as PeopleIcon,
  FileUpload as FileUploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor";
  status: "active" | "inactive";
}


interface Workspace {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  tutorCount: number;
  createdAt: string;
  groupsCount: number;
  lastActivity: string;
}



interface WorkspaceManagementModalProps {
  open: boolean;
  onClose: () => void;
  workspace: Workspace;
}

export default function WorkspaceManagementModal({
  open,
  onClose,
  workspace,
}: WorkspaceManagementModalProps) {
  const [tabValue, setTabValue] = useState(0);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Group creation states
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupMaxMembers, setNewGroupMaxMembers] = useState(10);
  const [creatingGroup, setCreatingGroup] = useState(false);

  // File upload states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      setError("Group name is required");
      return;
    }

    setCreatingGroup(true);
    setError(null);

    try {
      const payload = {
        workspaceId: workspace.id,
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        type: "Main",
    
        
      };

      const response = await axiosInstance.post("/workspace/createGroup", payload);
      
      if (response.data.success) {
        const newGroup: Group = {
          id: response.data.data.id,
          name: newGroupName,
          description: newGroupDescription,
          memberCount: 0,      
          createdAt: new Date().toISOString(),
        };
        
        setGroups([newGroup, ...groups]);
        setNewGroupName("");
        setNewGroupDescription("");
        setNewGroupMaxMembers(10);
        setSuccess("Group created successfully!");
      } else {
        setError(response.data.message || "Failed to create group");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create group");
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      const response = await axiosInstance.delete(`/groups/${groupId}`);
      if (response.data.success) {
        setGroups(groups.filter(group => group.id !== groupId));
        setSuccess("Group deleted successfully!");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete group");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a CSV or Excel file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    // Simulate upload progress
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspace.id);

    // Mock upload simulation - replace with actual API call
    const uploadSimulation = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(uploadSimulation);
          // Simulate actual upload
          setTimeout(() => {
            setUploadProgress(100);
            setUploading(false);
            setSuccess(`Successfully uploaded ${file.name} with user data!`);
            // Here you would typically refresh the users list
          }, 500);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  
  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = "name,email,role\nJohn Doe,john@example.com,student\nJane Smith,jane@example.com,tutor\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };


  useEffect(() => {
    if (!open || !workspace?.id) {
      setLoading(false);
      return;
    }
    
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/workspace/fetchGroups/${workspace.id}`);
        if (response.data.success) {
          setGroups(response.data.data);
        } else {
          setError("Failed to fetch groups");
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [open, workspace?.id]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5">Manage Workspace: {workspace?.name}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<GroupIcon />} label="Groups" />
          <Tab icon={<PeopleIcon />} label="Users" />
        </Tabs>

        {/* Groups Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
            {/* Create Group Form */}
            <Box sx={{ flex: { xs: "1", md: "0 0 40%" } }}>
              <Card>
                <CardHeader title="Create New Group" />
                <CardContent>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      label="Group Name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Description"
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <TextField
                      label="Max Members"
                      type="number"
                      value={newGroupMaxMembers}
                      onChange={(e) => setNewGroupMaxMembers(Number(e.target.value))}
                      inputProps={{ min: 1, max: 50 }}
                      fullWidth
                    />
                    <LoadingButton
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateGroup}
                      loading={creatingGroup}
                      disabled={!newGroupName.trim()}
                    >
                      Create Group
                    </LoadingButton>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Groups List */}
            <Box sx={{ flex: { xs: "1", md: "0 0 60%" } }}>
              <Card>
                <CardHeader title="Existing Groups" />
                <CardContent>
                  {groups.length === 0 ? (
                    <Typography color="textSecondary" textAlign="center" py={4}>
                      No groups created yet. Create your first group using the form on the left.
                    </Typography>
                  ) : (
                    <List>
                      {groups.map((group, index) => (
                        <Box key={group.id}>
                          <ListItem>
                            <ListItemText
                              primary={group.name}
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="textSecondary">
                                    {group.description}
                                  </Typography>
                                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                    <Chip 
                                      size="small" 
                                      label={new Date(group.createdAt).toLocaleDateString()} 
                                      variant="outlined"
                                    />
                                  </Box>
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() => handleDeleteGroup(group.id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < groups.length - 1 && <Divider />}
                        </Box>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
            {/* File Upload Section */}
            <Box sx={{ flex: { xs: "1", md: "0 0 50%" } }}>
              <Card>
                <CardHeader title="Upload Users via CSV/Excel" />
                <CardContent>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Upload a CSV or Excel file to add multiple users to this workspace.
                      The file should contain columns: name, email, role (student/tutor).
                    </Typography>
                    
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={downloadTemplate}
                        size="small"
                      >
                        Download Template
                      </Button>
                    </Box>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".csv,.xlsx,.xls"
                      style={{ display: "none" }}
                    />
                    
                    <Button
                      variant="contained"
                      startIcon={<FileUploadIcon />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      fullWidth
                    >
                      {uploading ? "Uploading..." : "Choose File"}
                    </Button>

                    {uploading && (
                      <Box sx={{ width: "100%" }}>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                        <Typography variant="caption" color="textSecondary">
                          {uploadProgress}% uploaded
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Users List */}
            <Box sx={{ flex: { xs: "1", md: "0 0 50%" } }}>
              <Card>
                <CardHeader title="Current Users" />
                <CardContent>
                  {users.length === 0 ? (
                    <Typography color="textSecondary" textAlign="center" py={4}>
                      No users added yet. Upload a CSV/Excel file to add users.
                    </Typography>
                  ) : (
                    <List>
                      {users.map((user, index) => (
                        <Box key={user.id}>
                          <ListItem>
                            <ListItemText
                              primary={user.name}
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="textSecondary">
                                    {user.email}
                                  </Typography>
                                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                    <Chip 
                                      size="small" 
                                      label={user.role} 
                                      color={user.role === 'tutor' ? 'primary' : 'default'}
                                    />
                                    <Chip 
                                      size="small" 
                                      label={user.status} 
                                      color={user.status === 'active' ? 'success' : 'default'}
                                      variant="outlined"
                                    />
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < users.length - 1 && <Divider />}
                        </Box>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
