import { Box, Typography, Card, Avatar, AvatarGroup, Chip } from '@mui/material';
import { Group, AccessTime } from '@mui/icons-material';

interface GroupData {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: Array<{ userId: string; name: string; email: string; role: string; avatar: string }>;
  recentActivity: string;
}

interface GroupHeaderProps {
  groupData: GroupData;
}

const GroupHeader = ({ groupData }: GroupHeaderProps) => {
  return (
    <Card sx={{ 
      p: { xs: 2, sm: 3 }, 
      mb: { xs: 2, sm: 3 }, 
      background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, #06b6d4 100%)`,
      boxShadow: (theme) => `0 10px 25px ${theme.palette.primary.main}33`
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: { xs: 2, sm: 0 }
      }}>
        <Avatar sx={{ 
          bgcolor: 'rgba(255,255,255,0.15)', 
          mr: { xs: 0, sm: 2 }, 
          width: { xs: 48, sm: 56 }, 
          height: { xs: 48, sm: 56 },
          backdropFilter: 'blur(10px)'
        }}>
          <Group sx={{ fontSize: { xs: 24, sm: 28 }, color: 'white' }} />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: 'white', 
              fontWeight: 700, 
              mb: 0.5,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              lineHeight: 1.2
            }}
          >
            {groupData.name}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              mb: 2,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              lineHeight: 1.5
            }}
          >
            {groupData.description}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            gap: { xs: 1.5, sm: 2 }, 
            flexWrap: 'wrap' 
          }}>
            <Chip 
              icon={<AccessTime sx={{ fontSize: 16 }} />} 
              label={`Active : ${groupData.recentActivity}`}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.15)', 
                color: 'white',
                backdropFilter: 'blur(10px)',
                fontSize: '0.875rem'
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AvatarGroup 
                max={4} 
                sx={{ 
                  '& .MuiAvatar-root': { 
                    width: { xs: 28, sm: 32 }, 
                    height: { xs: 28, sm: 32 }, 
                    fontSize: '0.75rem',
                    border: '2px solid rgba(255,255,255,0.3)'
                  } 
                }}
              >
                {groupData.members.map((member) => (
                  <Avatar src={member.avatar} key={member.userId} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Avatar>
                ))}
              </AvatarGroup>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  ml: 1,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                {groupData.memberCount} members
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default GroupHeader;