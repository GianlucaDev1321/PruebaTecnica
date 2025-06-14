import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CrearSolicitud from '../pages/CrearSolicitud';
import ListaSolicitudes from '../pages/ListaSolicitudes';
import PanelSolicitudes from '../pages/PanelSolicitudes';

const SolicitudesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PanelSolicitudes />} />
      <Route path="crear" element={<CrearSolicitud />} />
      <Route path="lista" element={<ListaSolicitudes />} />
    </Routes>
  );
};

export default SolicitudesRoutes;
