import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ValidarToken from '../src/pages/ValidarToken';
import * as api from '../src/services/api';

vi.mock('../src/services/api');
const mockValidarAcceso = api.validarAcceso as unknown as ReturnType<typeof vi.fn>;

const renderWithRouter = (initialEntries = ['/approve?approver_token=abc123']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/approve" element={<ValidarToken />} />
        <Route path="/approve/firmar" element={<div>Firmar pantalla</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ValidarToken component', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('renderiza el campo con token precargado desde la URL', () => {
    renderWithRouter();
    const input = screen.getByPlaceholderText('Ingrese el token') as HTMLInputElement;
    expect(input.value).toBe('abc123');
  });

  it('muestra error si el token está vacío y se hace clic en validar', async () => {
    renderWithRouter(['/approve']);
    fireEvent.click(screen.getByText('Validar Token'));
    expect(await screen.findByText(/Debe ingresar el token/)).toBeInTheDocument();
  });

  it('redirige a /approve/firmar si el token es válido', async () => {
    mockValidarAcceso.mockResolvedValueOnce({
      solicitud: { id: '123', titulo: 'Compra', descripcion: 'Laptops', solicitante: 'Carlos' },
      aprobador: { nombre: 'María', estado: 'Pendiente' },
    });

    renderWithRouter();
    fireEvent.click(screen.getByText('Validar Token'));

    await waitFor(() => {
      expect(screen.getByText('Firmar pantalla')).toBeInTheDocument();
    });
  });

  it('muestra mensaje de token inválido si no se retorna aprobador o solicitud', async () => {
    mockValidarAcceso.mockResolvedValueOnce({});

    renderWithRouter();
    fireEvent.click(screen.getByText('Validar Token'));

    await waitFor(() => {
      expect(screen.getByText(/Token inválido o expirado/)).toBeInTheDocument();
    });
  });

  it('muestra error si ocurre una excepción al validar', async () => {
    mockValidarAcceso.mockRejectedValueOnce(new Error('Fallo de red'));

    renderWithRouter();
    fireEvent.click(screen.getByText('Validar Token'));

    await waitFor(() => {
      expect(screen.getByText(/Error validando el token/)).toBeInTheDocument();
    });
  });
});
