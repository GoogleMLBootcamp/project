import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
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
      <Container maxWidth="lg">
        <ImageUploader onStoryGenerated={setGeneratedStory} />
        <StoryViewer story={generatedStory} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
