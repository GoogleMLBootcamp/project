import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAlbums } from '../albumStore';

export default function GalleryPage() {
  const { albums } = useAlbums();
  const nav = useNavigate();

  return (
    <Box sx={{ mt: 10, px: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Albums
      </Typography>

      {/* Flexbox 3열 */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
        }}
      >
        {albums.map(a => (
          <Box key={a.id} sx={{ flex: { xs: '0 1 90%', sm: '0 1 45%', md: '0 1 30%' } }}>
            <Card elevation={4} sx={{ borderRadius: 4 }}>
              <CardActionArea onClick={() => nav(`/detail/${a.id}`)}>
                <CardMedia
                  component="img"
                  image={a.cover}
                  alt="album cover"
                  sx={{ aspectRatio: '1/1', objectFit: 'cover' }}
                />
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
