import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import SolicitudesListPage from './pages/SolicitudesListPage';
import SolicitudFormPage from './pages/SolicitudFormPage';
import SolicitudDetailPage from './pages/SolicitudDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
        <AppNavbar />
        <main className="grow container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<SolicitudesListPage />} />
            <Route path="/solicitudes" element={<SolicitudesListPage />} />
            <Route path="/solicitudes/nueva" element={<SolicitudFormPage />} />
            <Route path="/solicitudes/:codigo" element={<SolicitudDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}