import { Box, Card, CardHeader, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";

interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  workspaceId: string;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;
}

export default function UsersPanel({
  workspaceId,
  users,
  setUsers,
  setError,
  setSuccess,
}: Props) {
  // TODO: Implement file upload and API integration

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Upload Users" />
        <CardContent>
          <Typography variant="body2">[TODO: File upload goes here]</Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Users
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.userId}>
            <ListItemText
              primary={`${user.name} (${user.role})`}
              secondary={user.email}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
