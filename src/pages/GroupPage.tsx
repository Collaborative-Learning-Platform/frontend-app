// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Box, Typography, Breadcrumbs, Link, Stack, Skeleton } from '@mui/material';
// import { Dashboard, Group, NavigateNext } from '@mui/icons-material';

// import GroupChat from '../components/Group/GroupChat';
// import GroupNavigation from '../components/Group/GroupNavigation';
// import QuizSection from '../components/Group/QuizSection';
// import ResourceSection from '../components/Group/ResourceSection';
// import GroupHeader from '../components/Group/GroupHeader';

// interface GroupData {
//   id: string;
//   name: string;
//   description: string;
//   memberCount: number;
//   members: Array<{
//     id: string;
//     name: string;
//     avatar: string;
//   }>;
//   recentActivity: string;
// }

// const GroupPage = () => {
//   const { workspaceId, groupId } = useParams<{ workspaceId: string; groupId: string }>();
//   const navigate = useNavigate();
//   const [groupData, setGroupData] = useState<GroupData | null>(null);

//   useEffect(() => {
//     setGroupData({
//       id: groupId || '',
//       name: 'CS3040 Software Engineering - Group 12',
//       description: 'Software Engineering project group focused on developing a collaborative learning platform',
//       memberCount: 6,
//       members: [
//         { id: '1', name: 'Theekshana ', avatar: '' },
//         { id: '2', name: 'Kavindi Silva', avatar: '' },
//         { id: '3', name: 'Ravindu Perera', avatar: '' },
//         { id: '4', name: 'Sachini Fernando', avatar: '' },
//         { id: '5', name: 'Nimesh Rajapaksha', avatar: '' },
//         { id: '6', name: 'Dilani Wickramasinghe', avatar: '' },
//       ],
//       recentActivity: '15 minutes ago',
//     });
//   }, [workspaceId, groupId]);

//   const handleNavigateToWhiteboard = () => {
//     navigate(`/whiteboard`);
//   };

//   const handleNavigateToEditor = () => {
//     navigate(`/DocumentEditor`);
//   };

//   if (!groupData) {
//     return (
//       <Box sx={{ py: 4, px: 2 }}>
//         <Skeleton variant="text" width="40%" />
//         <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
//       </Box>
//     );
// }


//   return (
//     <Box sx={{ 
//       py: { xs: 1, sm: 2, md: 3 }, 
//       px: { xs: 1, sm: 2, md: 3 }, 
//       maxWidth: '1400px', 
//       mx: 'auto' 
//     }}>
//       <Breadcrumbs 
//         separator={<NavigateNext fontSize="small" />} 
//         sx={{ 
//           mb: { xs: 2, sm: 3 },
//           fontSize: { xs: '0.875rem', sm: '1rem' }
//         }}
//       >
//         <Link 
//           color="inherit" 
//           href="#" 
//           onClick={() => navigate(`/workspace/${workspaceId}`)}
//           sx={{ 
//             display: 'flex', 
//             alignItems: 'center',
//             textDecoration: 'none',
//             '&:hover': { color: 'primary.main' }
//           }}
//         >
//           <Dashboard sx={{ mr: 0.5, fontSize: { xs: 16, sm: 20 } }} />
//           <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Workspace</Box>
//         </Link>
//         <Typography 
//           color="text.primary" 
//           sx={{ 
//             display: 'flex', 
//             alignItems: 'center',
//             fontSize: { xs: '0.875rem', sm: '1rem' },
//             overflow: 'hidden',
//             textOverflow: 'ellipsis'
//           }}
//         >
//           <Group sx={{ mr: 0.5, fontSize: { xs: 16, sm: 20 } }} />
//           <Box sx={{ 
//             display: { xs: 'none', sm: 'block' },
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//             maxWidth: { sm: '200px', md: 'none' }
//           }}>
//             {groupData.name}
//           </Box>
//           <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Group</Box>
//         </Typography>
//       </Breadcrumbs>

//       <GroupHeader groupData={groupData} />

//       <Box sx={{ 
//         display: 'flex', 
//         flexDirection: { xs: 'column', lg: 'row' }, 
//         gap: { xs: 2, sm: 3 }, 
//         mt: { xs: 2, sm: 3 } 
//       }}>
//         <Box sx={{ 
//           width: { xs: '100%', lg: '350px' }, 
//           flexShrink: 0,
//           order: { xs: 2, lg: 1 }
//         }}>
//           <Stack spacing={{ xs: 2, sm: 3 }}>
//             <GroupNavigation 
//               onNavigateToWhiteboard={handleNavigateToWhiteboard}
//               onNavigateToEditor={handleNavigateToEditor}
//             />
//             <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
//               <GroupChat groupId={groupId || ''} />
//             </Box>
//           </Stack>
//         </Box>

//         <Box sx={{ 
//           flex: 1, 
//           minWidth: 0,
//           order: { xs: 1, lg: 2 }
//         }}>
//           <Stack spacing={{ xs: 2, sm: 3 }}>
//             <QuizSection groupId={groupId || ''} />
//             <ResourceSection groupId={groupId || ''} />
//           </Stack>
//         </Box>
//       </Box>

//       <Box sx={{ 
//         display: { xs: 'block', lg: 'none' }, 
//         mt: { xs: 2, sm: 3 },
//         order: 3
//       }}>
//         <GroupChat groupId={groupId || ''} />
//       </Box>
//     </Box>
//   );
// };

// // export default GroupPage;
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   Breadcrumbs,
//   Link,
//   Tabs,
//   Tab,
//   Stack,
//   Skeleton,
// } from '@mui/material';
// import { Dashboard, Group, NavigateNext } from '@mui/icons-material';

// import GroupHeader from '../components/Group/GroupHeader';
// import GroupNavigation from '../components/Group/GroupNavigation';
// import QuizSection from '../components/Group/QuizSection';
// import ResourceSection from '../components/Group/ResourceSection';
// import GroupChat from '../components/Group/GroupChat';
// import { useAuth } from '../contexts/Authcontext';

// interface GroupData {
//   id: string;
//   name: string;
//   description: string;
//   memberCount: number;
//   members: Array<{ id: string; name: string; avatar: string }>;
//   recentActivity: string;
// }

// const GroupPage = () => {
//   const { workspaceId, groupId } = useParams<{ workspaceId: string; groupId: string }>();
//   const {name} = useAuth();
//   const navigate = useNavigate();
//   const [groupData, setGroupData] = useState<GroupData | null>(null);
//   const [tabIndex, setTabIndex] = useState(0);

//   useEffect(() => {
//     setGroupData({
//       id: groupId || '',
//       name: 'CS3040 Software Engineering - Group 12',
//       description: 'Software Engineering project group focused on developing a collaborative learning platform',
//       memberCount: 6,
//       members: [
//         { id: '1', name: 'Theekshana', avatar: '' },
//         { id: '2', name: 'vinuka', avatar: '' },
//         { id: '3', name: 'Erandathe', avatar: '' },
//         { id: '4', name: 'Sachini Fernando', avatar: '' },
//         { id: '5', name: 'Nimesh Rajapaksha', avatar: '' },
//         { id: '6', name: 'Dilani Wickramasinghe', avatar: '' },
//       ],
//       recentActivity: '15 minutes ago',
//     });
//   }, [workspaceId, groupId]);

//   const handleTabChange = (_: any, newValue: number) => {
//     setTabIndex(newValue);
//   };

//   const handleNavigateToWhiteboard = () => {
//     navigate(`/whiteboard`);
//   };

//   const handleNavigateToEditor = () => {
//     navigate(`/document-editor`);
//   };

//   if (!groupData) {
//     return (
//       <Box sx={{ py: 4, px: 2 }}>
//         <Skeleton variant="text" width="40%" />
//         <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ py: { xs: 1, sm: 2, md: 3 }, px: { xs: 1, sm: 2, md: 3 }, maxWidth: '1400px', mx: 'auto' }}>
//       {/* Breadcrumbs */}
//       <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: { xs: 2, sm: 3 } }}>
//         <Link
//           color="inherit"
//           href="#"
//           onClick={() => navigate(`/workspace/${workspaceId}`)}
//           sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
//         >
//           <Dashboard sx={{ mr: 0.5 }} />
//           <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Workspace</Box>
//         </Link>
//         <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
//           <Group sx={{ mr: 0.5 }} />
//           <Box sx={{ display: { xs: 'none', sm: 'block' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
//             {groupData.name}
//           </Box>
//           <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Group</Box>
//         </Typography>
//       </Breadcrumbs>

//       {/* Group Header */}
//       <GroupHeader groupData={groupData} />

//       {/* Tabs */}
//       <Box sx={{ mt: 3 }}>
//         <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
//           <Tab label="Navigation" />
//           <Tab label="Quizzes" />
//           <Tab label="Resources" />
//           <Tab label="Chat" />
//         </Tabs>

//         <Box sx={{ mt: 2 }}>
//           {tabIndex === 0 && (
//             <Stack spacing={2}>
//               <GroupNavigation onNavigateToWhiteboard={handleNavigateToWhiteboard} onNavigateToEditor={handleNavigateToEditor} />
//             </Stack>
//           )}
//           {tabIndex === 1 && <QuizSection groupId={groupId || ''} />}
//           {tabIndex === 2 && <ResourceSection groupId={groupId || ''} />}
//           {tabIndex === 3 && <GroupChat groupId={groupId || ''}  currentUser={name || 'Theekshana'} />}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default GroupPage;
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
import ResourceSection from '../components/Group/ResourceSection';
import GroupChat from '../components/Group/GroupChat';
import { useAuth } from '../contexts/Authcontext';

interface GroupData {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: Array<{ id: string; name: string; avatar: string }>;
  recentActivity: string;
}

const GroupPage = () => {
  const { workspaceId, groupId } = useParams<{ workspaceId: string; groupId: string }>();
  const { name } = useAuth();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  // Fetch group data (simulate async call)
  useEffect(() => {
    setGroupData({
      id: groupId || '',
      name: 'CS3040 Software Engineering - Group 12',
      description:
        'Software Engineering project group focused on developing a collaborative learning platform',
      memberCount: 6,
      members: [
        { id: '1', name: 'Theekshana', avatar: '' },
        { id: '2', name: 'Vinuka', avatar: '' },
        { id: '3', name: 'Erandathe', avatar: '' },
        { id: '4', name: 'Sachini Fernando', avatar: '' },
        { id: '5', name: 'Nimesh Rajapaksha', avatar: '' },
        { id: '6', name: 'Dilani Wickramasinghe', avatar: '' },
      ],
      recentActivity: '15 minutes ago',
    });
  }, [workspaceId, groupId]);

  const handleTabChange = (_: any, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleNavigateToWhiteboard = () => navigate(`/whiteboard`);
  const handleNavigateToEditor = () => navigate(`/document-editor`);

  // Loader while fetching data
  if (!groupData) {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="rectangular" height={250} sx={{ mt: 2, borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 1, sm: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 3 },
        width: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
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
          onClick={() => navigate(`/workspace/${workspaceId}`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
            cursor: 'pointer',
          }}
        >
          <Dashboard sx={{ mr: 0.5 }} />
          <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>Workspace</Typography>
        </Link>

        <Typography
          color="text.primary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
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
      <GroupHeader groupData={groupData} />

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
              groupId={groupId || ''}
              currentUser={name || 'Anonymous'}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GroupPage;
