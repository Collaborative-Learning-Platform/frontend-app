// import { Card, CardContent, Typography, Box, Button, useTheme } from '@mui/material';
// import { Chat, Dashboard, Description, Quiz, Folder, ArrowForward } from '@mui/icons-material';

// interface GroupNavigationProps {
//   onNavigateToWhiteboard: () => void;
//   onNavigateToEditor: () => void;
// }

// const GroupNavigation = ({ onNavigateToWhiteboard, onNavigateToEditor }: GroupNavigationProps) => {
//   const theme = useTheme();

//   const navigationItems = [
//     {
//       title: 'Group Chat',
//       description: 'Real-time messaging',
//       icon: <Chat />,
//       action: () => document.getElementById('group-chat')?.scrollIntoView({ behavior: 'smooth' })
//     },
//     {
//       title: 'Whiteboard',
//       description: 'Collaborative drawing',
//       icon: <Dashboard />,
//       action: onNavigateToWhiteboard
//     },
//     {
//       title: 'Document Editor',
//       description: 'Shared documents',
//       icon: <Description />,
//       action: onNavigateToEditor
//     },
//     {
//       title: 'Quiz Section',
//       description: 'Practice & assessments',
//       icon: <Quiz />,
//       action: () => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })
//     },
//     {
//       title: 'Resources',
//       description: 'Files & materials',
//       icon: <Folder />,
//       action: () => document.getElementById('resource-section')?.scrollIntoView({ behavior: 'smooth' })
//     }
//   ];

//   return (
//     <Card sx={{ overflow: 'visible', bgcolor: theme.palette.background.paper }}>
//       <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
//         <Typography variant="h6" sx={{ mb: { xs: 2, sm: 3 }, fontWeight: 700, color: 'text.primary' }}>
//           Quick Actions
//         </Typography>

//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
//           {navigationItems.map((item, index) => (
//             <Button
//               key={index}
//               onClick={item.action}
//               sx={{
//                 p: { xs: 1.5, sm: 2 },
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 textAlign: 'left',
//                 borderRadius: 3,
//                 bgcolor: theme.palette.background.paper,
//                 border: '1px solid transparent',
//                 '&:hover': {
//                   bgcolor: theme.palette.action.hover, // subtle gray
//                   transform: 'translateY(-1px)',
//                   boxShadow: theme.shadows[2],
//                   border: `1px solid ${theme.palette.divider}`
//                 },
//                 transition: 'all 0.3s ease-in-out'
//               }}
//             >
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
//                 <Box sx={{ 
//                   p: { xs: 0.75, sm: 1 }, 
//                   borderRadius: 2.5, 
//                   bgcolor: theme.palette.primary.main,
//                   color: 'white',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   minWidth: { xs: 36, sm: 44 },
//                   minHeight: { xs: 36, sm: 44 }
//                 }}>
//                   {item.icon}
//                 </Box>
//                 <Box sx={{ minWidth: 0, flex: 1 }}>
//                   <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
//                     {item.title}
//                   </Typography>
//                   <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
//                     {item.description}
//                   </Typography>
//                 </Box>
//               </Box>
//               <ArrowForward sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
//             </Button>
//           ))}
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default GroupNavigation;
import { Card, CardContent, Typography, Box, Button, useTheme } from '@mui/material';
import { Chat, Dashboard, Description, Quiz, Folder, ArrowForward } from '@mui/icons-material';

interface GroupNavigationProps {
  onNavigateToWhiteboard: () => void;
  onNavigateToEditor: () => void;
  setTabIndex: (index: number) => void;
}

const GroupNavigation = ({ onNavigateToWhiteboard, onNavigateToEditor, setTabIndex }: GroupNavigationProps) => {
  const theme = useTheme();

  const navigationItems = [
    {
      title: 'Group Chat',
      description: 'Real-time messaging',
      icon: <Chat />,
      action: () => setTabIndex(3), // Switch to Chat tab
    },
    {
      title: 'Whiteboard',
      description: 'Collaborative drawing',
      icon: <Dashboard />,
      action: onNavigateToWhiteboard,
    },
    {
      title: 'Document Editor',
      description: 'Shared documents',
      icon: <Description />,
      action: onNavigateToEditor,
    },
    {
      title: 'Quiz Section',
      description: 'Practice & assessments',
      icon: <Quiz />,
      action: () => setTabIndex(1), // Switch to Quiz tab
    },
    {
      title: 'Resources',
      description: 'Files & materials',
      icon: <Folder />,
      action: () => setTabIndex(2), // Switch to Resources tab
    },
  ];

  return (
    <Card sx={{ overflow: 'visible', bgcolor: theme.palette.background.paper, boxShadow: theme.shadows[4], borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ mb: { xs: 2, sm: 3 }, fontWeight: 700, color: 'text.primary' }}>
          Quick Actions
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              onClick={item.action}
              sx={{
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
                border: '1px solid transparent',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                  transform: 'translateY(-1px)',
                  boxShadow: theme.shadows[2],
                  border: `1px solid ${theme.palette.divider}`,
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    p: { xs: 0.75, sm: 1 },
                    borderRadius: 2.5,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: { xs: 36, sm: 44 },
                    minHeight: { xs: 36, sm: 44 },
                  }}
                >
                  {item.icon}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                    {item.description}
                  </Typography>
                </Box>
              </Box>
              <ArrowForward sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }} />
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default GroupNavigation;
