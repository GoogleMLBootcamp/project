// src/components/useImageUpload.ts
import { useState } from 'react';
import { api } from '../api';

interface UploadResult {
  storyId: string;
  imageUrls: string[];
  combinedCaption: string;
}

export function useImageUpload(onSuccess: (result: UploadResult) => void) {
  const [loading, setLoading] = useState(false);

  const upload = async (files: File[]) => {
    if (!files.length) return;
    setLoading(true);
    try {
      // 1. 업로드
      const { story_id, image_urls } = await api.uploadImages(files);

      // 2. 각각 BLIP 분석 → description list
      const captions = await Promise.all(
        image_urls.map((url) => api.analyzeImageWithBLIP(url))
      );

      // 3. 문단 형태로 이어붙이기
      const combinedCaption = captions.filter(Boolean).join('\n');

      // 4. 성공 콜백
      onSuccess({
        storyId: story_id,
        imageUrls: image_urls,
        combinedCaption,
      });
    } catch (err) {
      console.error('업로드 또는 분석 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading };
}