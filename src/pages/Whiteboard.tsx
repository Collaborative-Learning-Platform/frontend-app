import { Paper, Fab, Stack, Box } from "@mui/material";
import { Reply, LightMode, DarkMode } from "@mui/icons-material";
import { Tldraw } from "@tldraw/tldraw";

import { useTheme } from "../theme";
import "@tldraw/tldraw/tldraw.css";

export const Whiteboard = () => {
  const { theme, toggleTheme } = useTheme();

  const handleBackClick = () => {
    window.history.back();
  };

  
  return (
    <Paper
      sx={{
        backgroundColor:
          theme.palette.mode === "dark" ? "#1a1a1a" : theme.palette.grey[50],
        position: "fixed",
        top: theme.spacing(1),
        left: theme.spacing(1),
        width: `calc(100vw - ${theme.spacing(2)})`,
        height: `calc(100vh - ${theme.spacing(2)})`,
        padding: 0,
        margin: 0,
        borderRadius: "5",
        boxSizing: "border-box",
        overflow: "hidden",
        boxShadow: theme.shadows[8],
        cursor: "default",
      }}
      elevation={0}
    >
      
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          "& .tl-container": {
            fontFamily: theme.typography.fontFamily,
          },
          "& .tl-ui-layout__top": {
            display: "none", 
          },
          "& .tl-ui-layout__bottom": {
            display: "none", 
          },
          "& .tl-ui-debug-panel": {
            display: "none", 
          },
          "& .tl-ui-menu-zone": {
            display: "none",
          },
          "& .tl-ui-help-menu": {
            display: "none",
          },
          "& .tl-canvas": {
            backgroundColor: "transparent",
          },
          
          "& .tl-text": {
            whiteSpace: "pre-wrap",
            overflow: "visible",
            textOverflow: "unset",
          },
          "& .tl-text-content": {
            minWidth: "auto",
            width: "auto",
            maxWidth: "none",
            height: "auto",
            minHeight: "1.4em",
            maxHeight: "none",
            overflow: "visible",
            wordWrap: "break-word",
            lineHeight: "1.4em",
            display: "block",
          },
          "& .tl-text-input": {
            resize: "both",
            minWidth: "200px",

            height: "auto",
            minHeight: "100px",
            maxHeight: "auto",
            maxWidth: "auto",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "auto",
            lineHeight: "1.4em",
            padding: "4px",
            margin: "0",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
            verticalAlign: "top",
            display: "block",
          },
          "& .tl-text-shape": {
            height: "auto",
            minHeight: "1.4em",
            maxHeight: "none",
            overflow: "visible",
            display: "block",
          },

          background:
            theme.palette.mode === "dark"
              ? `radial-gradient(${theme.palette.grey[700]} 1px, transparent 1px)`
              : `radial-gradient(${theme.palette.grey[300]} 1px, transparent 1px)`,
          backgroundSize: `${theme.spacing(2.5)} ${theme.spacing(2.5)}`,
        }}
      >
        {" "}
        <Tldraw
          onMount={(editor) => {
            try {
              setTimeout(() => {
                if (editor && editor.setCurrentTool) {
                  editor.setCurrentTool("draw");
                }
              }, 100);
            } catch (error) {
              console.warn("Error mounting tldraw:", error);
            }
          }}
        />
      </Box>
      {/* Header with branding and users */}
      {/* <Card
        sx={{
          position: "absolute",
          top: theme.spacing(2),
          right: theme.spacing(2),
          width: "fit-content",
          backgroundColor: theme.palette.background.paper,
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}`,
          zIndex: 10,
        }}
        elevation={0}
      >
        <CardContent
          sx={{
            padding: theme.spacing(2),
            "&:last-child": { paddingBottom: theme.spacing(2) },
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: theme.spacing(1), display: "block" }}
          >
            Collaborators Online
          </Typography>
          <AvatarGroup
            max={4}
            sx={{
              "& .MuiAvatar-root": {
                border: `2px solid ${theme.palette.background.paper}`,
              },
            }}
          >
            {loggedInUsers.map((user, index) => (
              <Avatar
                key={index}
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: theme.typography.caption.fontSize,
                  fontWeight: theme.typography.fontWeightMedium,
                  background: `linear-gradient(45deg, ${
                    [
                      theme.palette.error.main,
                      theme.palette.info.main,
                      theme.palette.primary.main,
                      theme.palette.success.main,
                      theme.palette.warning.main,
                    ][index % 5]
                  }, ${
                    [
                      theme.palette.error.light,
                      theme.palette.info.light,
                      theme.palette.primary.light,
                      theme.palette.success.light,
                      theme.palette.warning.light,
                    ][index % 5]
                  })`,
                }}
              >
                {user.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
        </CardContent>
      </Card> */}
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        gap={2}
        sx={{
          position: "absolute",
          bottom: theme.spacing(2),
          right: theme.spacing(2),
          zIndex: 10,
        }}
      >
        <Fab
          size="small"
          aria-label="Go back"
          color="primary"
          onClick={handleBackClick}
        >
          <Reply />
        </Fab>{" "}
        <Fab
          size="small"
          aria-label="Toggle theme"
          color="primary"
          onClick={toggleTheme}
        >
          {theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />}
        </Fab>
      </Stack>
    </Paper>
  );
};
