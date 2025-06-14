import { Routes, Route, useLocation } from 'react-router-dom';
import AprobarSolicitud from '../pages/AprobarSolicitud';

const AprobadorRoutes = () => {
  const location = useLocation();
  console.log('🔍 Ubicación actual:', location.pathname); // <- Esto debe imprimirse

  return (
    <Routes>
      <Route path="/" element={<AprobarSolicitud />} />
    </Routes>
  );
};

export default AprobadorRoutes;
