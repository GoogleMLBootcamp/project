import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlbums } from '../albumStore';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const { albums } = useAlbums();
  const nav = useNavigate();

  const album = albums.find(a => a.id === id);
  if (!album) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'black',
        overflowY: 'auto',
        p: 4,
        color: 'white',
      }}
    >
      <IconButton onClick={() => nav(-1)} sx={{ position: 'fixed', top: 24, right: 24 }}>
        <CloseIcon sx={{ color: 'white' }} />
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          mt: 6,
        }}
      >
        {album.images.map(p => (
          <img
            key={p}
            src={p}
            alt="album"
            style={{ maxWidth: '45%', marginBottom: 16, borderRadius: 8 }}
          />
        ))}
      </Box>
    </Box>
  );
}
