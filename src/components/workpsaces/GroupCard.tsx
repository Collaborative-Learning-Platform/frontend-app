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
  Chip,
  alpha,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Person as PersonIcon,
  Circle as CircleIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
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
  isActive = true,
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
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`
          : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha('#f8fafc', 0.8)} 100%)`,
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
        },
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: theme.palette.mode === 'dark'
            ? `0 20px 40px ${alpha(theme.palette.common.black, 0.4)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}`
            : `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}`,
          '&::before': {
            height: 6,
          },
        },
        boxShadow: theme.palette.mode === 'dark'
          ? `0 8px 32px ${alpha(theme.palette.common.black, 0.3)}`
          : `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
      }}
    >
      <CardActionArea 
        onClick={() => onClick?.(id)} 
        sx={{ 
          height: '100%', 
          alignItems: 'stretch',
          display: 'flex',
          flexDirection: 'column',
          p: 0,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 2.5, sm: 3 },
            position: 'relative',
          }}
        >
          {/* Status Badge */}
          <Box sx={{ 
            position: 'absolute', 
            top: { xs: 16, sm: 20 }, 
            right: { xs: 16, sm: 24 },
          }}>
            <Chip
              label={isActive ? 'Active' : 'Inactive'}
              size="small"
              icon={
                <CircleIcon 
                  sx={{ 
                    fontSize: '0.75rem !important',
                    color: 'inherit !important',
                  }} 
                />
              }
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '12px',
                bgcolor: isActive 
                  ? alpha(theme.palette.success.main, 0.15)
                  : alpha(theme.palette.text.secondary, 0.1),
                color: isActive 
                  ? theme.palette.success.main 
                  : theme.palette.text.secondary,
                border: `1px solid ${isActive 
                  ? alpha(theme.palette.success.main, 0.3)
                  : alpha(theme.palette.text.secondary, 0.2)}`,
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          </Box>

          {/* Type Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                bgcolor: isMainGroup 
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.text.secondary, 0.08),
                border: `1px solid ${isMainGroup 
                  ? alpha(theme.palette.primary.main, 0.3)
                  : alpha(theme.palette.text.secondary, 0.15)}`,
              }}
            >
              {isMainGroup ? (
                <StarIcon sx={{ 
                  fontSize: 16, 
                  color: theme.palette.primary.main,
                }} />
              ) : (
                <GroupsIcon sx={{ 
                  fontSize: 16, 
                  color: theme.palette.text.secondary,
                }} />
              )}
              <Typography 
                variant="caption" 
                sx={{
                  color: isMainGroup ? theme.palette.primary.main : theme.palette.text.secondary,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '0.7rem',
                }}
              >
                {isMainGroup ? 'Main Group' : 'Study Group'}
              </Typography>
            </Box>
          </Box>

          {/* Group Name */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1.2,
              mb: description ? 1.5 : 0,
              pr: { xs: 6, sm: 8 }, 
              background: isMainGroup 
                ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                : 'none',
              ...(isMainGroup && {
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }),
            }}
          >
            {name}
          </Typography>

          {/* Description */}
          {description && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                lineHeight: 1.5,
                fontSize: '0.875rem',
                opacity: 0.8,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {/* Content Section */}
        <CardContent sx={{ 
          flexGrow: 1, 
          px: { xs: 2, sm: 3 }, 
          py: { xs: 1.5, sm: 2 },
          pt: 0,
        }}>
          {/* Members Section */}
          <Box sx={{ mb: lastActivity ? 2 : 0 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
            }}>
              {/* Member Count */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ 
                  fontSize: 18, 
                  color: theme.palette.text.secondary,
                  opacity: 0.7,
                }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500,
                    opacity: 0.8,
                  }}
                >
                  {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </Typography>
              </Box>

              {/* Avatar Group */}
              {members.length > 0 && (
                <AvatarGroup 
                  max={3} 
                  sx={{ 
                    '& .MuiAvatar-root': { 
                      width: 32, 
                      height: 32, 
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      border: `2px solid ${theme.palette.background.paper}`,
                      boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.15)}`,
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        zIndex: 10,
                      },
                    },
                    '& .MuiAvatarGroup-avatar': {
                      bgcolor: alpha(theme.palette.text.secondary, 0.1),
                      color: theme.palette.text.secondary,
                      fontSize: '0.75rem',
                    },
                  }}
                >
                  {members.map((member, index) => (
                    <Avatar 
                      key={member.id} 
                      src={member.avatar}
                      sx={{
                        backgroundColor: `hsl(${(index * 137.508) % 360}, 70%, ${theme.palette.mode === 'dark' ? '60%' : '50%'})`,
                        color: 'white',
                      }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </Avatar>
                  ))}
                </AvatarGroup>
              )}
            </Box>
          </Box>

          {/* Last Activity */}
          {lastActivity && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mt: 'auto',
              pt: 1,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}>
              <AccessTimeIcon sx={{ 
                fontSize: 16, 
                color: theme.palette.text.secondary,
                opacity: 0.6,
              }} />
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.75rem',
                  opacity: 0.7,
                }}
              >
                Last active: {lastActivity}
              </Typography>
            </Box>
          )}

          {/* Footer Slot */}
          {footerSlot && (
            <Box sx={{ mt: 2, pt: 1.5 }}>
              {footerSlot}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GroupCard;
