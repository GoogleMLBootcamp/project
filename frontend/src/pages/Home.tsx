import React from 'react';
import {
  Box, Card, CardActionArea, Typography,
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useAlbums } from '../albumStore';

export default function Home() {
  const { albums, addAlbum } = useAlbums();
  const nav = useNavigate();

  /* 새 폴더 카드 클릭 */
  const createFolder = () => {
    const id = uuid();
    addAlbum({
      id,
      images: [],
      cover: '',
      count: 0,
      createdAt: new Date().toISOString(),
    });
    nav(`/folder/${id}`);
  };

  return (
    <Box sx={{ mt: 8, px: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        My Folders
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* 기존 폴더 */}
        {albums.map(a => (
          <Box key={a.id} sx={{ flex: '0 1 260px' }}>
            <Card elevation={4} sx={{ borderRadius: 4 }}>
              <CardActionArea onClick={() => nav(`/folder/${a.id}`)}>
                {a.cover ? (
                  <img src={a.cover} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                ) : (
                  <Box sx={{
                    aspectRatio: '1/1',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: '#fafafa',
                  }}>
                    <FolderOpenIcon sx={{ fontSize: 64, color: '#9e9e9e' }} />
                  </Box>
                )}
              </CardActionArea>
              <Box sx={{ p: 1 }}>
                <Typography variant="caption">
                  {new Date(a.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Card>
          </Box>
        ))}

        {/* 새 폴더 카드 */}
        <Box key="new" sx={{ flex: '0 1 260px' }}>
          <Card elevation={3} sx={{ borderRadius: 4 }}>
            <CardActionArea onClick={createFolder} sx={{
              aspectRatio: '1/1',
              display: 'grid',
              placeItems: 'center',
              bgcolor: '#f5f5f5',
            }}>
              <FolderOpenIcon sx={{ fontSize: 64, color: '#9e9e9e' }} />
              <Typography variant="subtitle1" color="text.secondary">
                New Folder
              </Typography>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
