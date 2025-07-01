import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface Story {
  story: {
    title: string;
    content: string;
    created_at: string;
  };
}

export interface ImageUploadResponse {
  story_id: string;
  image_paths: string[];
  image_count: number;
}

export const api = {
  // Image APIs
  uploadImages: async (files: File[]): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await axios.post(`${API_URL}/api/v1/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getStoryIds: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/api/v1/images/story-ids`);
    return response.data;
  },

  getStoryImages: async (storyId: string) => {
    const response = await axios.get(`${API_URL}/api/v1/images/${storyId}`);
    return response.data;
  },

  deleteStoryImages: async (storyId: string) => {
    const response = await axios.delete(`${API_URL}/api/v1/images/${storyId}`);
    return response.data;
  },

  // PaLI-Gemma API
  analyzeImagesByStoryId: async (storyId: string): Promise<string> => {
    const response = await axios.post(`${API_URL}/api/v1/paligemma/analyze-images/${storyId}`);
    return response.data;
  },

  // Story Generation APIs
  generateStory: async (imageDescriptions: string): Promise<string> => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/openai/generate-story`,
        JSON.stringify(imageDescriptions),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.story;
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  }
}; 