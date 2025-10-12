import { Box, Button, Card, CardContent, CardHeader, Paper, Typography } from "@mui/material";
import { BarChart as BarChart3Icon } from "@mui/icons-material";

export function UserAnalytics(){
    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Performance Analytics
          </Typography>
          <Button variant="outlined" startIcon={<BarChart3Icon />}>
            Detailed Report
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
            <Card>
              <CardHeader
                title="Study Insights"
                subheader="Areas for improvement"
              />
              <CardContent>
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: "warning.light",
                    color: "warning.contrastText",
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Focus Area: Data Structures
                  </Typography>
                  <Typography variant="caption">
                    Consider reviewing linked lists and trees
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: "success.light",
                    color: "success.contrastText",
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Strong Performance: Calculus
                  </Typography>
                  <Typography variant="caption">
                    Keep up the excellent work!
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "info.light",
                    color: "info.contrastText",
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Recommendation
                  </Typography>
                  <Typography variant="caption">
                    Join the "Physics Problem Solving" group
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    );
}