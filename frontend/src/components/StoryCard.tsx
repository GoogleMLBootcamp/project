import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

interface Props {
  id: string;
  cover: string;
  count: number;
  createdAt: string; // ← 추가됨
  onClick: () => void;
}

const StoryCard: React.FC<Props> = ({ cover, count, createdAt, onClick }) => {
  const formattedDate = new Date(createdAt).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <Card elevation={3} sx={{ borderRadius: 4 }}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          image={cover}
          sx={{ aspectRatio: '1/1', objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {count} {count === 1 ? 'image' : 'images'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default StoryCard;
