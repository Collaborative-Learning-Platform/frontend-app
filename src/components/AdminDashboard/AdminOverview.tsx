import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Timeline as ActivityIcon,
  Warning as AlertCircleIcon,
  CheckCircle,
} from "@mui/icons-material";
import { StatsCards } from "./StatsCards";

export function AdminOverview() {
  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor your learning platform's performance and activity
          </Typography>
        </Box>

        <StatsCards />

        {/* Recent Activity */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ActivityIcon />
                    <Typography variant="h6">Recent Activity</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: "success.main",
                        borderRadius: "50%",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        New workspace created: "Advanced Mathematics"
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2 minutes ago
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        15 students joined "Physics Lab" group
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        1 hour ago
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: "warning.main",
                        borderRadius: "50%",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Quiz "Quantum Mechanics" completed by 45 students
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        3 hours ago
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AlertCircleIcon />
                    <Typography variant="h6">System Alerts</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <AlertCircleIcon
                        sx={{ fontSize: 16, color: "warning.main" }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          High server load detected
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Monitor performance
                        </Typography>
                      </Box>
                    </Box>
                    <Chip label="Warning" variant="outlined" size="small" />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <CheckCircle
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          Database backup completed
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          All data secured
                        </Typography>
                      </Box>
                    </Box>
                    <Chip label="Success" variant="outlined" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
