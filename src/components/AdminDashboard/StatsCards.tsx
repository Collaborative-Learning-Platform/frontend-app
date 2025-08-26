import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import {
  People as UsersIcon,
  MenuBook as BookOpenIcon,
  Message as MessageSquareIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

export function StatsCards() {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      icon: UsersIcon,
      description: "1,892 Students, 955 Tutors",
    },
    {
      title: "Active Workspaces",
      value: "156",
      change: "+8%",
      icon: BookOpenIcon,
      description: "23 new this month",
    },
    {
      title: "Daily Messages",
      value: "12,459",
      change: "+23%",
      icon: MessageSquareIcon,
      description: "Across all groups",
    },
    {
      title: "Quiz Completion Rate",
      value: "87%",
      change: "+5%",
      icon: TrendingUpIcon,
      description: "Average this week",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
      }}
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Box
            key={index}
            sx={{
              flex: {
                xs: "1 1 100%",
                md: "1 1 calc(50% - 12px)",
                lg: "1 1 calc(25% - 18px)",
              },
            }}
          >
            <Card>
              <CardHeader
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pb: 1,
                }}
                title={
                  <Typography variant="body2" fontWeight="medium">
                    {stat.title}
                  </Typography>
                }
                action={
                  <IconComponent
                    sx={{
                      fontSize: 20,
                      color: "text.secondary",
                    }}
                  />
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Typography variant="caption" sx={{ color: "success.main" }}>
                    {stat.change}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    from last month
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </Box>
  );
}
