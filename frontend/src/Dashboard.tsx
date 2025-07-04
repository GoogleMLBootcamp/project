import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, LinearProgress } from '@mui/material';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import { abs } from './utils/abs';
import { api } from './api';
import { useAlbums } from './albumStore';
import StoryCard from './components/StoryCard';
import StoryModal from './components/StoryModal';

export default function Dashboard() {
  const { albums, addAlbum } = useAlbums();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setBusy(true);
    try {
      const files = Array.from(e.target.files);
      const { story_id, image_urls, created_at } = await api.uploadImages(files);
      addAlbum({
        id: story_id,
        images: image_urls.map(abs),
        cover: abs(image_urls[0]),
        count: image_urls.length,
        createdAt: created_at,
      });
      setFocusId(story_id);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', p: 3 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Make Your Post
      </Typography>

      <IconButton onClick={() => fileRef.current?.click()} color="primary" sx={{ mb: 2 }}>
        <AddPhotoIcon /> Upload
      </IconButton>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleUpload}
      />
      {busy && <LinearProgress sx={{ mb: 2 }} />}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {albums.map((a) => (
          <Box key={a.id} sx={{ flex: '0 1 300px' }}>
            <StoryCard
              id={a.id}
              cover={a.cover}
              count={a.count}
              createdAt={a.createdAt}
              onClick={() => setFocusId(a.id)}
            />
          </Box>
        ))}
      </Box>

      <StoryModal open={Boolean(focusId)} storyId={focusId} onClose={() => setFocusId(null)} />
    </Box>
  );
}
