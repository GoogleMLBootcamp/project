import React, { useRef } from 'react';
import { Box, Button, LinearProgress } from '@mui/material';
import { api } from '../api';

interface Props {
  onUploadComplete: (payload: {
    storyId: string;
    imageUrls: string[];
    combinedCaption: string;
  }) => void;
}

const ImageUploader: React.FC<Props> = ({ onUploadComplete }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);

  const handleUpload = async (files: File[]) => {
    setLoading(true);
    try {
      const { story_id, image_urls } = await api.uploadImages(files);
      const captions = await Promise.all(
        image_urls.map((url: string) => api.analyzeImageWithBLIP(url))
      );
      const combinedCaption = captions.join(' ');
      onUploadComplete({ storyId: story_id, imageUrls: image_urls, combinedCaption });
    } catch (err) {
      console.error('업로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" mt={4}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) handleUpload(Array.from(e.target.files));
        }}
      />
      <Button variant="contained" onClick={() => inputRef.current?.click()}>
        이미지 업로드
      </Button>
      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
};

export default ImageUploader;