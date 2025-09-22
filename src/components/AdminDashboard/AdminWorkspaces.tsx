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
import WorkspaceManagementModal from "./WorkspaceManagementModal";
import axiosInstance from "../../api/axiosInstance";
import WorkspaceCard from "../workpsaces/WorkspaceCard";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  }

  const handleManageWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setIsManagementModalOpen(true);
  };

  // filter workspaces by searchTerm
  const filteredWorkspaces = workspaces.filter(
    (ws) =>
      ws.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ws.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Workspace Card Component
  // const WorkspaceCard = ({ ws }: { ws: any }) => (
  //   <Card
  //     sx={{
  //       height: "100%",
  //       transition: "box-shadow 0.2s",
  //       "&:hover": {
  //         boxShadow: 4,
  //       },
  //     }}
  //   >
  //     <CardHeader
  //       title={
  //         <Box
  //           sx={{
  //             display: "flex",
  //             justifyContent: "space-between",
  //             alignItems: "center",
  //           }}
  //         >
  //           <Typography variant="h6">{ws.name}</Typography>
  //           <Chip
  //             label={ws.status}
  //             color={ws.status === "Active" ? "primary" : "default"}
  //             size="small"
  //           />
  //         </Box>
  //       }
  //       subheader={ws.description}
  //       sx={{ pb: 2 }}
  //     />
  //     <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
  //       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
  //         <Stat icon={<UsersIcon />} label={`${ws.students} Students`} />
  //         <Stat icon={<MessageSquareIcon />} label={`${ws.groups} Groups`} />
  //         <Stat icon={<FileTextIcon />} label={`${ws.tutors} Tutors`} />
  //         <Stat icon={<BarChart3Icon />} label="Analytics" />
  //       </Box>

  //       <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
  //         <Typography variant="caption" color="text.secondary">
  //           Created: {ws.created}
  //         </Typography>
  //         <Typography variant="caption" color="text.secondary">
  //           Last activity: {ws.lastActivity}
  //         </Typography>
  //       </Box>

  //       <Box sx={{ display: "flex", gap: 1 }}>
  //         <Button 
  //           size="small" 
  //           variant="contained" 
  //           sx={{ flex: 1 }}
  //           onClick={() => handleManageWorkspace(ws)}
  //         >
  //           Manage
  //         </Button>
  //         <Button size="small" variant="outlined" sx={{ flex: 1 }}>
  //           View
  //         </Button>
  //       </Box>
  //     </CardContent>
  //   </Card>
  // );

  // // Small stat item with icon
  // const Stat = ({ icon, label }: { icon: any; label: string }) => (
  //   <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 120 }}>
  //     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //       {icon}
  //       <Typography variant="body2">{label}</Typography>
  //     </Box>
  //   </Box>
  // );

  // Skeleton card placeholder
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
        <Button variant="outlined">Filter</Button>
        <Button variant="outlined">Export</Button>
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

      {/* Quick Stats */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {[156, 2847, 1234, "89%"].map((val, i) => (
          <Box
            key={i}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 8px)",
                md: "1 1 calc(25% - 12px)",
              },
            }}
          >
            <Card>
              <CardContent sx={{ p: 2 }}>
                {loading ? (
                  <>
                    <Skeleton width="50%" height={30} />
                    <Skeleton width="70%" />
                  </>
                ) : (
                  <>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {val}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {
                        [
                          "Total Workspaces",
                          "Total Participants",
                          "Active Groups",
                          "Engagement Rate",
                        ][i]
                      }
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <CreateWorkspaceModal
        open={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onCreated={handleCreated}
        endpoint="/workspace/create"
      />

      <WorkspaceManagementModal
        open={isManagementModalOpen}
        onClose={() => setIsManagementModalOpen(false)}
        workspace={selectedWorkspace}
      />
    </Box>
  );
}
