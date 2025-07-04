/* src/components/ImageUploader.tsx */
import React, { useState, ChangeEvent } from 'react';
import { Box, Button, Typography } from '@mui/material';

const ImageUploader: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);

  /** 파일 input onChange */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    /* ① 브라우저 Ram 에 URL 객체 생성 → state 에 저장 */
    const url = URL.createObjectURL(file);
    setPreview(url);

    /* ② 필요하다면 FormData 로 백엔드 전송
    const form = new FormData();
    form.append('file', file);
    await axios.post('/api/upload', form);
    */
  };

  return (
    <Box textAlign="center" mt={4}>
      {/* --- 파일 선택 버튼 --- */}
      <input
        accept="image/*"
        id="img-input"
        type="file"
        hidden
        onChange={handleChange}
      />
      <label htmlFor="img-input">
        <Button variant="contained" component="span">
          이미지 업로드
        </Button>
      </label>

      {/* --- 미리 보기 --- */}
      {preview && (
        <>
          <Typography mt={2}>미리 보기</Typography>
          <Box
            component="img"
            src={preview}
            alt="preview"
            sx={{ maxWidth: 400, borderRadius: 2, mt: 1 }}
          />
        </>
      )}
    </Box>
  );
};

export default ImageUploader;