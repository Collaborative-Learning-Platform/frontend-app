import { Paper, Card } from "@mui/material";
import { CardContent, Typography, Avatar, AvatarGroup } from "@mui/material";

import { useState, useEffect } from "react";
import Toolbar from "../components/Whiteboard/Toolbar";

export const Whiteboard = () => {
  const [selectedTool, setSelectedTool] = useState<String | null>(null);
  const [loggedInUsers, setLoggedInUsers] = useState<String[]>([]);

  useEffect(() => {
    // // Fetch logged in users from backend
    // const fetchLoggedInUsers = async () => {
    //   try {
    //     // Replace with your actual API endpoint
    //     const response = await fetch("/api/logged-in-users");
    //     const users = await response.json();
    //     setLoggedInUsers(users);
    //   } catch (error) {
    //     console.error("Failed to fetch logged in users:", error);
    //     // Mock data for demo

    //   }
    // };
    setLoggedInUsers(["User2", "User3"]);
    // fetchLoggedInUsers();
  }, []);

  const handleSelectedTool = (
    _event: React.MouseEvent<HTMLElement>,
    updatedSelectedTool: String
  ) => {
    if (updatedSelectedTool === "Clear") {
      // Clear the board logic here
      //console.log("Board cleared");
      setSelectedTool("");
    } else {
      // For all other tools, set them as selected
      setSelectedTool(updatedSelectedTool);
    }
  };
  return (
    <Paper
      sx={{
        backgroundColor: "#f8f9fa",
        backgroundImage: "radial-gradient(#e0e0e0 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        position: "fixed",
        top: "8px",
        left: "8px",
        width: "calc(100vw - 16px)",
        height: "calc(100vh - 16px)",
        padding: 0,
        margin: 0,
        borderRadius: 3,
        boxSizing: "border-box",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        cursor:
          selectedTool === "Draw"
            ? "crosshair"
            : selectedTool === "Text"
            ? "text"
            : selectedTool === "Clear"
            ? "not-allowed"
            : "default",
      }}
      elevation={0}
    >
      {/* Header with branding and users */}
      <Card
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          width: "fit-content",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        elevation={0}
      >
        <CardContent sx={{ padding: 2, "&:last-child": { paddingBottom: 2 } }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            Collaborators Online
          </Typography>
          <AvatarGroup
            max={4}
            sx={{ "& .MuiAvatar-root": { border: "2px solid white" } }}
          >
            {loggedInUsers.map((user, index) => (
              <Avatar
                key={index}
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${
                    ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][
                      index % 5
                    ]
                  }, ${
                    ["#FF8E53", "#26D0CE", "#6C5CE7", "#81ECEC", "#FDCB6E"][
                      index % 5
                    ]
                  })`,
                }}
              >
                {user.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
        </CardContent>
      </Card>

      {/* Enhanced toolbar */}
      <Card
        sx={{
          width: "fit-content",
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 3,
        }}
        elevation={0}
      >
        <CardContent sx={{ padding: 1, "&:last-child": { paddingBottom: 1 } }}>
          <Toolbar
            selectedTool={selectedTool}
            onToolChange={handleSelectedTool}
          />
        </CardContent>
      </Card>

      {/* Watermark/Brand */}
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: 24,
          left: 24,
          color: "rgba(0, 0, 0, 0.1)",
          fontWeight: 300,
          letterSpacing: 1,
          userSelect: "none",
        }}
      >
        Whiteboard
      </Typography>
    </Paper>
  );
};
