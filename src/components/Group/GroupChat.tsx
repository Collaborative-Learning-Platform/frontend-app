import { useState, useRef, useEffect } from "react";
import {
  Card,
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import { Send, MoreVert } from "@mui/icons-material";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  self?: boolean;
}

interface GroupChatProps {
  groupId: string;
  currentUser: string;
}

const GroupChat = ({ groupId, currentUser }: GroupChatProps) => {
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "Theekshana", content: "Hey team! Ready?", timestamp: "10:30 AM", avatar: "T" },
    { id: "2", sender: "Vinuka", content: "Auth module is done.", timestamp: "10:32 AM", avatar: "V" },
    { id: "3", sender: "Erandathe", content: "Database integration is ready.", timestamp: "10:35 AM", avatar: "ER" },
  ]);

  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (text: string) => {
    setMessage(text);
    setTyping(text.length > 0);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      sender: currentUser,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: currentUser.split(" ").map(n => n[0]).join(""),
      self: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    setTyping(false);
  };

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
        ref={messagesContainerRef}
      >
        {messages.map(msg => (
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
            {currentUser} is typing...
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
          onChange={e => handleTyping(e.target.value)}
          onKeyPress={e => e.key === "Enter" && handleSendMessage()}
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
  );
};

export default GroupChat;
