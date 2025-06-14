// test/api.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

import { validarAcceso, firmarSolicitud } from '../src/services/api';

const API_BASE = 'https://wkot1znpzj.execute-api.us-east-2.amazonaws.com/dev';

const server = setupServer(
  http.get(`${API_BASE}/solicitudes/validar-acceso`, ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (token === 'valido123') {
    const responseBody = {
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
      },
    };

    return new Response(JSON.stringify({ body: JSON.stringify(responseBody) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}),


  http.post(`${API_BASE}/solicitudes/firma`, async ({ request }) => {
  const body = await request.json() as {
    token?: string;
    solicitudId?: string;
    accion?: 'aprobar' | 'rechazar';
  };

  if (body?.token === 'valido123' && body?.solicitudId && body?.accion) {
    return HttpResponse.json({
      message: `Solicitud ${body.accion} con éxito`,
      fechaFirma: '2025-06-13T12:00:00Z',
    });
  } else {
    return new HttpResponse('Error al procesar firma', { status: 400 });
  }
    })

);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('API Service', () => {
  it('validarAcceso devuelve datos válidos con token correcto', async () => {
    const result = await validarAcceso('valido123');
    expect(result.solicitud.titulo).toBe('Compra');
    expect(result.aprobador.nombre).toBe('Luis');
  });

  it('validarAcceso lanza error con token inválido', async () => {
    await expect(validarAcceso('invalido')).rejects.toThrow('Request failed with status code 401');
  });

  it('firmarSolicitud responde con mensaje de éxito', async () => {
    const result = await firmarSolicitud('sol123', 'valido123', 'aprobar');
    expect(result.message).toContain('Solicitud aprobar con éxito');
    expect(result.fechaFirma).toBe('2025-06-13T12:00:00Z');
  });

  it('firmarSolicitud lanza error si faltan datos', async () => {
    await expect(firmarSolicitud('', '', 'rechazar')).rejects.toThrow();
  });
});
