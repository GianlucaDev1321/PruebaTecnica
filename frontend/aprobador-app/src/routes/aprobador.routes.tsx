import { Routes, Route, useLocation } from 'react-router-dom';


import ValidarToken from '../pages/ValidarToken';
import FirmarSolicitud from '../pages/FirmarSolicitud';

const AprobadorRoutes = () => {
  const location = useLocation();
  console.log('🔍 Ubicación actual:', location.pathname); // <- Esto debe imprimirse

  return (
    <Routes>
      <Route path="/" element={<ValidarToken />} />
      <Route path="/firmar" element={<FirmarSolicitud />} />
    </Routes>
  );
};

export default AprobadorRoutes;
