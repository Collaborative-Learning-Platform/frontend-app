import { useEffect, useState, useRef } from "react"
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  useTheme,
  Chip,
  Fade,
} from "@mui/material"
import { Send, MoreVert, Circle } from "@mui/icons-material"
import { io, Socket } from "socket.io-client"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  avatar: string
  self?: boolean
}

interface GroupChatProps {
  groupId: string
  currentUserName: string
}

let socket: Socket 

const GroupChat = ({ groupId, currentUserName }: GroupChatProps) => {
  const theme = useTheme()
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState("")
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
  
  socket = io(import.meta.env.VITE_BASEURL)

  socket.on('connect', () => {
    console.log('Connected to server:', socket.id)
    socket.emit('join_room', groupId)
    socket.emit('get_messages', groupId)
  })
  

  socket.on('messages', (msgs: any[]) => {
    setMessages(msgs.map(m => ({
      id: m.chatId,
      sender: m.sender,
      content: m.content,
      timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: m.sender.split(' ').map((n: string) => n[0].toUpperCase()).join(''),
      self: m.sender === currentUserName,
    })))
  })

  socket.on('receive_message', (msg: any) => {
    setMessages(prev => [...prev, {
      id: msg.chatId,
      sender: msg.sender,
      content: msg.content,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: msg.sender.split(' ').map((n: string) => n[0].toUpperCase()).join(''),
      self: msg.sender === currentUserName,
    }])
  })

  // Listen for typing events from other users
  socket.on('user_typing', (data: { sender: string, isTyping: boolean }) => {
    if (data.sender !== currentUserName) {
      if (data.isTyping) {
        setOtherUserTyping(data.sender)
      } else {
        setOtherUserTyping(null)
      }
    }
  })

  return () => {
    socket.disconnect()
  }
  }, []) 


  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleTyping = (text: string) => {
    setMessage(text)
    
    // Emit typing event to other users
    if (text.length > 0) {
      socket?.emit("typing", { roomId: groupId, sender: currentUserName, isTyping: true })
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Set timeout to stop typing after 2 seconds of no activity
      typingTimeoutRef.current = setTimeout(() => {
        socket?.emit("typing", { roomId: groupId, sender: currentUserName, isTyping: false })
      }, 2000)
    } else {
      socket?.emit("typing", { roomId: groupId, sender: currentUserName, isTyping: false })
    }
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMsg = {
      sender: currentUserName,
      roomId: groupId,
      content: message,
    }

    socket?.emit("send_message", newMsg)
    socket?.emit("typing", { roomId: groupId, sender: currentUserName, isTyping: false })
    setMessage("")
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: 500, sm: 600 },
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: theme.palette.mode === "dark" 
          ? "0 8px 32px rgba(0, 0, 0, 0.6)" 
          : "0 8px 32px rgba(0, 0, 0, 0.12)",
        bgcolor: theme.palette.mode === "dark" 
          ? "rgba(26, 26, 26, 0.8)" 
          : theme.palette.background.paper,
        border: `1px solid ${
          theme.palette.mode === "dark" 
            ? "rgba(255, 255, 255, 0.08)" 
            : theme.palette.divider
        }`,
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2.5,
          background: theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)"
            : "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
            }}
          >
            Group Chat
          </Typography>
          <Chip 
            label={groupId}
            size="small"
            variant="outlined"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "& .MuiChip-label": {
                fontWeight: 600,
              }
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Circle 
            sx={{ 
              fontSize: 12, 
              color: "#4ade80",
              filter: "drop-shadow(0 0 4px rgba(74, 222, 128, 0.6))"
            }} 
          />
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
            Online
          </Typography>
          <IconButton 
            size="small"
            sx={{ 
              color: theme.palette.text.secondary,
              "&:hover": { 
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          bgcolor: theme.palette.mode === "dark" ? "#0a0a0a" : "#fafafa",
          backgroundImage: theme.palette.mode === "dark" 
            ? "radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)"
            : "radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.02) 0%, transparent 50%)",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.divider,
            borderRadius: "3px",
            "&:hover": {
              background: theme.palette.text.secondary,
            }
          },
        }}
      >
        {messages.map((msg, index) => (
          <Fade in={true} timeout={300 + (index % 5) * 100} key={msg.id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: msg.self ? "row-reverse" : "row",
                alignItems: "flex-end",
                mb: 2.5,
                gap: 1.5,
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: msg.self ? theme.palette.primary.main : theme.palette.secondary.main,
                  width: 36,
                  height: 36,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  boxShadow: `0 2px 8px ${
                    msg.self ? theme.palette.primary.main + "40" : theme.palette.secondary.main + "40"
                  }`,
                }}
              >
                {msg.avatar}
              </Avatar>
              <Box
                sx={{
                  maxWidth: "75%",
                  minWidth: "120px",
                }}
              >
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1,
                  mb: 0.5,
                  justifyContent: msg.self ? "flex-end" : "flex-start",
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{
                      fontWeight: 600,
                      color: msg.self ? theme.palette.primary.main : theme.palette.secondary.main,
                      fontSize: "0.75rem",
                    }}
                  >
                    {msg.sender}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.7rem",
                    }}
                  >
                    {msg.timestamp}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: msg.self ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                    bgcolor: msg.self
                      ? theme.palette.primary.main
                      : theme.palette.mode === "dark"
                      ? "rgba(45, 45, 45, 0.8)"
                      : theme.palette.grey[100],
                    color: msg.self 
                      ? "white" 
                      : theme.palette.text.primary,
                    wordBreak: "break-word",
                    boxShadow: theme.palette.mode === "dark"
                      ? "0 2px 12px rgba(0, 0, 0, 0.4)"
                      : "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${
                      msg.self 
                        ? "transparent"
                        : theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : theme.palette.divider
                    }`,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: theme.palette.mode === "dark"
                        ? "0 4px 16px rgba(0, 0, 0, 0.5)"
                        : "0 4px 16px rgba(0, 0, 0, 0.12)",
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      lineHeight: 1.4,
                      fontSize: "0.9rem",
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Fade>
        ))}

        {otherUserTyping && (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1.5, 
            ml: 6,
            mb: 2,
          }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: theme.palette.mode === "dark" 
                  ? "rgba(45, 45, 45, 0.8)" 
                  : theme.palette.grey[100],
                border: `1px solid ${
                  theme.palette.mode === "dark" 
                    ? "rgba(255, 255, 255, 0.1)" 
                    : theme.palette.divider
                }`,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box sx={{ 
                display: "flex", 
                gap: 0.5,
                "& > div": {
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: theme.palette.primary.main,
                  animation: "pulse 1.4s ease-in-out infinite both",
                },
                "& > div:nth-of-type(1)": { animationDelay: "-0.32s" },
                "& > div:nth-of-type(2)": { animationDelay: "-0.16s" },
                "@keyframes pulse": {
                  "0%, 80%, 100%": {
                    transform: "scale(0.8)",
                    opacity: 0.5,
                  },
                  "40%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}>
                <div />
                <div />
                <div />
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontStyle: "italic",
                  fontSize: "0.75rem",
                }}
              >
                {otherUserTyping} is typing...
              </Typography>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ 
        p: 2.5,
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}>
        <Box sx={{ 
          display: "flex", 
          gap: 1.5,
          alignItems: "flex-end",
        }}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                bgcolor: theme.palette.mode === "dark" 
                  ? "rgba(255, 255, 255, 0.05)" 
                  : "rgba(0, 0, 0, 0.02)",
                border: `1px solid ${theme.palette.divider}`,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: theme.palette.mode === "dark" 
                    ? "rgba(255, 255, 255, 0.08)" 
                    : "rgba(0, 0, 0, 0.04)",
                },
                "&.Mui-focused": {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                  bgcolor: theme.palette.background.paper,
                },
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiOutlinedInput-input": {
                color: theme.palette.text.primary,
                fontSize: "0.9rem",
                "&::placeholder": {
                  color: theme.palette.text.secondary,
                  opacity: 0.7,
                },
              },
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{
              bgcolor: message.trim() 
                ? theme.palette.primary.main 
                : theme.palette.action.disabledBackground,
              color: message.trim() ? "white" : theme.palette.action.disabled,
              width: 44,
              height: 44,
              transition: "all 0.3s ease-in-out",
              boxShadow: message.trim() 
                ? `0 4px 12px ${theme.palette.primary.main}40`
                : "none",
              "&:hover": {
                bgcolor: message.trim() 
                  ? theme.palette.primary.dark 
                  : theme.palette.action.disabledBackground,
                transform: message.trim() ? "scale(1.05)" : "none",
                boxShadow: message.trim() 
                  ? `0 6px 16px ${theme.palette.primary.main}50`
                  : "none",
              },
              "&:active": {
                transform: message.trim() ? "scale(0.95)" : "none",
              },
              "&.Mui-disabled": {
                color: theme.palette.action.disabled,
              }
            }}
          >
            <Send sx={{ 
              fontSize: "1.1rem",
              transform: "rotate(-45deg)",
            }} />
          </IconButton>
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.palette.text.secondary,
            mt: 1,
            display: "block",
            fontSize: "0.7rem",
          }}
        >
          Press Enter to send, Shift+Enter for new line
        </Typography>
      </Box>
    </Box>
  )
}

export default GroupChat
