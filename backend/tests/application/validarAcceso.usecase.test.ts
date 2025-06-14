import { validarAcceso } from '../../src/application/usecases/validarAcceso.usecase';
import * as otpRepo from '../../src/infrastructure/db/dynamodb/otpRepo';
import * as aprobadorRepo from '../../src/infrastructure/db/dynamodb/aprobadorRepo';
import * as solicitudRepo from '../../src/infrastructure/db/dynamodb/solicitudRepo';

jest.mock('../../src/infrastructure/db/dynamodb/otpRepo');
jest.mock('../../src/infrastructure/db/dynamodb/aprobadorRepo');
jest.mock('../../src/infrastructure/db/dynamodb/solicitudRepo');

const mockAprobador = {
  id: 'aprob1',
  nombre: 'Ana',
  correo: 'ana@example.com',
  estado: 'Pendiente',
  token: 'tok123',
  solicitudId: 'sol123',
};

const mockSolicitud = {
  id: 'sol123',
  titulo: 'Compra laptop',
  descripcion: 'Solicitud de compra',
  monto: 5000,
  solicitante: 'carlos@example.com',
  estado: 'Pendiente',
  fechaCreacion: new Date().toISOString(),
};

describe('validarAcceso', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe retornar 403 si el token es inválido o expirado', async () => {
    (otpRepo.obtenerAprobadorIdPorToken as jest.Mock).mockResolvedValue(null);

    const result = await validarAcceso('token-invalido');
    expect(result.statusCode).toBe(403);
    expect(JSON.parse(result.body).message).toBe('Token inválido o expirado');
  });

  it('debe retornar 404 si el aprobador no existe', async () => {
    (otpRepo.obtenerAprobadorIdPorToken as jest.Mock).mockResolvedValue('aprob1');
    (aprobadorRepo.obtenerAprobadorPorId as jest.Mock).mockResolvedValue(null);

    const result = await validarAcceso('token123');
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe('Aprobador no encontrado');
  });

  it('debe retornar 404 si la solicitud no existe', async () => {
    (otpRepo.obtenerAprobadorIdPorToken as jest.Mock).mockResolvedValue('aprob1');
    (aprobadorRepo.obtenerAprobadorPorId as jest.Mock).mockResolvedValue(mockAprobador);
    (solicitudRepo.obtenerSolicitudPorId as jest.Mock).mockResolvedValue(null);

    const result = await validarAcceso('token123');
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe('Solicitud no encontrada');
  });

  it('debe retornar 200 con aprobador y solicitud si todo está correcto', async () => {
    (otpRepo.obtenerAprobadorIdPorToken as jest.Mock).mockResolvedValue('aprob1');
    (aprobadorRepo.obtenerAprobadorPorId as jest.Mock).mockResolvedValue(mockAprobador);
    (solicitudRepo.obtenerSolicitudPorId as jest.Mock).mockResolvedValue(mockSolicitud);

    const result = await validarAcceso('token123');
    expect(result.statusCode).toBe(200);

    const parsedBody = JSON.parse(result.body);
    expect(parsedBody.aprobador).toMatchObject(mockAprobador);
    expect(parsedBody.solicitud).toMatchObject(mockSolicitud);
  });

  it('debe retornar 500 si ocurre un error inesperado', async () => {
    (otpRepo.obtenerAprobadorIdPorToken as jest.Mock).mockRejectedValue(new Error('Simulated error'));

    const result = await validarAcceso('token123');
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Error interno en la validación');
  });
});
