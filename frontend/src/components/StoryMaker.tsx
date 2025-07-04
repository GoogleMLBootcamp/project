// src/components/StoryMaker.tsx
import React, { useState } from 'react';
import { api } from '../api';
import StoryProcessor from './StoryProcessor';
import ImageUploader from './ImageUploader';

const StoryMaker: React.FC = () => {
  const [storyId, setStoryId] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [combinedCaption, setCombinedCaption] = useState('');
  const [story, setStory] = useState<string | null>(null);

  const handleUploadComplete = ({
    storyId,
    imageUrls,
    combinedCaption,
  }: {
    storyId: string;
    imageUrls: string[];
    combinedCaption: string;
  }) => {
    setStoryId(storyId);
    setImageUrls(imageUrls);
    setCombinedCaption(combinedCaption);
  };

  const generateStory = async () => {
    if (!storyId) return;
    try {
      const generated = await api.generateStoryById(storyId);
      setStory(generated);
    } catch (e) {
      console.error('스토리 생성 실패:', e);
    }
  };

  return (
    <div>
      <h1>Make Your Post</h1>
      <ImageUploader onUploadComplete={handleUploadComplete} />

      {combinedCaption && (
        <div>
          <h3>📷 이미지 설명:</h3>
          <p>{combinedCaption}</p>
        </div>
      )}

      <button onClick={generateStory}>📖 스토리 생성</button>

      {story && (
        <StoryProcessor storyId={storyId} storyText={story} imageUrls={imageUrls} />
      )}
    </div>
  );
};

export default StoryMaker;