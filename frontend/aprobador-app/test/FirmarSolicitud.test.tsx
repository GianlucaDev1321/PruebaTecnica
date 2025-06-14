import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // ✅ Importar matchers extendidos aquí
import FirmarSolicitud from '../src/pages/FirmarSolicitud';
import * as api from '../src/services/api';

vi.mock('../src/services/api', () => ({
  firmarSolicitud: vi.fn(),
}));

const mockFirmarSolicitud = api.firmarSolicitud as ReturnType<typeof vi.fn>;

describe('FirmarSolicitud component', () => {
  beforeEach(() => {
    sessionStorage.setItem('solicitud_id', 'abc123');
    sessionStorage.setItem('token', 'mock-token');
    sessionStorage.setItem('solicitud', JSON.stringify({
      titulo: 'Compra de equipos',
      descripcion: 'Adquisición de 5 laptops',
      solicitante: 'Carlos López'
    }));
    sessionStorage.setItem('aprobador', JSON.stringify({
      nombre: 'María Pérez',
      estado: 'Pendiente'
    }));
    vi.clearAllMocks();
  });

  it('renderiza correctamente la solicitud y aprobador', () => {
    render(<FirmarSolicitud />);

    expect(screen.getByText(/Compra de equipos/)).toBeInTheDocument();
    expect(screen.getByText(/Adquisición de 5 laptops/)).toBeInTheDocument();
    expect(screen.getByText(/Carlos López/)).toBeInTheDocument();
    expect(screen.getByText(/María Pérez/)).toBeInTheDocument();
    expect(screen.getByText(/Pendiente/)).toBeInTheDocument();
  });

  it('muestra mensaje de éxito al aprobar', async () => {
    mockFirmarSolicitud.mockResolvedValueOnce({
      message: 'Solicitud aprobada exitosamente',
      fechaFirma: '2025-06-14T10:00:00Z'
    });

    render(<FirmarSolicitud />);
    fireEvent.click(screen.getByText('✅ Aprobar'));

    await waitFor(() => {
      expect(screen.getByText(/Solicitud aprobada exitosamente/)).toBeInTheDocument();
      expect(screen.getByText(/Fecha de firma:/)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error al rechazar con fallo', async () => {
    mockFirmarSolicitud.mockRejectedValueOnce(new Error('Error de red'));

    render(<FirmarSolicitud />);
    fireEvent.click(screen.getByText('❌ Rechazar'));

    await waitFor(() => {
      expect(screen.getByText(/Error al registrar la acción/)).toBeInTheDocument();
    });
  });

  it('muestra advertencia si falta token o solicitudId', () => {
    sessionStorage.removeItem('token');
    render(<FirmarSolicitud />);
    expect(screen.getByText(/❌ Datos faltantes/)).toBeInTheDocument();
  });
});
