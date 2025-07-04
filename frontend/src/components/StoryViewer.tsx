import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
//story 나타나게.
interface StoryViewerProps {
  story: string;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ story }) => {
  if (!story) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Generated Story
        </Typography>
        <Typography variant="body1">
          {story}
        </Typography>
      </Paper>
    </Box>
  );
}; 