import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme,Box,Typography } from '@mui/material';
import { ImageUploader } from './components/ImageUploader';
import { StoryViewer } from './components/StoryViewer';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [generatedStory, setGeneratedStory] = useState<string>('');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'black', color: 'white', py: 10, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold">
          Make Your Post
        </Typography>
      </Box>
      <Container maxWidth="lg">
        <ImageUploader onStoryGenerated={setGeneratedStory} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
