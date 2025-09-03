import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';

export interface GroupCardProps {
  id: number | string;
  name: string;
  type?: 'main' | 'other';
  description?: string;
  onClick?: (id: number | string) => void;
  footerSlot?: React.ReactNode;
}


const GroupCard: React.FC<GroupCardProps> = ({ id, name, type = 'other', description, onClick, footerSlot }) => {
  return (
    <Card variant="outlined" sx={{
      borderColor: type === 'main' ? 'primary.main' : 'divider',
      height: '100%'
    }}>
      <CardActionArea onClick={() => onClick?.(id)} sx={{ height: '100%', alignItems: 'stretch' }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {type === 'main' ? 'Main Group' : 'Group'}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600 }}>
            {name}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {description}
            </Typography>
          )}
          {footerSlot && (
            <Box mt={1.5}>{footerSlot}</Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GroupCard;
