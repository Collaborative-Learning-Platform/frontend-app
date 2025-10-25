import { useState, useEffect } from "react";
import { Container, Tabs, Tab, Alert, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

import WorkspaceHeader from "../components/workpsaces/Management/WorkspaceHeader";
import GroupsPanel from "../components/workpsaces/Management/GroupPanel";
import UsersPanel from "../components/workpsaces/Management/UserPanel";

// Types
interface Workspace {
  workspaceId: string;
  name: string;
  description?: string;
}

interface Group {
  groupId: string;
  name: string;
  description?: string;
  type: string;
  createdAt: string;
}

interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  avatar?: string;
}

interface responseUser{
  userId: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserWorkspace{
    joinedAt: string;
    role: string;
    user: responseUser;
    userId: string;
    workspaceId: string;
}

export default function WorkspaceManagementPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        if (!workspaceId) return;

        // Fetch workspace details
        const wsRes = await axiosInstance.get(`/workspace/getWorkspace/${workspaceId}`);
        if (wsRes.data.success) setWorkspace(wsRes.data.data);

        // Fetch groups
        setLoadingGroups(true);
        const groupsRes = await axiosInstance.get(`/workspace/groups/fetchGroups/${workspaceId}`);
        if (groupsRes.data.success) setGroups(groupsRes.data.data);
        setLoadingGroups(false);

        // Fetch users
        setLoadingUsers(true);
        const usersRes = await axiosInstance.get(`/workspace/users/fetch/${workspaceId}`);
        if (usersRes.data.success) {
        const extractedUsers: User[] = usersRes.data.data.map((wu: UserWorkspace) => ({
            userId: wu.user.userId,
            name: wu.user.name,
            email: wu.user.email,
            role: wu.role,
            joinedAt: wu.joinedAt,
            avatar: wu.user.avatar || "",
        }));
          setUsers(extractedUsers);
        }
        setLoadingUsers(false);
          
      } catch (err: any) {
        setLoadingGroups(false);
        setLoadingUsers(false);
        // Temporarily ignore specific Auth Service fetch error to avoid showing it here
        // if (err?.response?.data?.message === "Failed to fetch user details from Auth Service") {
        //   // setError("Failed to load users: Auth Service is unreachable");
        //   return;
        // }
        // setError(err?.response?.data?.message || "Failed to load workspace");
      }
    };
    fetchWorkspace();
  }, [workspaceId]);


  return (
    <Container sx={{ py: 1 }}>
      {/* Header */}
      <WorkspaceHeader workspace={workspace} onBack={() => navigate("/admin-workspaces")} />

      {/* Notifications */}
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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Groups" />
          <Tab label="Users" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <GroupsPanel
          workspaceId={workspaceId!}
          groups={groups}
          setGroups={setGroups}
          setError={setError}
          setSuccess={setSuccess}
          loading={loadingGroups}
        />
      )}

      {tabValue === 1 && (
        <UsersPanel
          workspaceId={workspaceId!}
          users={users}
          setUsers={setUsers}
          loading={loadingUsers}
        />
      )}
    </Container>
  );
}
