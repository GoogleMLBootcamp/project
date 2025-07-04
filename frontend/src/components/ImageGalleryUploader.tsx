import React, { useRef, useState } from 'react';
import {
  Box, IconButton, LinearProgress,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { api, API_URL } from '../api';
import { useImages } from '../store';

/* 상대 → 절대 경로 보정 */
const abs = (u: string) => (u.startsWith('http') ? u : `${API_URL}/${u.replace(/^\/?/, '')}`);

export default function ImageGalleryUploader() {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addCards } = useImages();   // Context

  const trigger = () => inputRef.current?.click();

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setLoading(true);
    try {
      /* 1) 업로드 */
      const files = Array.from(e.target.files);
      const { story_id, image_urls } = await api.uploadImages(files);

      /* 2) Context에 카드 데이터 추가 (대표 썸네일 = image_paths[0]) */
      if (image_urls.length) {
        addCards([{ id: story_id, url: image_urls[0] }]);
      }
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* 좌측 상단 + 버튼 */}
      <IconButton
        color="primary"
        onClick={trigger}
        sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1300 }}
      >
        <AddPhotoAlternateIcon fontSize="large" />
      </IconButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleSelect}
      />

      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
}
