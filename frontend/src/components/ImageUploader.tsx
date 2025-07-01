import React, { useState, useRef, useEffect } from 'react';
import { 
  Button, 
  Card, 
  CardMedia, 
  CardActions,
  IconButton,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { Delete, CloudUpload } from '@mui/icons-material';
import { api } from '../services/api';

interface ImageUploaderProps {
  onStoryGenerated?: (story: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onStoryGenerated }) => {
  const [storyImages, setStoryImages] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing images on component mount
  useEffect(() => {
    loadExistingImages();
  }, []);

  const loadExistingImages = async () => {
    try {
      setLoading(true);
      const storyIds = await api.getStoryIds();
      
      const imagesPromises = storyIds.map(async (storyId) => {
        const images = await api.getStoryImages(storyId);
        return { storyId, images };
      });

      const results = await Promise.all(imagesPromises);
      
      const newStoryImages: { [key: string]: string[] } = {};
      results.forEach(({ storyId, images }) => {
        newStoryImages[storyId] = images.map((img: any) => img.path);
      });

      setStoryImages(newStoryImages);
    } catch (error) {
      console.error('Failed to load existing images:', error);
      alert('Failed to load existing images');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      setLoading(true);
      const response = await api.uploadImages(files);
      
      // Update the UI with the new images
      setStoryImages(prev => ({
        ...prev,
        [response.story_id]: response.image_paths
      }));

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storyId: string) => {
    try {
      setLoading(true);
      await api.deleteStoryImages(storyId);
      setStoryImages(prev => {
        const newState = { ...prev };
        delete newState[storyId];
        return newState;
      });
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete images');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStory = async (storyId: string) => {
    try {
      setLoading(true);
      
      // 1. First, get image analysis from PaLI-Gemma
      const imageDescriptions = await api.analyzeImagesByStoryId(storyId);
      
      // 2. Then, generate story using OpenAI with the analysis results
      const story = await api.generateStory(imageDescriptions);
      onStoryGenerated?.(story);
    } catch (error) {
      console.error('Story generation failed:', error);
      alert('Failed to generate story');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <input
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleUpload}
      />
      
      <Button
        variant="contained"
        startIcon={<CloudUpload />}
        onClick={() => fileInputRef.current?.click()}
        sx={{ mb: 3 }}
      >
        Upload Images
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(storyImages).map(([storyId, paths]) => (
          <Card key={storyId} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Story ID: {storyId}
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: 1,
              mb: 2
            }}>
              {paths.map((path, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  height="140"
                  image={`http://localhost:8000${path}`}
                  alt={`Image ${index + 1}`}
                  sx={{ objectFit: 'cover', borderRadius: 1 }}
                />
              ))}
            </Box>

            <CardActions>
              <Button 
                size="small" 
                color="primary"
                onClick={() => handleGenerateStory(storyId)}
              >
                Generate Story
              </Button>
              <IconButton 
                color="error" 
                onClick={() => handleDelete(storyId)}
              >
                <Delete />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}; 