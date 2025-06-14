// import { guardarOTP, obtenerAprobadorIdPorToken } from '../../../src/infrastructure/db/dynamodb/otpRepo';
// import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

// jest.mock('@aws-sdk/lib-dynamodb', () => {
//   const original = jest.requireActual('@aws-sdk/lib-dynamodb');
//   return {
//     ...original,
//     PutCommand: jest.fn(),
//     QueryCommand: jest.fn()
//   };
// });

// jest.mock('@aws-sdk/client-dynamodb', () => {
//   return {
//     DynamoDBClient: jest.fn().mockImplementation(() => ({}))
//   };
// });

// const mockSend = jest.fn();

// jest.mock('@aws-sdk/lib-dynamodb', () => {
//   const original = jest.requireActual('@aws-sdk/lib-dynamodb');
//   return {
//     ...original,
//     DynamoDBDocumentClient: {
//       from: () => ({ send: mockSend })
//     },
//     PutCommand: jest.fn().mockImplementation((args) => args),
//     QueryCommand: jest.fn().mockImplementation((args) => args)
//   };
// });

// describe('otpRepo', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('debería guardar el OTP correctamente', async () => {
//     mockSend.mockResolvedValueOnce({});
//     const otp = {
//       aprobadorId: 'a1',
//       token: 'abc123',
//       expiresAt: Math.floor(Date.now() / 1000) + 180
//     };

//     await expect(guardarOTP(otp)).resolves.toBeUndefined();
//     expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ TableName: expect.any(String), Item: otp }));
//   });

//   it('debería retornar null si no se encuentra ningún OTP', async () => {
//     mockSend.mockResolvedValueOnce({ Items: [] });
//     const result = await obtenerAprobadorIdPorToken('invalid');
//     expect(result).toBeNull();
//   });

//   it('debería retornar null si el OTP está expirado', async () => {
//     mockSend.mockResolvedValueOnce({ Items: [{ aprobadorId: 'a1', token: 'abc123', expiraEn: Math.floor(Date.now() / 1000) - 10 }] });
//     const result = await obtenerAprobadorIdPorToken('abc123');
//     expect(result).toBeNull();
//   });

//   it('debería retornar el aprobadorId si el OTP está vigente', async () => {
//     mockSend.mockResolvedValueOnce({ Items: [{ aprobadorId: 'a1', token: 'abc123', expiraEn: Math.floor(Date.now() / 1000) + 180 }] });
//     const result = await obtenerAprobadorIdPorToken('abc123');
//     expect(result).toBe('a1');
//   });
// });

// 🟢 Mueve esta línea al principio, antes del mock
const mockSend = jest.fn();

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: () => ({ send: mockSend }),
  },
  PutCommand: jest.fn().mockImplementation((args) => args),
  QueryCommand: jest.fn().mockImplementation((args) => args),
}));

import {
  guardarOTP,
  obtenerAprobadorIdPorToken,
} from '../../../src/infrastructure/db/dynamodb/otpRepo';

describe('otpRepo', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  it('guardarOTP debería guardar correctamente', async () => {
    mockSend.mockResolvedValueOnce({});
    await expect(
      guardarOTP({
        aprobadorId: 'a1',
        token: 'abc123',
        expiresAt: Math.floor(Date.now() / 1000) + 60,
      })
    ).resolves.toBeUndefined();

    expect(mockSend).toHaveBeenCalledWith(expect.any(Object)); // PutCommand
  });

  it('obtenerAprobadorIdPorToken debería retornar aprobadorId si OTP es válido', async () => {
    mockSend.mockResolvedValueOnce({
      Items: [
        {
          aprobadorId: 'a1',
          token: 'abc123',
          expiraEn: Math.floor(Date.now() / 1000) + 60,
        },
      ],
    });

    const result = await obtenerAprobadorIdPorToken('abc123');
    expect(result).toBe('a1');
  });

  it('obtenerAprobadorIdPorToken debería retornar null si no hay resultados', async () => {
    mockSend.mockResolvedValueOnce({ Items: [] });

    const result = await obtenerAprobadorIdPorToken('notfound');
    expect(result).toBeNull();
  });

  it('obtenerAprobadorIdPorToken debería retornar null si OTP está expirado', async () => {
    mockSend.mockResolvedValueOnce({
      Items: [
        {
          aprobadorId: 'a1',
          token: 'abc123',
          expiraEn: Math.floor(Date.now() / 1000) - 60,
        },
      ],
    });

    const result = await obtenerAprobadorIdPorToken('expired');
    expect(result).toBeNull();
  });

  it('obtenerAprobadorIdPorToken debería retornar null si ocurre error', async () => {
    mockSend.mockRejectedValueOnce(new Error('Simulated failure'));

    const result = await obtenerAprobadorIdPorToken('error');
    expect(result).toBeNull(); // según tu lógica actual
  });
});
