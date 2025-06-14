// test/SolicitudesRoutes.test.tsx
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import SolicitudesRoutes from '../src/routes/solicitante.routes';

describe('SolicitudesRoutes', () => {
  it('renderiza PanelSolicitudes en ruta raíz "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/*" element={<SolicitudesRoutes />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Panel de Solicitudes')).toBeInTheDocument();
  });

  it('renderiza CrearSolicitud en ruta "/crear"', () => {
    render(
      <MemoryRouter initialEntries={['/crear']}>
        <Routes>
          <Route path="/*" element={<SolicitudesRoutes />} />
        </Routes>
      </MemoryRouter>
    );

    // Cambio aquí: texto correcto según el componente
    expect(screen.getByText('Crear Solicitud de Compra')).toBeInTheDocument();
  });

  it('renderiza ListaSolicitudes en ruta "/lista"', () => {
    render(
      <MemoryRouter initialEntries={['/lista']}>
        <Routes>
          <Route path="/*" element={<SolicitudesRoutes />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('📄 Solicitudes')).toBeInTheDocument();
  });
});
