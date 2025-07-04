import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '../api';
import { abs } from '../utils/abs';
import { useAlbums } from '../albumStore';

//스토리 상세 내용 확인, 팝업을 위한 모달 창.

interface Props {
  open: boolean;
  storyId: string | null;
  onClose: () => void;
}

const StoryModal: React.FC<Props> = ({ open, storyId, onClose }) => {
  const { albums, addImages, saveStory } = useAlbums();
  const album = albums.find(a => a.id === storyId);
  const [busy, setBusy] = useState(false);

  /* 이미지가 없으면 다시 로드 */
  useEffect(() => {
    if (open && storyId && album && album.images.length === 0) {
      api.getStoryImages(storyId).then(imgs => addImages(storyId, imgs.map(abs)));
    }
  }, [open, storyId]);

  const generate = async () => {
    if (!storyId) return;
    setBusy(true);
    const story = await api.generateStoryById(storyId);
    saveStory(storyId, story);
    setBusy(false);
  };

  if (!album) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Story
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* 이미지 썸네일 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {album.images.map((url, i) => (
            <Box key={url} sx={{ width: { xs: '48%', sm: '30%' }, textAlign: 'center' }}>
              <img src={url} alt="" style={{ width: '100%', borderRadius: 8 }} />
              <Typography variant="caption">Image {i + 1}</Typography>
            </Box>
          ))}
        </Box>

        {/* 생성된 스토리 */}
        {album.story && (
          <Typography whiteSpace="pre-line" sx={{ fontSize: 16 }}>
            {album.story}
          </Typography>
        )}
      </DialogContent>

      {/* 스토리 없으면 버튼 노출 */}
      {!album.story && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button variant="contained" disabled={busy} onClick={generate}>
            {busy ? 'GENERATING…' : 'GENERATE STORY'}
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default StoryModal;
