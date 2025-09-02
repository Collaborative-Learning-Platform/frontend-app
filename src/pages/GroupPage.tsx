import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Breadcrumbs, Link, Stack } from '@mui/material';
import { Dashboard, Group, NavigateNext } from '@mui/icons-material';

import GroupChat from '../components/Group/GroupChat';
import GroupNavigation from '../components/Group/GroupNavigation';
import QuizSection from '../components/Group/QuizSection';
import ResourceSection from '../components/Group/ResourceSection';
import GroupHeader from '../components/Group/GroupHeader';

interface GroupData {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  recentActivity: string;
}

const GroupPage = () => {
  const { workspaceId, groupId } = useParams<{ workspaceId: string; groupId: string }>();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState<GroupData | null>(null);

  useEffect(() => {
    setGroupData({
      id: groupId || '',
      name: 'CS3040 Software Engineering - Group 12',
      description: 'Software Engineering project group focused on developing a collaborative learning platform',
      memberCount: 6,
      members: [
        { id: '1', name: 'Theekshana Dissanayake', avatar: '' },
        { id: '2', name: 'Kavindi Silva', avatar: '' },
        { id: '3', name: 'Ravindu Perera', avatar: '' },
        { id: '4', name: 'Sachini Fernando', avatar: '' },
        { id: '5', name: 'Nimesh Rajapaksha', avatar: '' },
        { id: '6', name: 'Dilani Wickramasinghe', avatar: '' },
      ],
      recentActivity: '15 minutes ago',
    });
  }, [workspaceId, groupId]);

  const handleNavigateToWhiteboard = () => {
    navigate(`/workspace/${workspaceId}/group/${groupId}/whiteboard`);
  };

  const handleNavigateToEditor = () => {
    navigate(`/workspace/${workspaceId}/group/${groupId}/editor`);
  };

  if (!groupData) {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: { xs: 1, sm: 2, md: 3 }, 
      px: { xs: 1, sm: 2, md: 3 }, 
      maxWidth: '1400px', 
      mx: 'auto' 
    }}>
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />} 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}
      >
        <Link 
          color="inherit" 
          href="#" 
          onClick={() => navigate(`/workspace/${workspaceId}`)}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <Dashboard sx={{ mr: 0.5, fontSize: { xs: 16, sm: 20 } }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Workspace</Box>
        </Link>
        <Typography 
          color="text.primary" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <Group sx={{ mr: 0.5, fontSize: { xs: 16, sm: 20 } }} />
          <Box sx={{ 
            display: { xs: 'none', sm: 'block' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: { sm: '200px', md: 'none' }
          }}>
            {groupData.name}
          </Box>
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Group</Box>
        </Typography>
      </Breadcrumbs>

      <GroupHeader groupData={groupData} />

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' }, 
        gap: { xs: 2, sm: 3 }, 
        mt: { xs: 2, sm: 3 } 
      }}>
        <Box sx={{ 
          width: { xs: '100%', lg: '350px' }, 
          flexShrink: 0,
          order: { xs: 2, lg: 1 }
        }}>
          <Stack spacing={{ xs: 2, sm: 3 }}>
            <GroupNavigation 
              onNavigateToWhiteboard={handleNavigateToWhiteboard}
              onNavigateToEditor={handleNavigateToEditor}
            />
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <GroupChat groupId={groupId || ''} />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ 
          flex: 1, 
          minWidth: 0,
          order: { xs: 1, lg: 2 }
        }}>
          <Stack spacing={{ xs: 2, sm: 3 }}>
            <QuizSection groupId={groupId || ''} />
            <ResourceSection groupId={groupId || ''} />
          </Stack>
        </Box>
      </Box>

      <Box sx={{ 
        display: { xs: 'block', lg: 'none' }, 
        mt: { xs: 2, sm: 3 },
        order: 3
      }}>
        <GroupChat groupId={groupId || ''} />
      </Box>
    </Box>
  );
};

export default GroupPage;