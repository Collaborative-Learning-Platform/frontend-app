import React from 'react';
import { 
  Card, 
  CardActionArea, 
  CardContent, 
  Typography, 
  Box, 
  useTheme,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Person as PersonIcon,
  Circle as CircleIcon,
  Star as StarIcon,
} from '@mui/icons-material';

export interface GroupCardProps {
  id: number | string;
  name: string;
  type?: 'main' | 'other';
  description?: string;
  memberCount?: number;
  isActive?: boolean;
  lastActivity?: string;
  members?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  onClick?: (id: number | string) => void;
  footerSlot?: React.ReactNode;
}


const GroupCard: React.FC<GroupCardProps> = ({ 
  id, 
  name, 
  type = 'other', 
  description, 
  memberCount = 0,
  isActive = false,
  lastActivity,
  members = [],
  onClick, 
  footerSlot 
}) => {
  const theme = useTheme();
  const isMainGroup = type === 'main';

  return (
    <Card 
      sx={{
        height: '100%',
        borderRadius: 1,
        border: `1px solid ${isMainGroup ? theme.palette.primary.main : theme.palette.divider}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardActionArea 
        onClick={() => onClick?.(id)} 
        sx={{ 
          height: '100%', 
          alignItems: 'stretch',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: isMainGroup 
              ? `${theme.palette.primary.main}08` 
              : 'transparent',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMainGroup ? (
                <StarIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              ) : (
                <GroupsIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
              )}
              <Typography 
                variant="caption" 
                sx={{
                  color: isMainGroup ? theme.palette.primary.main : theme.palette.text.secondary,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {isMainGroup ? 'Main Group' : 'Study Group'}
              </Typography>
            </Box>
            
            {/* Activity Indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CircleIcon 
                sx={{ 
                  fontSize: 8, 
                  color: isActive ? theme.palette.success.main : theme.palette.text.disabled 
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.7rem',
                  color: isActive ? theme.palette.success.main : theme.palette.text.disabled,
                  fontWeight: 500,
                }}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Typography>
            </Box>
          </Box>

          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '1.1rem', 
              fontWeight: 600,
              color: theme.palette.text.primary,
              lineHeight: 1.3,
            }}
          >
            {name}
          </Typography>
        </Box>

        {/* Content Section */}
        <CardContent sx={{ flexGrow: 1, px: 2.5, py: 2 }}>
          {description && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                lineHeight: 1.4,
                fontSize: '0.875rem',
              }}
            >
              {description}
            </Typography>
          )}

          {/* Members Section */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PersonIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: '0.8rem', fontWeight: 500 }}
              >
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </Typography>
            </Box>

            {/* Avatar Group */}
            {members.length > 0 && (
              <AvatarGroup 
                max={4} 
                sx={{ 
                  '& .MuiAvatar-root': { 
                    width: 28, 
                    height: 28, 
                    fontSize: '0.8rem',
                    border: `2px solid ${theme.palette.background.paper}`,
                  },
                }}
              >
                {members.map((member) => (
                  <Avatar 
                    key={member.id} 
                    src={member.avatar}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                    }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </Avatar>
                ))}
              </AvatarGroup>
            )}
          </Box>

          {/* Last Activity */}
          {lastActivity && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.75rem',
                display: 'block',
                mb: 1,
              }}
            >
              Last active: {lastActivity}
            </Typography>
          )}

          {/* Footer Slot */}
          {footerSlot && (
            <Box sx={{ mt: 'auto', pt: 1 }}>
              {footerSlot}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GroupCard;
