import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  TextField, 
  IconButton, 
  Avatar,
  Divider,
  Badge
} from '@mui/material';
import { Send, MoreVert } from '@mui/icons-material';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
}

interface GroupChatProps {
  groupId: string;
}

const GroupChat = ({ groupId }: GroupChatProps) => {
  const [message, setMessage] = useState('');
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Theekshana Dissanayake',
      content: 'Hey everyone! Ready for today\'s sprint review?',
      timestamp: '10:30 AM',
      avatar: 'TD'
    },
    {
      id: '2',
      sender: 'Kavindi Silva',
      content: 'Yes! I\'ve completed the user authentication module.',
      timestamp: '10:32 AM',
      avatar: 'KS'
    },
    {
      id: '3',
      sender: 'Ravindu Perera',
      content: 'Great work! The database integration is also ready.',
      timestamp: '10:35 AM',
      avatar: 'RP'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <Card 
      id="group-chat" 
      sx={{ 
        height: { xs: 450, sm: 500, lg: 550 }, 
        display: 'flex', 
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                color: 'text.primary'
              }}
            >
              Group Chat
            </Typography>
            <Badge 
              badgeContent={3} 
              sx={{ 
                ml: 1,
                '& .MuiBadge-badge': {
                  bgcolor: (theme) => theme.palette.accent.chat,
                  color: 'white'
                }
              }} 
            />
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreVert />
          </IconButton>
        </Box>
      </CardContent>
      
      <Divider />
      
      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, sm: 3 } }}>
        {messages.map((msg, index) => (
          <Box key={msg.id} sx={{ mb: { xs: 2, sm: 2.5 }, display: 'flex', gap: { xs: 1, sm: 1.5 } }}>
            <Avatar sx={{ 
              width: { xs: 32, sm: 36 }, 
              height: { xs: 32, sm: 36 }, 
              fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
              bgcolor: 'primary.main',
              fontWeight: 600
            }}>
              {msg.avatar}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: 'text.primary'
                  }}
                >
                  {msg.sender}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {msg.timestamp}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.primary',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.5
                }}
              >
                {msg.content}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      
      <Divider />
      
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 3,
                bgcolor: 'grey.50',
                border: '1px solid rgba(0,0,0,0.08)',
                '&:hover': {
                  border: '1px solid rgba(0,0,0,0.12)'
                },
                '&.Mui-focused': {
                  border: (theme) => `2px solid ${theme.palette.primary.main}`,
                  bgcolor: 'white'
                }
              },
              '& .MuiOutlinedInput-input': {
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
          />
          <IconButton 
            onClick={handleSendMessage}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              width: { xs: 40, sm: 44 },
              height: { xs: 40, sm: 44 },
              '&:hover': { 
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <Send sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default GroupChat;