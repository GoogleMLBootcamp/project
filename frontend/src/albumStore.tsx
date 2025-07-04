import React, { createContext, useContext, useState } from 'react';

/* ---------- 타입 ---------- */
export type Album = {
  id: string;
  images: string[];
  cover: string;
  count: number;
  createdAt: string;
  story?: string;
};

type Ctx = {
  albums: Album[];
  addAlbum: (a: Album) => void;
  addImages: (id: string, urls: string[]) => void;
  saveStory: (id: string, story: string) => void;
};

/* ---------- 컨텍스트 ---------- */
const AlbumCtx = createContext<Ctx>(null as never);

export const AlbumProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [albums, setAlbums] = useState<Album[]>([]);

  /* 새 폴더(=Album) 저장 */
  const addAlbum = (a: Album) => setAlbums(prev => [...prev, a]);

  /* 이미지 추가 */
  const addImages = (id: string, urls: string[]) =>
    setAlbums(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              images: [...a.images, ...urls],
              count: a.count + urls.length,
              cover: a.cover || urls[0],
            }
          : a,
      ),
    );

  /* 스토리 저장 */
  const saveStory = (id: string, story: string) =>
    setAlbums(prev => prev.map(a => (a.id === id ? { ...a, story } : a)));

  return (
    <AlbumCtx.Provider value={{ albums, addAlbum, addImages, saveStory }}>
      {children}
    </AlbumCtx.Provider>
  );
};

/* 훅 */
export const useAlbums = () => useContext(AlbumCtx);
