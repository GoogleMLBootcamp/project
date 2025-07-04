import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AlbumProvider } from './albumStore';
import Dashboard from './Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AlbumProvider>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AlbumProvider>
    </BrowserRouter>
  );
}
