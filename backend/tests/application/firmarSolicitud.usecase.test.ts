import { firmarSolicitud } from '../../src/application/usecases/firmarSolicitud.usecase';
import { Aprobador } from '../../src/domain/entities/Aprobador';
import { Solicitud } from '../../src/domain/entities/Solicitud';

const mockSolicitud: Solicitud = {
  id: 'sol123',
  titulo: 'Compra laptop',
  descripcion: 'Solicitud de compra',
  monto: 5000,
  solicitante: 'carlos@example.com',
  estado: 'Pendiente',
  fechaCreacion: new Date().toISOString(),
};

const mockAprobador: Aprobador = {
  id: 'aprob1',
  nombre: 'Juan',
  correo: 'juan@example.com',
  estado: 'Pendiente',
  token: 'tok123',
  solicitudId: 'sol123',
};

describe('firmarSolicitud', () => {
  it('retorna 404 si la solicitud no existe', async () => {
    const deps = {
      obtenerSolicitudPorId: jest.fn().mockResolvedValue(null),
      actualizarEstadoSolicitud: jest.fn(),
      actualizarEstadoAprobador: jest.fn(),
      obtenerFirmadosPorSolicitud: jest.fn(),
      obtenerAprobadorPorId: jest.fn(),
      obtenerAprobadoresPorSolicitud: jest.fn(),
      generarPdfEvidencia: jest.fn(),
    };

    const result = await firmarSolicitud(
      { solicitudId: 'invalid', aprobadorId: 'a1', accion: 'aprobar' },
      deps
    );

    expect(result.statusCode).toBe(404);
  });

  it('retorna 404 si el aprobador no existe', async () => {
    const deps = {
      obtenerSolicitudPorId: jest.fn().mockResolvedValue(mockSolicitud),
      actualizarEstadoSolicitud: jest.fn(),
      actualizarEstadoAprobador: jest.fn(),
      obtenerFirmadosPorSolicitud: jest.fn(),
      obtenerAprobadorPorId: jest.fn().mockResolvedValue(null),
      obtenerAprobadoresPorSolicitud: jest.fn(),
      generarPdfEvidencia: jest.fn(),
    };

    const result = await firmarSolicitud(
      { solicitudId: 'sol123', aprobadorId: 'invalid', accion: 'aprobar' },
      deps
    );

    expect(result.statusCode).toBe(404);
  });

  it('retorna 409 si el aprobador ya firmó', async () => {
    const deps = {
      obtenerSolicitudPorId: jest.fn().mockResolvedValue(mockSolicitud),
      actualizarEstadoSolicitud: jest.fn(),
      actualizarEstadoAprobador: jest.fn(),
      obtenerFirmadosPorSolicitud: jest.fn(),
      obtenerAprobadorPorId: jest.fn().mockResolvedValue({ ...mockAprobador, estado: 'Firmado' }),
      obtenerAprobadoresPorSolicitud: jest.fn(),
      generarPdfEvidencia: jest.fn(),
    };

    const result = await firmarSolicitud(
      { solicitudId: 'sol123', aprobadorId: 'aprob1', accion: 'aprobar' },
      deps
    );

    expect(result.statusCode).toBe(409);
  });

  it('firma correctamente y genera PDF si es el tercer aprobador', async () => {
  const deps = {
    obtenerSolicitudPorId: jest.fn().mockResolvedValue(mockSolicitud),
    actualizarEstadoSolicitud: jest.fn(),
    actualizarEstadoAprobador: jest.fn(),
    obtenerFirmadosPorSolicitud: jest.fn().mockResolvedValue([
      { ...mockAprobador, id: 'a1', estado: 'Firmado' },
      { ...mockAprobador, id: 'a2', estado: 'Firmado' },
      { ...mockAprobador, id: 'aprob1', estado: 'Firmado' }, // <= incluye el tercero aquí
    ]),
    obtenerAprobadorPorId: jest.fn().mockResolvedValue({ ...mockAprobador, estado: 'Pendiente' }),
    obtenerAprobadoresPorSolicitud: jest.fn().mockResolvedValue([
      mockAprobador,
      { ...mockAprobador, id: 'a2' },
      { ...mockAprobador, id: 'a3' },
    ]),
    generarPdfEvidencia: jest.fn(),
  };

  const result = await firmarSolicitud(
    { solicitudId: 'sol123', aprobadorId: 'aprob1', accion: 'aprobar' },
    deps
  );

  expect(result.statusCode).toBe(200);
  expect(deps.actualizarEstadoSolicitud).toHaveBeenCalledWith('sol123', 'Completada');
  expect(deps.generarPdfEvidencia).toHaveBeenCalled();
});


  it('firma correctamente si aún no se completa', async () => {
    const deps = {
      obtenerSolicitudPorId: jest.fn().mockResolvedValue(mockSolicitud),
      actualizarEstadoSolicitud: jest.fn(),
      actualizarEstadoAprobador: jest.fn(),
      obtenerFirmadosPorSolicitud: jest.fn().mockResolvedValue([
        { ...mockAprobador, id: 'a2', estado: 'Firmado' },
      ]),
      obtenerAprobadorPorId: jest.fn().mockResolvedValue({ ...mockAprobador, estado: 'Pendiente' }),
      obtenerAprobadoresPorSolicitud: jest.fn(),
      generarPdfEvidencia: jest.fn(),
    };

    const result = await firmarSolicitud(
      { solicitudId: 'sol123', aprobadorId: 'aprob1', accion: 'aprobar' },
      deps
    );

    expect(result.statusCode).toBe(200);
    expect(deps.actualizarEstadoSolicitud).not.toHaveBeenCalled();
    expect(deps.generarPdfEvidencia).not.toHaveBeenCalled();
  });
});
