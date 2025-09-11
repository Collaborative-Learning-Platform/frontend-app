// import { 
//   Card, 
//   CardContent, 
//   Typography, 
//   Box, 
//   Button, 
//   IconButton,
//   Avatar,
//   Divider,
//   Chip,
//   Stack,
//   useTheme
// } from '@mui/material';
// import { 
//   Folder, 
//   InsertDriveFile, 
//   PictureAsPdf, 
//   VideoLibrary, 
//   Link as LinkIcon,
//   Download,
//   MoreVert,
//   Add
// } from '@mui/icons-material';

// interface Resource {
//   id: string;
//   name: string;
//   type: 'pdf' | 'video' | 'link' | 'document';
//   size?: string;
//   uploadedBy: string;
//   uploadedAt: string;
//   url: string;
// }

// interface ResourceSectionProps {
//   groupId: string;
// }

// const ResourceSection = ({ groupId }: ResourceSectionProps) => {
//   const theme = useTheme();

//   const resources: Resource[] = [
//     {
//       id: '1',
//       name: 'Software Engineering Principles.pdf',
//       type: 'pdf',
//       size: '2.4 MB',
//       uploadedBy: 'Theekshana Dissanayake',
//       uploadedAt: '2 hours ago',
//       url: '#'
//     },
//     {
//       id: '2',
//       name: 'Agile Development Tutorial',
//       type: 'video',
//       size: '45.2 MB',
//       uploadedBy: 'Kavindi Silva',
//       uploadedAt: '1 day ago',
//       url: '#'
//     },
//     {
//       id: '3',
//       name: 'React Documentation',
//       type: 'link',
//       uploadedBy: 'Ravindu Perera',
//       uploadedAt: '3 days ago',
//       url: 'https://reactjs.org/docs'
//     },
//     {
//       id: '4',
//       name: 'Project Requirements.docx',
//       type: 'document',
//       size: '1.8 MB',
//       uploadedBy: 'Sachini Fernando',
//       uploadedAt: '1 week ago',
//       url: '#'
//     }
//   ];

//   const getResourceIcon = (type: string) => {
//     switch (type) {
//       case 'pdf': return <PictureAsPdf sx={{ color: '#f44336' }} />;
//       case 'video': return <VideoLibrary sx={{ color: '#2196f3' }} />;
//       case 'link': return <LinkIcon sx={{ color: '#4caf50' }} />;
//       case 'document': return <InsertDriveFile sx={{ color: '#ff9800' }} />;
//       default: return <InsertDriveFile />;
//     }
//   };

//   const getResourceTypeLabel = (type: string) => {
//     switch (type) {
//       case 'pdf': return 'PDF';
//       case 'video': return 'Video';
//       case 'link': return 'Link';
//       case 'document': return 'Document';
//       default: return 'File';
//     }
//   };

//   return (
//     <Card id="resource-section" sx={{ borderRadius: 3, boxShadow: theme.shadows[4], mb: 3 }}>
//       <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
//         {/* Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 2 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
//               <Folder sx={{ fontSize: 24 }} />
//             </Avatar>
//             <Box>
//               <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
//                 Resources
//               </Typography>
//               <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                 Shared files and materials
//               </Typography>
//             </Box>
//           </Box>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             sx={{
//               bgcolor: theme.palette.primary.main,
//               '&:hover': { bgcolor: theme.palette.primary.dark, transform: 'translateY(-1px)' },
//               px: 3,
//               py: 1.5,
//               fontWeight: 600,
//               minWidth: { xs: '100%', sm: 'auto' },
//               transition: 'all 0.3s ease'
//             }}
//           >
//             Add Resource
//           </Button>
//         </Box>

//         {/* Resource List */}
//         <Stack spacing={2}>
//           {resources.map((res, idx) => (
//             <Box key={res.id}>
//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   p: 2,
//                   borderRadius: 2,
//                   bgcolor: theme.palette.background.default,
//                   '&:hover': { boxShadow: theme.shadows[6], transform: 'translateX(4px)' },
//                   transition: 'all 0.3s ease'
//                 }}
//               >
//                 <Avatar sx={{ bgcolor: 'transparent', mr: 2 }}>
//                   {getResourceIcon(res.type)}
//                 </Avatar>
//                 <Box sx={{ flex: 1, minWidth: 0 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
//                     <Typography variant="subtitle2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                       {res.name}
//                     </Typography>
//                     <Chip label={getResourceTypeLabel(res.type)} size="small" variant="outlined" />
//                   </Box>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
//                     <Typography variant="caption" sx={{ color: 'text.secondary' }}>By {res.uploadedBy}</Typography>
//                     <Typography variant="caption" sx={{ color: 'text.secondary' }}>{res.uploadedAt}</Typography>
//                     {res.size && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{res.size}</Typography>}
//                   </Box>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <IconButton sx={{ color: theme.palette.primary.main }}><Download /></IconButton>
//                   <IconButton sx={{ color: 'text.secondary' }}><MoreVert /></IconButton>
//                 </Box>
//               </Box>
//               {idx < resources.length - 1 && <Divider />}
//             </Box>
//           ))}
//         </Stack>

//         {/* Footer */}
//         <Box sx={{ mt: 3, textAlign: 'center' }}>
//           <Button
//             variant="outlined"
//             sx={{
//               px: 4,
//               py: 1.5,
//               borderColor: theme.palette.primary.main,
//               color: theme.palette.primary.main,
//               fontWeight: 600,
//               '&:hover': { bgcolor: `${theme.palette.primary.main}0A`, transform: 'translateY(-1px)' },
//               transition: 'all 0.3s ease'
//             }}
//           >
//             View All Resources
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default ResourceSection;
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Avatar,
  Divider,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import { 
  Folder, 
  InsertDriveFile, 
  PictureAsPdf, 
  VideoLibrary, 
  Link as LinkIcon,
  Download,
  MoreVert,
  Add
} from '@mui/icons-material';

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  size?: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

interface ResourceSectionProps {
  groupId: string;
}

const ResourceSection = ({ groupId }: ResourceSectionProps) => {
  const theme = useTheme();

  const resources: Resource[] = [
    { id: '1', name: 'Software Engineering Principles.pdf', type: 'pdf', size: '2.4 MB', uploadedBy: 'Theekshana Dissanayake', uploadedAt: '2 hours ago', url: '#' },
    { id: '2', name: 'Agile Development Tutorial', type: 'video', size: '45.2 MB', uploadedBy: 'Kavindi Silva', uploadedAt: '1 day ago', url: '#' },
    { id: '3', name: 'React Documentation', type: 'link', uploadedBy: 'Ravindu Perera', uploadedAt: '3 days ago', url: 'https://reactjs.org/docs' },
    { id: '4', name: 'Project Requirements.docx', type: 'document', size: '1.8 MB', uploadedBy: 'Sachini Fernando', uploadedAt: '1 week ago', url: '#' }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <PictureAsPdf sx={{ color: theme.palette.primary.main }} />;
      case 'video': return <VideoLibrary sx={{ color: theme.palette.primary.main }} />;
      case 'link': return <LinkIcon sx={{ color: theme.palette.primary.main }} />;
      case 'document': return <InsertDriveFile sx={{ color: theme.palette.primary.main }} />;
      default: return <InsertDriveFile sx={{ color: theme.palette.primary.main }} />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'video': return 'Video';
      case 'link': return 'Link';
      case 'document': return 'Document';
      default: return 'File';
    }
  };

  return (
    <Card id="resource-section" sx={{ borderRadius: 3, boxShadow: theme.shadows[4], mb: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
              <Folder sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Resources
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Shared files and materials
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark, transform: 'translateY(-1px)' },
              px: 3,
              py: 1.5,
              fontWeight: 600,
              minWidth: { xs: '100%', sm: 'auto' },
              transition: 'all 0.3s ease'
            }}
          >
            Add Resource
          </Button>
        </Box>

        {/* Resource List */}
        <Stack spacing={1}>
          {resources.map((res, idx) => (
            <Box key={res.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.default,
                  '&:hover': { boxShadow: theme.shadows[6], transform: 'translateX(4px)' },
                  transition: 'all 0.3s ease'
                }}
              >
                <Avatar sx={{ bgcolor: 'transparent', mr: 2 }}>
                  {getResourceIcon(res.type)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {res.name}
                    </Typography>
                    <Chip label={getResourceTypeLabel(res.type)} size="small" variant="outlined" sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>By {res.uploadedBy}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{res.uploadedAt}</Typography>
                    {res.size && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{res.size}</Typography>}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton sx={{ color: theme.palette.primary.main }}><Download /></IconButton>
                  <IconButton sx={{ color: 'text.secondary' }}><MoreVert /></IconButton>
                </Box>
              </Box>
              {idx < resources.length - 1 && <Divider />}
            </Box>
          ))}
        </Stack>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            sx={{
              px: 4,
              py: 1.5,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              fontWeight: 600,
              '&:hover': { bgcolor: `${theme.palette.primary.main}0A`, transform: 'translateY(-1px)' },
              transition: 'all 0.3s ease'
            }}
          >
            View All Resources
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResourceSection;
