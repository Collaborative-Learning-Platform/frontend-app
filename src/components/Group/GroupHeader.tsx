import { Box, Typography, Card, Avatar, AvatarGroup, Chip, Button } from '@mui/material';
import { Group, AccessTime, PersonAdd } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

interface GroupMember {
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  s3Avatar?: string;
}

interface GroupData {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: Array<GroupMember>;
  recentActivity: string;
  type?: "Main" | "Custom";
}

interface GroupHeaderProps {
  groupData: GroupData;
  onAddUsers?: () => void;
}

const GroupHeader = ({ groupData, onAddUsers }: GroupHeaderProps) => {
  const [membersWithS3Avatars, setMembersWithS3Avatars] = useState<GroupMember[]>([]);

  const setS3DownloadURL = async (userId: string) => {
    try {
      const response = await axiosInstance.post('/storage/generate-profile-pic-download-url', { userId });
      if (response.data.success) {
        return response.data.downloadUrl;
      }
    } catch (error) {
      console.error('Error fetching S3 profile picture:', error);
    }
    return null;
  };

  // Fetch S3 profile pictures for all members
  useEffect(() => {
    const fetchMemberAvatars = async () => {
      const updatedMembers = [...groupData.members];
      
      for (const member of updatedMembers) {
        const s3Avatar = await setS3DownloadURL(member.userId);
        if (s3Avatar) {
          member.s3Avatar = s3Avatar;
        }
      }
      
      setMembersWithS3Avatars(updatedMembers);
    };

    if (groupData.members && groupData.members.length > 0) {
      fetchMemberAvatars();
    }
  }, [groupData.members]);

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
                {(membersWithS3Avatars.length > 0 ? membersWithS3Avatars : groupData.members).map((member) => (
                  <Avatar 
                    src={member.s3Avatar || member.avatar} 
                    key={member.userId} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                  >
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
        {/* Add Users Button - Only show for custom groups */}
        {groupData.type === "Custom" && onAddUsers && (
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={onAddUsers}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
              mt: { xs: 2, sm: 0 },
              alignSelf: { xs: 'flex-start', sm: 'flex-start' }
            }}
          >
            Add Users
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default GroupHeader;