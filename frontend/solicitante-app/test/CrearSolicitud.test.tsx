/// <reference types="vitest" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrearSolicitud from '../src/pages/CrearSolicitud';
import * as api from '../src/services/api';

const mockResponse = {
  mensaje: 'Solicitud creada correctamente',
  solicitudId: 'abc123',
  links: [
    'https://aprobador1.com',
    'https://aprobador2.com',
    'https://aprobador3.com'
  ]
};

describe('CrearSolicitud', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(api, 'crearSolicitud').mockResolvedValue(mockResponse);
  });

  it('envía el formulario y muestra la respuesta', async () => {
    render(<CrearSolicitud />);

    fireEvent.change(screen.getByPlaceholderText('Título'), {
      target: { value: 'Compra equipo' }
    });
    fireEvent.change(screen.getByPlaceholderText('Descripción'), {
      target: { value: 'Compra de computadores' }
    });
    fireEvent.change(screen.getByPlaceholderText('Monto'), {
      target: { value: '5000000' }
    });
    fireEvent.change(screen.getByPlaceholderText('Correo del solicitante'), {
      target: { value: 'carlos@mail.com' }
    });

    fireEvent.change(screen.getByPlaceholderText('Nombre 1'), {
      target: { value: 'Aprobador 1' }
    });
    fireEvent.change(screen.getByPlaceholderText('Correo 1'), {
      target: { value: 'ap1@mail.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Nombre 2'), {
      target: { value: 'Aprobador 2' }
    });
    fireEvent.change(screen.getByPlaceholderText('Correo 2'), {
      target: { value: 'ap2@mail.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Nombre 3'), {
      target: { value: 'Aprobador 3' }
    });
    fireEvent.change(screen.getByPlaceholderText('Correo 3'), {
      target: { value: 'ap3@mail.com' }
    });

    fireEvent.click(screen.getByText('Enviar Solicitud'));

    await waitFor(() => {
  const container = screen.getByText(/Solicitud creada correctamente/i).closest('div');
  expect(container).toBeInTheDocument();

  // ID de solicitud por partes
  expect(screen.getByText(/ID Solicitud:/i)).toBeInTheDocument();
  expect(screen.getByText('abc123')).toBeInTheDocument();

  // Validar exactamente 3 links de aprobadores
  const aprobadorLinks = screen.getAllByRole('link');
  expect(aprobadorLinks).toHaveLength(3);
});

  });
});
