import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AprobarSolicitud from '../src/pages/AprobarSolicitud';
import * as api from '../src/services/api';

vi.mock('../src/services/api');

describe('AprobarSolicitud', () => {
    it('muestra error si el token es inválido', async () => {
        vi.spyOn(api, 'validarAcceso').mockRejectedValueOnce(new Error('Token inválido'));

        render(
            <MemoryRouter initialEntries={['/approve?approver_token=abc']}>
                <AprobarSolicitud />
            </MemoryRouter>
        );

        const boton = screen.getByText('Validar Token');
        fireEvent.click(boton);

        await waitFor(() => {
            expect(screen.getByText(/Token inválido/i)).toBeInTheDocument();
        });
    });

    it('muestra los datos si el token es válido', async () => {
        vi.spyOn(api, 'validarAcceso').mockResolvedValueOnce({
            solicitud: {
                titulo: 'Compra',
                descripcion: 'Compra de laptops',
                monto: 1200000,
                solicitante: 'Carlos',
                estado: 'Pendiente',
            },
            aprobador: {
                nombre: 'Luis',
                correo: 'luis@mail.com',
                estado: 'Pendiente',
            }
        });

        render(
            <MemoryRouter initialEntries={['/approve?approver_token=abc&solicitud_id=xyz']}>
                <AprobarSolicitud />
            </MemoryRouter>
        );

        const boton = screen.getByText('Validar Token');
        fireEvent.click(boton);

        await waitFor(() => {
            expect(screen.getByText(/Solicitud: Compra/)).toBeInTheDocument();
            expect(screen.getByText(/Carlos/)).toBeInTheDocument();
        });
    });


    it('muestra mensaje de éxito al aprobar', async () => {
        vi.spyOn(api, 'validarAcceso').mockResolvedValueOnce({
            solicitud: {
                titulo: 'Compra',
                descripcion: 'Compra de laptops',
                monto: 1200000,
                solicitante: 'Carlos',
                estado: 'Pendiente',
            },
            aprobador: {
                nombre: 'Luis',
                correo: 'luis@mail.com',
                estado: 'Pendiente',
            }
        });

        vi.spyOn(api, 'firmarSolicitud').mockResolvedValueOnce({
            message: 'Aprobado correctamente',
            fechaFirma: '2025-06-13T20:00:00.000Z'
        });

        render(
            <MemoryRouter initialEntries={['/approve?approver_token=abc&solicitud_id=xyz']}>
                <AprobarSolicitud />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Validar Token'));

        await waitFor(() => {
            expect(screen.getByText(/Solicitud: Compra/)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/✅ Aprobar/));

        await waitFor(() => {
            expect(screen.getByText(/Aprobado correctamente/i)).toBeInTheDocument();
            expect(screen.getByText(/Fecha de firma:/i)).toBeInTheDocument();
        });
    });

    it('muestra mensaje de rechazo', async () => {
        vi.spyOn(api, 'validarAcceso').mockResolvedValueOnce({
            solicitud: {
                titulo: 'Compra',
                descripcion: 'Compra de laptops',
                monto: 1200000,
                solicitante: 'Carlos',
                estado: 'Pendiente',
            },
            aprobador: {
                nombre: 'Luis',
                correo: 'luis@mail.com',
                estado: 'Pendiente',
            }
        });

        vi.spyOn(api, 'firmarSolicitud').mockResolvedValueOnce({
            message: 'Rechazado correctamente',
            fechaFirma: '2025-06-13T20:00:00.000Z'
        });

        render(
            <MemoryRouter initialEntries={['/approve?approver_token=abc&solicitud_id=xyz']}>
                <AprobarSolicitud />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Validar Token'));

        await waitFor(() => {
            expect(screen.getByText(/Solicitud: Compra/)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/❌ Rechazar/));

        await waitFor(() => {
            expect(screen.getByText(/Rechazado correctamente/i)).toBeInTheDocument();
            expect(screen.getByText(/Fecha de firma:/i)).toBeInTheDocument();
        });
    });


   it('muestra error si falta el token o el ID al enviar acción', async () => {
  vi.spyOn(api, 'validarAcceso').mockResolvedValueOnce({
    solicitud: {
      titulo: 'Compra',
      descripcion: 'Compra de laptops',
      monto: 1200000,
      solicitante: 'Carlos',
      estado: 'Pendiente',
    },
    aprobador: {
      nombre: 'Luis',
      correo: 'luis@mail.com',
      estado: 'Pendiente',
    }
  });

  // URL sin solicitud_id
  render(
    <MemoryRouter initialEntries={['/approve?approver_token=abc']}>
      <AprobarSolicitud />
    </MemoryRouter>
  );

  const validarBtn = screen.getByText('Validar Token');
  fireEvent.click(validarBtn);

  await waitFor(() => {
    expect(screen.getByText(/Solicitud: Compra/)).toBeInTheDocument();
  });

  // Hacemos clic en "❌ Rechazar" con datos incompletos
  const rechazarBtn = screen.getByText(/Rechazar/);
  fireEvent.click(rechazarBtn);

  await waitFor(() => {
    expect(screen.getByText(/Faltan datos para procesar la acción/)).toBeInTheDocument();
  });
});







});


