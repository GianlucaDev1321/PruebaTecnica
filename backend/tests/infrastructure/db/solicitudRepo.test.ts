// import * as solicitudRepo from '../../../src/infrastructure/db/dynamodb/solicitudRepo';
// import { Solicitud } from '../../../src/domain/entities/Solicitud';
// import { PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

// const mockPutSend = jest.fn();
// const mockClientSend = jest.fn();

// jest.mock('@aws-sdk/lib-dynamodb', () => {
//   const original = jest.requireActual('@aws-sdk/lib-dynamodb');
//   return {
//     ...original,
//     DynamoDBDocumentClient: {
//       from: () => ({ send: mockPutSend })
//     },
//     PutCommand: jest.fn(),
//     GetCommand: jest.fn(),
//     UpdateCommand: jest.fn()
//   };
// });

// jest.mock('@aws-sdk/client-dynamodb', () => {
//   return {
//     DynamoDBClient: jest.fn().mockImplementation(() => ({
//       send: mockClientSend
//     }))
//   };
// });

// describe('solicitudRepo', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   const mockSolicitud: Solicitud = {
//     id: 'sol123',
//     titulo: 'Solicitud de prueba',
//     descripcion: 'Descripción',
//     monto: 1000,
//     solicitante: 'usuario@example.com',
//     estado: 'Pendiente',
//     fechaCreacion: new Date().toISOString()
//   };

//   it('guardarSolicitud debería llamar a PutCommand con los datos correctos', async () => {
//     await solicitudRepo.guardarSolicitud(mockSolicitud);

//     expect(PutCommand).toHaveBeenCalledWith({
//       TableName: expect.any(String),
//       Item: mockSolicitud
//     });
//     expect(mockPutSend).toHaveBeenCalled();
//   });

//   it('obtenerSolicitudPorId debería retornar una solicitud si existe', async () => {
//     mockClientSend.mockResolvedValue({ Item: mockSolicitud });

//     const result = await solicitudRepo.obtenerSolicitudPorId(mockSolicitud.id);

//     expect(GetCommand).toHaveBeenCalledWith({
//       TableName: expect.any(String),
//       Key: { id: mockSolicitud.id }
//     });
//     expect(result).toEqual(mockSolicitud);
//   });

//   it('actualizarEstadoSolicitud debería llamar a UpdateCommand con estado correcto', async () => {
//     await solicitudRepo.actualizarEstadoSolicitud(mockSolicitud.id, 'Completada');

//     expect(UpdateCommand).toHaveBeenCalledWith({
//       TableName: expect.any(String),
//       Key: { id: mockSolicitud.id },
//       UpdateExpression: 'set estado = :e',
//       ExpressionAttributeValues: {
//         ':e': 'Completada'
//       }
//     });

//     expect(mockClientSend).toHaveBeenCalled();
//   });
// });



// tests/infrastructure/db/solicitudRepo.test.ts

import { Solicitud } from '../../../src/domain/entities/Solicitud';

// Mocks
const mockPutSend = jest.fn();
const mockClientSend = jest.fn();

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const original = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...original,
    DynamoDBDocumentClient: {
      from: () => ({ send: mockPutSend }),
    },
    PutCommand: jest.fn().mockImplementation((args) => args),
    GetCommand: jest.fn().mockImplementation((args) => args),
    UpdateCommand: jest.fn().mockImplementation((args) => args),
  };
});

jest.mock('@aws-sdk/client-dynamodb', () => {
  return {
    DynamoDBClient: jest.fn().mockImplementation(() => ({
      send: mockClientSend,
    })),
  };
});

import {
  guardarSolicitud,
  obtenerSolicitudPorId,
  actualizarEstadoSolicitud,
} from '../../../src/infrastructure/db/dynamodb/solicitudRepo';

describe('solicitudRepo', () => {
  const mockSolicitud: Solicitud = {
    id: 'sol123',
    titulo: 'Compra equipo',
    descripcion: 'Compra de laptop',
    monto: 1500,
    solicitante: 'Juan Pérez',
    estado: 'Pendiente',
    fechaCreacion: new Date().toISOString(),
  };

  beforeEach(() => {
    mockPutSend.mockReset();
    mockClientSend.mockReset();
  });

  it('guardarSolicitud debería llamar a PutCommand con los datos correctos', async () => {
    mockPutSend.mockResolvedValueOnce({});
    await guardarSolicitud(mockSolicitud);

    expect(mockPutSend).toHaveBeenCalled();
    const calledArgs = mockPutSend.mock.calls[0][0];
    expect(calledArgs.Item).toEqual(mockSolicitud); // ✅ corregido
  });

  it('obtenerSolicitudPorId debería retornar una solicitud si existe', async () => {
    mockClientSend.mockResolvedValueOnce({ Item: mockSolicitud });

    const result = await obtenerSolicitudPorId('sol123');

    expect(mockClientSend).toHaveBeenCalled();
    expect(result).toEqual(mockSolicitud);
  });

  it('actualizarEstadoSolicitud debería llamar a UpdateCommand con estado correcto', async () => {
    mockClientSend.mockResolvedValueOnce({});

    await actualizarEstadoSolicitud('sol123', 'Completada');

    expect(mockClientSend).toHaveBeenCalled();
    const calledArgs = mockClientSend.mock.calls[0][0];
    expect(calledArgs.Key).toEqual({ id: 'sol123' }); // ✅ corregido
    expect(calledArgs.ExpressionAttributeValues).toEqual({ ':e': 'Completada' });
  });
});
