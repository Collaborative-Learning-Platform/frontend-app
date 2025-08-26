import type { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

type SummaryCardProps = {
  description: string;
  title: string;
  icon?: ReactNode;
  iconColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "action"
    | "disabled"
    | "error"
    | "info"
    | "success"
    | "warning";
  value: ReactNode;
};

const SummaryCard = ({ description, title, icon, value }: SummaryCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: { xs: 120, sm: 140, md: 160 },
      }}
    >
      <CardHeader
        title={title}
        action={icon}
        titleTypographyProps={{
          variant: isMobile ? "caption" : "body2",
          fontWeight: "medium",
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
        }}
        sx={{
          pb: { xs: 0.5, sm: 1 },
          px: { xs: 2, sm: 2, md: 3 },
          pt: { xs: 1.5, sm: 2 },
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          px: { xs: 2, sm: 2, md: 3 },
          pb: { xs: 1.5, sm: 2 },
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {value && (
          <Typography
            variant={isMobile ? "h5" : isTablet ? "h4" : "h4"}
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "1.75rem",
                md: "2rem",
              },
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
        )}
        {description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
