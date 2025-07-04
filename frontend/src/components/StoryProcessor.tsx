import React, { useEffect } from 'react';
import { api } from '../api';

interface StoryProcessorProps {
  storyId: string;
  storyText: string;
  imageUrls: string[];
}

const StoryProcessor: React.FC<StoryProcessorProps> = ({ storyId, storyText }) => {
  useEffect(() => {
    const saveStory = async () => {
      try {
        await api.saveStoryToDB(storyId, storyText);
        console.log('✅ 스토리 저장 완료');
      } catch (err) {
        console.error('❌ 스토리 저장 실패', err);
      }
    };

    if (storyId && storyText) {
      saveStory();
    }
  }, [storyId, storyText]);

  return null;
};

export default StoryProcessor;