import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AprobadorRoutes from '../src/routes/aprobador.routes';

describe('AprobadorRoutes', () => {
  it('renderiza AprobarSolicitud en la ruta /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/*" element={<AprobadorRoutes />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Validar acceso/i)).toBeInTheDocument();
  });
});
