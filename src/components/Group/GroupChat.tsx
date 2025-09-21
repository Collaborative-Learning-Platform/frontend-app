import { useEffect, useState, useRef } from "react"
import {
  Card,
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material"
import { Send, MoreVert } from "@mui/icons-material"
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
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    setTyping(text.length > 0)
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMsg = {
      sender: currentUserName,
      roomId: groupId,
      content: message,
    }

    socket?.emit("send_message", newMsg)
    setMessage("")
    setTyping(false)
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: 500, sm: 600 },
        bgcolor: theme.palette.mode === "dark" ? "background.paper" : "grey.100",
        color: theme.palette.text.primary,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.200",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Group Chat - {groupId}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Group ID: {groupId}
          </Typography>
        </Box>
        <IconButton sx={{ color: theme.palette.text.secondary }}>
          <MoreVert />
        </IconButton>
      </Box>

      <Divider />

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              flexDirection: msg.self ? "row-reverse" : "row",
              alignItems: "flex-start",
              mb: 2,
              gap: 1.5,
            }}
          >
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{msg.avatar}</Avatar>
            <Box sx={{ maxWidth: "75%" }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {msg.sender}{" "}
                <Typography variant="caption" color="text.secondary">
                  {msg.timestamp}
                </Typography>
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: msg.self
                    ? theme.palette.primary.main
                    : theme.palette.mode === "dark"
                    ? "grey.800"
                    : "grey.200",
                  color: msg.self ? "white" : theme.palette.text.primary,
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </Box>
            </Box>
          </Box>
        ))}

        {typing && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {currentUserName} is typing...
          </Typography>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ display: "flex", p: 2, gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          size="small"
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: theme.palette.mode === "dark" ? "grey.800" : "white",
              color: theme.palette.text.primary,
            },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            "&:hover": { bgcolor: theme.palette.primary.dark },
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </Card>
  )
}

export default GroupChat
