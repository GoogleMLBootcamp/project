import React, { useRef, useState } from 'react';
import { Box, IconButton, LinearProgress } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { v4 as uuid } from 'uuid';
import { api, API_URL } from '../api';
import { abs } from '../utils/abs';
import { useAlbums } from '../albumStore';

export default function AlbumUploader() {
  const { addAlbum } = useAlbums();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const open = () => fileRef.current?.click();

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setBusy(true);

    try {
      const files = Array.from(e.target.files);
      const { story_id, image_urls } = await api.uploadImages(files);

      /* 프론트 · 백엔드 동기화를 위해 createdAt 삽입 */
      addAlbum({
        id: story_id,
        images: image_urls.map(abs),
        cover: abs(image_urls[0]),
        count: image_urls.length,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <Box>
      <IconButton onClick={open} color="primary">
        <AddPhotoAlternateIcon /> Upload
      </IconButton>
      <input ref={fileRef} type="file" hidden multiple accept="image/*" onChange={onSelect} />
      {busy && <LinearProgress sx={{ mt: 1 }} />}
    </Box>
  );
}
