import { useState, useEffect } from "react";
import { Container, Tabs, Tab, Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import WorkspaceHeader from "../workpsaces/Management/workspaceHeader";
import GroupsPanel from "../workpsaces/Management/GroupPanel";
import UsersPanel from "../workpsaces/Management/UserPanel";

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

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        if (!workspaceId) return;

        const wsRes = await axiosInstance.get(`/workspace/getWorkspace/${workspaceId}`);
        if (wsRes.data.success) setWorkspace(wsRes.data.data);

        const groupsRes = await axiosInstance.get(`/workspace/fetchGroups/${workspaceId}`);
        if (groupsRes.data.success) setGroups(groupsRes.data.data);

        // TODO: fetch users
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load workspace");
      }
    };
    fetchWorkspace();
  }, [workspaceId]);

  return (
    <Container sx={{ py: 4 }}>
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
      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label="Groups" />
        <Tab label="Users" />
      </Tabs>

      {tabValue === 0 && (
        <GroupsPanel
          workspaceId={workspaceId!}
          groups={groups}
          setGroups={setGroups}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}

      {tabValue === 1 && (
        <UsersPanel
          workspaceId={workspaceId!}
          users={users}
          setUsers={setUsers}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </Container>
  );
}
