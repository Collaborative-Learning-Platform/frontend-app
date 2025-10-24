import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as PlusIcon,

} from "@mui/icons-material";
import CreateWorkspaceModal from "../workpsaces/CreateWorkspaceModal";
import axiosInstance from "../../api/axiosInstance";
import WorkspaceCard from "../workpsaces/WorkspaceCard";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../contexts/SnackbarContext";

interface Workspace {
  workspaceId: string;
  name: string;
  description: string;
  studentCount: number;
  tutorCount: number;
  createdAt: string;
  groupsCount: number;
  lastActivity: string;
}

export function WorkspaceManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const response = (await axiosInstance.get("/workspace/getAllWorkspaces")).data;
      if (!response.success) {
        console.error("Failed to fetch workspaces");
      } else {
        const mapped = response.data.map((ws: Workspace) => ({
          id: ws.workspaceId,
          name: ws.name,
          description: ws.description,
          students: ws.studentCount ?? 0,
          tutors: ws.tutorCount ?? 0,
          groups: ws.groupsCount ?? 0,
          status: "Active",
          created: ws.createdAt
            ? new Date(ws.createdAt).toISOString().slice(0, 10)
            : "N/A",
          lastActivity: ws.lastActivity ?? "just now",
        }));

        setWorkspaces(mapped);
      }
    } catch (err) {
      console.log(`error ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  function handleCreated(newWs: any) {
    // notify user and refresh list from server so data stays consistent
    const mapped = {
      id: newWs?.id ?? Date.now(),
      name: newWs?.name ?? "New Workspace",
      description: newWs?.description ?? "",
      students: newWs?.studentsCount ?? 0,
      tutors: newWs?.tutorsCount ?? 0,
      groups: newWs?.groupsCount ?? 0,
      status: newWs?.status ?? "Active",
      created: new Date().toISOString().slice(0, 10),
      lastActivity: "just now",
    };
    setWorkspaces((prev) => [mapped, ...prev]);
    showSnackbar("Workspace created successfully", "success");
    setIsWorkspaceModalOpen(false);
    // refresh from server to ensure any server-side defaults are reflected
    fetchWorkspaces();
  }

  const handleManageWorkspace = (workspace: any) => {
    navigate(`/admin-workspaces/manage/${workspace.id}`);
  };

  // filter workspaces by searchTerm
  const filteredWorkspaces = workspaces.filter(
    (ws) =>
      ws.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ws.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  
  const WorkspaceSkeleton = () => (
    <Card>
      <CardHeader
        title={<Skeleton width="60%" />}
        subheader={<Skeleton width="40%" />}
      />
      <CardContent>
        <Skeleton height={30} />
        <Skeleton height={30} />
        <Skeleton height={30} />
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ py: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Workspace Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage learning workspaces
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => setIsWorkspaceModalOpen(true)}
        >
          Create Workspace
        </Button>
      </Box>

      {/* Search + Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          placeholder="Search workspaces..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flex: { xs: "1 1 100%", sm: "1 1 auto" }, maxWidth: { sm: 320 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Workspaces */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {loading
          ? Array.from(new Array(3)).map((_, i) => (
              <Box
                key={i}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    md: "1 1 calc(50% - 12px)",
                    lg: "1 1 calc(33.333% - 16px)",
                  },
                }}
              >
                <WorkspaceSkeleton />
              </Box>
            ))
          : filteredWorkspaces.map((ws) => (
              <Box
                key={ws.id}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    md: "1 1 calc(50% - 12px)",
                    lg: "1 1 calc(33.333% - 16px)",
                  },
                }}
              >
                <WorkspaceCard 
                  workspace={ws}
                  onManage={() => handleManageWorkspace(ws)}
                />
              </Box>
            ))}
      </Box>

      

      <CreateWorkspaceModal
        open={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onCreated={handleCreated}
        endpoint="/workspace/create"
      />

     
    </Box>
  );
}
