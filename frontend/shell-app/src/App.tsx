import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Solicitudes = lazy(() => import('solicitanteApp/Solicitudes'));
const Aprobador = lazy(() => import('aprobadorApp/Aprobador'));


function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Cargando microfrontend...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/solicitante" replace />} />
          <Route path="/solicitante/*" element={<Solicitudes />} />
          <Route path="/aprobador/*" element={<Aprobador />} />
          <Route path="/approve" element={<Aprobador />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
