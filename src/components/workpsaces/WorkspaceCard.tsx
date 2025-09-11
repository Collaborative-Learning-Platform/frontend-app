import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import {
  People as UsersIcon,
  Message as MessageSquareIcon,
  Description as FileTextIcon,
  BarChart as BarChart3Icon,
} from "@mui/icons-material";

export type Workspace = {
  id: number;
  name: string;
  description?: string;
  students: number;
  tutors: number;
  groups: number;
  status: string;
  created: string;
  lastActivity: string;
  color?: string;
};

type WorkspaceCardProps = {
  workspace: Workspace;
  onManage?: (id: number) => void;
  onView?: (id: number) => void;
};

const WorkspaceCard = React.memo(
  ({ workspace, onManage, onView }: WorkspaceCardProps) => {
    if (onManage === undefined && onView === undefined) {
      console.log("No action handlers provided"); // or some fallback UI
    }
    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.2s",
          "&:hover": {
            boxShadow: 4,
          },
        }}
      >
        <CardHeader
          title={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">{workspace.name}</Typography>
              <Chip
                label={workspace.status}
                color={workspace.status === "Active" ? "primary" : "default"}
                size="small"
              />
            </Box>
          }
          subheader={workspace.description}
          sx={{ pb: 2 }}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 120 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <UsersIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2">
                    {workspace.students} Students
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 120 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MessageSquareIcon
                    sx={{ fontSize: 16, color: "text.secondary" }}
                  />
                  <Typography variant="body2">
                    {workspace.groups} Groups
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 120 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FileTextIcon
                    sx={{ fontSize: 16, color: "text.secondary" }}
                  />
                  <Typography variant="body2">
                    {workspace.tutors} Tutors
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 120 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BarChart3Icon
                    sx={{ fontSize: 16, color: "text.secondary" }}
                  />
                  <Typography variant="body2">Analytics</Typography>
                </Box>
              </Box>
            </Box>{" "}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 2 }}
            >
              <Typography variant="caption" color="text.secondary">
                Created: {workspace.created}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last activity: {workspace.lastActivity}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
            {/* <Button 
              size="small" 
              variant="contained" 
              sx={{ flex: 1 }}
              onClick={() => onManage?.(workspace.id)}
            >
              Manage
            </Button> */}
            <Button
              size="small"
              variant="contained"
              sx={{ flex: 1 }}
              onClick={() => onView?.(workspace.id)}
            >
              View
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

export default WorkspaceCard;
