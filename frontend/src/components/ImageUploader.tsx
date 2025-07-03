import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Card,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton
} from '@mui/material';
import { Delete, CloudUpload, Close } from '@mui/icons-material';
import { api } from '../services/api';
import { StoryViewer } from './StoryViewer';

interface ImageUploaderProps {
  onStoryGenerated?: (story: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onStoryGenerated }) => {
  const [storyImages, setStoryImages] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [generatedStory, setGeneratedStory] = useState<string>('');

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
      setStoryImages(prev => ({
        ...prev,
        [response.story_id]: response.image_paths
      }));
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
      const imageDescriptions = await api.analyzeImagesByStoryId(storyId);
      const story = await api.generateStory(imageDescriptions);
      setGeneratedStory(story);
      onStoryGenerated?.(story);
    } catch (error) {
      console.error('Story generation failed:', error);
      alert('Failed to generate story');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (storyId: string) => {
    setSelectedStory(storyId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStory(null);
    setGeneratedStory('');
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
        variant="outlined"
        onClick={() => fileInputRef.current?.click()}
        sx={{
          mb: 3,
          alignSelf: 'flex-start',
          color: 'black',
          borderColor: 'black',
          textTransform: 'none',
          fontWeight: 'bold'
        }}
      >
        + Upload
      </Button>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 2,
        maxWidth: '1200px'
      }}>
        {Object.entries(storyImages)
          .reverse()
          .map(([storyId, paths]) => (
            <Card
              key={storyId}
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleCardClick(storyId)}
            >
              <CardMedia
                component="img"
                height="330"
                image={`http://localhost:8000${paths[0]}`}
                alt={`Story ${storyId} thumbnail`}
                sx={{ objectFit: 'cover' }}
              />
              
            </Card>
          ))}
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Story ID: {selectedStory}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedStory && storyImages[selectedStory] && (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 2,
                  mt: 1
                }}
              >
                {storyImages[selectedStory].map((path, index) => (
                  <CardMedia
                    key={index}
                    component="img"
                    height="160"
                    image={`http://localhost:8000${path}`}
                    alt={`Image ${index + 1}`}
                    sx={{ objectFit: 'cover', borderRadius: 1 }}
                  />
                ))}
              </Box>

              {/* 스토리 출력 영역 */}
              {generatedStory && (
                <Box sx={{ mt: 3 }}>
                  <StoryViewer story={generatedStory} />
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              if (selectedStory) {
                handleGenerateStory(selectedStory);
              }
            }}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Generate Story
          </Button>

          <Button
            onClick={() => {
              if (selectedStory) {
                handleDelete(selectedStory);
                handleCloseDialog();
              }
            }}
            sx={{
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};