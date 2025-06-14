// test/apiCrud.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

import { crearSolicitud, obtenerSolicitudes, descargarEvidencia } from '../src/services/api';

const API_BASE = 'https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev';

const server = setupServer(
  // Mock POST /solicitudes
  http.post(`${API_BASE}/solicitudes`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      mensaje: 'Solicitud creada correctamente',
      solicitudId: 'mock-id-123',
      links: ['https://aprobador1.com', 'https://aprobador2.com'],
    });
  }),

  // Mock GET /solicitudes
  http.get(`${API_BASE}/solicitudes`, () => {
    return HttpResponse.json([
      { id: '1', titulo: 'Solicitud 1', descripcion: 'desc 1', estado: 'Pendiente' },
      { id: '2', titulo: 'Solicitud 2', descripcion: 'desc 2', estado: 'Completada' },
    ]);
  }),

  // Mock GET /api/solicitudes/:id/evidencia.pdf
  http.get(`${API_BASE}/api/solicitudes/mock-id/evidencia.pdf`, () => {
    return HttpResponse.json({ url: 'https://bucket-evidencia.com/mock-id.pdf' });
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('API CRUD Services', () => {
  it('crearSolicitud responde con mensaje y links', async () => {
    const payload = {
      titulo: 'Compra PC',
      descripcion: 'Solicitud de compra',
      monto: 500000,
      solicitante: 'juan@mail.com',
      aprobadores: [
        { nombre: 'Ana', correo: 'ana@mail.com' },
        { nombre: 'Luis', correo: 'luis@mail.com' },
        { nombre: 'Pedro', correo: 'pedro@mail.com' },
      ],
    };

    const res = await crearSolicitud(payload);

    expect(res.mensaje).toBe('Solicitud creada correctamente');
    expect(res.solicitudId).toBe('mock-id-123');
    expect(res.links).toHaveLength(2);
  });

  it('obtenerSolicitudes devuelve lista de solicitudes', async () => {
    const data = await obtenerSolicitudes();

    expect(data).toHaveLength(2);
    expect(data[0].titulo).toBe('Solicitud 1');
    expect(data[1].estado).toBe('Completada');
  });

  it('descargarEvidencia abre una nueva pestaña si la URL es válida', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    await descargarEvidencia('mock-id');

    expect(openSpy).toHaveBeenCalledWith('https://bucket-evidencia.com/mock-id.pdf', '_blank');
    openSpy.mockRestore();
  });

  it('descargarEvidencia lanza alerta si no hay URL', async () => {
    server.use(
      http.get(`${API_BASE}/api/solicitudes/mock-id/evidencia.pdf`, () =>
        HttpResponse.json({})
      )
    );

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    await descargarEvidencia('mock-id');

    expect(alertSpy).toHaveBeenCalledWith('No se pudo obtener la URL del archivo');
    alertSpy.mockRestore();
  });

  it('descargarEvidencia lanza alerta si hay error', async () => {
    server.use(
      http.get(`${API_BASE}/api/solicitudes/mock-id/evidencia.pdf`, () =>
        HttpResponse.error()
      )
    );

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    await descargarEvidencia('mock-id');

    expect(alertSpy).toHaveBeenCalledWith('Error al intentar descargar el PDF');
    alertSpy.mockRestore();
  });
});
