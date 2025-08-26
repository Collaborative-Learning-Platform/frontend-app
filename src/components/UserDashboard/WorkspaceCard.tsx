import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";

export type Workspace = {
  id: number;
  name: string;
  groups: number;
  members: number;
  color: string;
};

type WorkspaceCardProps = {
  workspace: Workspace;
  onEnter?: (id: number) => void;
};

const WorkspaceCard = React.memo(
  ({ workspace, onEnter }: WorkspaceCardProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
      <Card
        sx={{
          height: "100%",
          cursor: "pointer",
          minHeight: { xs: 140, sm: 160, md: 180 },
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: { xs: 2, sm: 4 },
            transform: "translateY(-2px)",
          },
        }}
        onClick={() => onEnter?.(workspace.id)}
      >
        <CardHeader
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 10, sm: 12, md: 14 },
                  height: { xs: 10, sm: 12, md: 14 },
                  borderRadius: "50%",
                  bgcolor: workspace.color,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  fontWeight: "medium",
                  lineHeight: 1.2,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                title={workspace.name}
              >
                {workspace.name}
              </Typography>
            </Box>
          }
          sx={{
            pb: { xs: 1, sm: 1.5 },
            px: { xs: 2, sm: 2.5, md: 3 },
            pt: { xs: 2, sm: 2.5, md: 3 },
          }}
        />
        <CardContent
          sx={{
            px: { xs: 2, sm: 2.5, md: 3 },
            pb: { xs: 2, sm: 2.5, md: 3 },
            pt: 0,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "flex-start", sm: "space-between" },
              gap: { xs: 0.5, sm: 0 },
              mb: { xs: 2, sm: 2.5 },
              flexGrow: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            >
              Groups: {workspace.groups}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            >
              Members: {workspace.members}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            fullWidth
            endIcon={<ChevronRightIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            sx={{
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              fontWeight: "medium",
              borderRadius: { xs: 1, sm: 1.5 },
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            Enter Workspace
          </Button>
        </CardContent>
      </Card>
    );
  }
);

export default WorkspaceCard;
