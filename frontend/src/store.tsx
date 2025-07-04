import React, { createContext, useContext, useState } from 'react';

/* ------------ 타입 ------------ */
export interface CardData {
  id: string;   // story_id
  url: string;  // 대표 썸네일(예: 1.jpg)
  title?: string;
}

/* ------------ Context ------------ */
const ImageCtx = createContext<{
  cards: CardData[];
  addCards: (c: CardData[]) => void;
}>({ cards: [], addCards: () => {} });

export const ImageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const addCards = (c: CardData[]) => setCards(prev => [...prev, ...c]);
  return <ImageCtx.Provider value={{ cards, addCards }}>{children}</ImageCtx.Provider>;
};

export const useImages = () => useContext(ImageCtx);
