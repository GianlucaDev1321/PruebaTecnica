import * as aprobadorRepo from '../../../src/infrastructure/db/dynamodb/aprobadorRepo';
import { Aprobador } from '../../../src/domain/entities/Aprobador';

jest.mock('../../../src/infrastructure/db/dynamodb/dynamoClient', () => ({
  client: {
    send: jest.fn(),
  },
}));

import { client } from '../../../src/infrastructure/db/dynamodb/dynamoClient';
const mockSend = client.send as jest.Mock;

describe('aprobadorRepo', () => {
  const aprobador: Aprobador = {
    id: 'a1',
    nombre: 'Juan Pérez',
    correo: 'juan@example.com',
    estado: 'Firmado',
    token: 'token123',
    fechaFirma: '2025-06-12T12:00:00Z',
    solicitudId: 'sol123',
  };

  beforeEach(() => {
    mockSend.mockReset();
  });

  it('guardarAprobador guarda correctamente', async () => {
    mockSend.mockResolvedValue({});
    await aprobadorRepo.guardarAprobador(aprobador, 'sol123');
    expect(mockSend).toHaveBeenCalled();
  });

  it('obtenerAprobadorPorId retorna un aprobador si existe', async () => {
    mockSend.mockResolvedValue({ Item: aprobador });
    const result = await aprobadorRepo.obtenerAprobadorPorId('a1');
    expect(result).toMatchObject(aprobador);
  });

  it('obtenerAprobadorPorToken retorna un aprobador si existe', async () => {
    mockSend.mockResolvedValue({ Items: [aprobador] });
    const result = await aprobadorRepo.obtenerAprobadorPorToken('token123');
    expect(result).toMatchObject(aprobador);
  });

  it('actualizarEstadoAprobador actualiza correctamente', async () => {
    mockSend.mockResolvedValue({});
    await aprobadorRepo.actualizarEstadoAprobador('a1', 'Firmado', '2025-06-12T12:00:00Z');
    expect(mockSend).toHaveBeenCalled();
  });

  it('obtenerFirmadosPorSolicitud retorna lista filtrada', async () => {
    mockSend.mockResolvedValue({ Items: [aprobador] });
    const result = await aprobadorRepo.obtenerFirmadosPorSolicitud('sol123');
    expect(result).toMatchObject([aprobador]);
  });

  it('obtenerAprobadoresPorSolicitud retorna todos los aprobadores', async () => {
    mockSend.mockResolvedValue({ Items: [aprobador] });
    const result = await aprobadorRepo.obtenerAprobadoresPorSolicitud('sol123');
    expect(result).toMatchObject([aprobador]);
  });
});
