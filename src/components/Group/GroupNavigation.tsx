// import { Card, CardContent, Typography, Box, Button } from '@mui/material';
// import { 
//   Chat, 
//   Dashboard, 
//   Description, 
//   Quiz, 
//   Folder,
//   ArrowForward 
// } from '@mui/icons-material';

// interface GroupNavigationProps {
//   onNavigateToWhiteboard: () => void;
//   onNavigateToEditor: () => void;
// }

// const GroupNavigation = ({ onNavigateToWhiteboard, onNavigateToEditor }: GroupNavigationProps) => {
//   const navigationItems = [
//     {
//       title: 'Group Chat',
//       description: 'Real-time messaging',
//       icon: <Chat sx={{ fontSize: { xs: 20, sm: 24 } }} />,
//       colorKey: 'chat' as const,
//       action: () => document.getElementById('group-chat')?.scrollIntoView({ behavior: 'smooth' })
//     },
//     {
//       title: 'Whiteboard',
//       description: 'Collaborative drawing',
//       icon: <Dashboard sx={{ fontSize: { xs: 20, sm: 24 } }} />,
//       colorKey: 'whiteboard' as const,
//       action: onNavigateToWhiteboard
//     },
//     {
//       title: 'Document Editor',
//       description: 'Shared documents',
//       icon: <Description sx={{ fontSize: { xs: 20, sm: 24 } }} />,
//       colorKey: 'editor' as const,
//       action: onNavigateToEditor
//     },
//     {
//       title: 'Quiz Section',
//       description: 'Practice & assessments',
//       icon: <Quiz sx={{ fontSize: { xs: 20, sm: 24 } }} />,
//       colorKey: 'quiz' as const,
//       action: () => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })
//     },
//     {
//       title: 'Resources',
//       description: 'Files & materials',
//       icon: <Folder sx={{ fontSize: { xs: 20, sm: 24 } }} />,
//       colorKey: 'resources' as const,
//       action: () => document.getElementById('resource-section')?.scrollIntoView({ behavior: 'smooth' })
//     }
//   ];

//   return (
//     <Card sx={{ overflow: 'visible' }}>
//       <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
//         <Typography 
//           variant="h6" 
//           sx={{ 
//             mb: { xs: 2, sm: 3 }, 
//             fontWeight: 700,
//             color: 'text.primary',
//             fontSize: { xs: '1.125rem', sm: '1.25rem' }
//           }}
//         >
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
//                 bgcolor: 'grey.50',
//                 border: '1px solid transparent',
//                 '&:hover': {
//                   bgcolor: 'white',
//                   transform: 'translateY(-1px)',
//                   boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
//                   border: '1px solid rgba(0,0,0,0.05)'
//                 },
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
//               }}
//             >
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
//                 <Box sx={{ 
//                   p: { xs: 0.75, sm: 1 }, 
//                   borderRadius: 2.5, 
//                   bgcolor: (theme) => theme.palette.primary.main,
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
//                   <Typography 
//                     variant="subtitle2" 
//                     sx={{ 
//                       fontWeight: 600, 
//                       color: 'text.primary',
//                       fontSize: { xs: '0.875rem', sm: '1rem' },
//                       lineHeight: 1.3
//                     }}
//                   >
//                     {item.title}
//                   </Typography>
//                   <Typography 
//                     variant="caption" 
//                     sx={{ 
//                       color: 'text.secondary',
//                       fontSize: { xs: '0.75rem', sm: '0.875rem' },
//                       display: { xs: 'none', sm: 'block' }
//                     }}
//                   >
//                     {item.description}
//                   </Typography>
//                 </Box>
//               </Box>
//               <ArrowForward sx={{ 
//                 color: 'text.secondary',
//                 fontSize: { xs: 18, sm: 20 }
//               }} />
//             </Button>
//           ))}
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default GroupNavigation;
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Chat, Dashboard, Description, Quiz, Folder, ArrowForward } from '@mui/icons-material';

interface GroupNavigationProps {
  onNavigateToWhiteboard: () => void;
  onNavigateToEditor: () => void;
}

const GroupNavigation = ({ onNavigateToWhiteboard, onNavigateToEditor }: GroupNavigationProps) => {
  const navigationItems = [
    {
      title: 'Group Chat',
      description: 'Real-time messaging',
      icon: <Chat />,
      action: () => document.getElementById('group-chat')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      title: 'Whiteboard',
      description: 'Collaborative drawing',
      icon: <Dashboard />,
      action: onNavigateToWhiteboard
    },
    {
      title: 'Document Editor',
      description: 'Shared documents',
      icon: <Description />,
      action: onNavigateToEditor
    },
    {
      title: 'Quiz Section',
      description: 'Practice & assessments',
      icon: <Quiz />,
      action: () => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      title: 'Resources',
      description: 'Files & materials',
      icon: <Folder />,
      action: () => document.getElementById('resource-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  ];

  return (
    <Card sx={{ overflow: 'visible' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h6" 
          sx={{ mb: { xs: 2, sm: 3 }, fontWeight: 700, color: 'text.primary' }}
        >
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
                bgcolor: 'background.paper',
                border: '1px solid transparent',
                '&:hover': {
                  bgcolor: 'primary.light',
                  transform: 'translateY(-1px)',
                  boxShadow: 2,
                  border: '1px solid rgba(0,0,0,0.05)'
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ 
                  p: { xs: 0.75, sm: 1 }, 
                  borderRadius: 2.5, 
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: { xs: 36, sm: 44 },
                  minHeight: { xs: 36, sm: 44 }
                }}>
                  {item.icon}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}
                  >
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
