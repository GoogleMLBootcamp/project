import React, { useRef, useState } from 'react';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { abs } from '../utils/abs';
import { useAlbums } from '../albumStore';

export default function FolderPage() {
  const { id } = useParams<{ id: string }>();
  const { albums, addImages } = useAlbums();
  const album = albums.find(a => a.id === id);
  const nav = useNavigate();

  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  if (!album) return null;

  const selectFiles = () => fileRef.current?.click();

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setBusy(true);
    try {
      const files = Array.from(e.target.files);
      const { image_urls } = await api.uploadImagesToStory(album.id, files);
      addImages(album.id, image_urls.map(abs));
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* 닫기 버튼 */}
      <IconButton onClick={() => nav(-1)} sx={{ position: 'fixed', top: 24, right: 24 }}>
        <CloseIcon />
      </IconButton>

      {/* 이미지 업로드 버튼 */}
      <IconButton onClick={selectFiles} color="primary" sx={{ mb: 2 }}>
        <AddPhotoAlternateIcon /> Upload
      </IconButton>
      <input ref={fileRef} hidden multiple accept="image/*" type="file" onChange={onSelect} />
      {busy && <LinearProgress sx={{ my: 2 }} />}

      {/* 이미지들 */}
      {album.images.length === 0 ? (
        <Typography variant="h6" align="center">No images yet</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {album.images.map(url => (
            <img key={url} src={abs(url)} style={{ width: '30%', borderRadius: 8 }} />
          ))}
        </Box>
      )}
    </Box>
  );
}
