import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Stack,
  Skeleton,
} from '@mui/material';
import { Dashboard, Group, NavigateNext } from '@mui/icons-material';

import GroupHeader from '../components/Group/GroupHeader';
import GroupNavigation from '../components/Group/GroupNavigation';
import QuizSection from '../components/Group/QuizSection';
// import ResourceSection from '../components/Group/ResourceSection';
import ResourceSection from '../components/Group/ResourceSection';
import GroupChat from '../components/Group/GroupChat';
import AddMembersDialog from '../components/workpsaces/Management/AddMembersToGroups';
import { useAuth } from '../contexts/Authcontext';
import { useSnackbar } from '../contexts/SnackbarContext';
import axiosInstance from '../api/axiosInstance';

interface GroupData {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: Array<{
    userId: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  }>;
  recentActivity: string;
  type?: 'Main' | 'Custom';
}

const GroupPage = () => {
  const { workspaceId, groupId } = useParams<{
    workspaceId: string;
    groupId: string;
  }>();
  const { name, user_id } = useAuth();
  const [workspaceName, setWorkspaceName] = useState<string>('');
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (!workspaceId) {
      navigate(-1);
      return;
    }

    const fetchWorkspaceData = async (workspaceId: string) => {
      try {
        const response = await axiosInstance.get(
          `/workspace/getWorkspace/${workspaceId}`
        );
        if (response.data.success) {
          setWorkspaceName(response.data.data.name);
        }
      } catch (error) {
        console.error('Error fetching workspace data:', error);
      }
    };
    fetchWorkspaceData(workspaceId!);
  }, [workspaceId]);

  useEffect(() => {
    if (!groupId) {
      navigate(-1);
      return;
    }

    const fetchGroupData = async (groupId: string) => {
      try {
        const response = await axiosInstance.get(
          `/workspace/groups/${groupId}/fetchDetails`
        );
        console.log('Fetched group data:', response.data);
        setGroupData({
          id: response.data.data.id || '',
          name: `${response.data.data.name}` || 'Group Name',
          description:
            response.data.data.description || 'No description available',
          memberCount: response.data.data.memberCount || 0,
          members: response.data.data.members || [],
          recentActivity:
            response.data.data.recentActivity || 'No recent activity',
          type: response.data.data.type || 'Custom',
        });
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };
    fetchGroupData(groupId!);
  }, [groupId, workspaceName]);

  const handleTabChange = async (_: any, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleNavigateToWhiteboard = async () => {
    // API call to Log the whiteboard join activity
    try {
      await axiosInstance.post('/analytics/log-activity', {
        category: 'COLLABORATION',
        activity_type: 'JOINED_WHITEBOARD',
        metadata: {
          groupId,
          workspaceId,
          groupName: groupData?.name,
        },
      });
    } catch (error) {
      console.error('Failed to log whiteboard join activity:', error);
    }

    navigate(`/whiteboard/${groupId}`);
  };

  const handleNavigateToEditor = () => navigate(`/document-editor/${groupId}`);
  const handleAddUsers = () => setAddMembersOpen(true);

  if (!groupData) {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton
          variant="rectangular"
          height={250}
          sx={{ mt: 2, borderRadius: 2 }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 1, sm: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 3 },
        width: '100%',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        mx: 'auto',
      }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        <Link
          color="inherit"
          onClick={() => navigate(-1)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
            cursor: 'pointer',
          }}
        >
          <Dashboard sx={{ mr: 0.5 }} />
          <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
            {workspaceName}
          </Typography>
        </Link>

        <Typography
          color="text.primary"
          sx={{
            display: 'flex',
            alignItems: 'center',

            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '200px',
          }}
        >
          <Group sx={{ mr: 0.5 }} />
          {groupData.name}
        </Typography>
      </Breadcrumbs>

      {/* Group Header */}
      <GroupHeader groupData={groupData} onAddUsers={handleAddUsers} />

      {/* Tabs */}
      <Box sx={{ mt: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Navigation" />
          <Tab label="Quizzes" />
          <Tab label="Resources" />
          <Tab label="Chat" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tabIndex === 0 && (
            <Stack spacing={2}>
              <GroupNavigation
                onNavigateToWhiteboard={handleNavigateToWhiteboard}
                onNavigateToEditor={handleNavigateToEditor}
                setTabIndex={setTabIndex}
              />
            </Stack>
          )}
          {tabIndex === 1 && <QuizSection groupId={groupId || ''} />}
          {tabIndex === 2 && <ResourceSection groupId={groupId || ''} />}
          {tabIndex === 3 && (
            <GroupChat
              groupName={groupData.name}
              groupId={groupId || ''}
              currentUserName={name || 'Anonymous'}
              currentUserId={user_id || ''}
            />
          )}
        </Box>
      </Box>

      {/* Add Members Dialog */}
      <AddMembersDialog
        open={addMembersOpen}
        onClose={() => setAddMembersOpen(false)}
        workspaceId={workspaceId || ''}
        groupId={groupId || ''}
        setSuccess={(msg) => showSnackbar(msg || '', 'success')}
        setError={(msg) => showSnackbar(msg || '', 'error')}
      />
    </Box>
  );
};

export default GroupPage;
