// import { createSolicitud } from '../../src/application/usecases/createSolicitud.usecase';
// import { CreateSolicitudDTO } from '../../src/application/dtos/solicitud.dto';

// jest.mock('../../src/infrastructure/db/dynamodb/solicitudRepo', () => ({
//   guardarSolicitud: jest.fn(),
// }));

// jest.mock('../../src/infrastructure/db/dynamodb/otpRepo', () => ({
//   guardarOTP: jest.fn(),
// }));

// jest.mock('../../src/infrastructure/mail/mockMailer', () => ({
//   enviarCorreoSimulado: jest.fn(),
// }));

// describe('createSolicitud', () => {
//   it('debería lanzar error si faltan campos', async () => {
//     const dto: Partial<CreateSolicitudDTO> = {
//       titulo: 'Compra',
//       descripcion: 'Algo',
//     };
//     await expect(createSolicitud(dto as CreateSolicitudDTO)).rejects.toThrow('Datos incompletos o inválidos');
//   });

//   it('debería retornar un id y 3 links si la solicitud es válida', async () => {
//     const dto: CreateSolicitudDTO = {
//       titulo: 'Compra',
//       descripcion: 'Prueba',
//       monto: 5000,
//       solicitante: 'carlos@example.com',
//       aprobadores: [
//         { nombre: 'Juan', correo: 'juan@example.com' },
//         { nombre: 'Ana', correo: 'ana@example.com' },
//         { nombre: 'Luis', correo: 'luis@example.com' },
//       ],
//     };

//     const result = await createSolicitud(dto);
//     expect(result.solicitudId).toBeDefined();
//     expect(result.links).toHaveLength(3);
//   });
// });

import { createSolicitud } from '../../src/application/usecases/createSolicitud.usecase';
import { CreateSolicitudDTO } from '../../src/application/dtos/solicitud.dto';

import { guardarSolicitud } from '../../src/infrastructure/db/dynamodb/solicitudRepo';
import { guardarOTP } from '../../src/infrastructure/db/dynamodb/otpRepo';
import { enviarCorreoSimulado } from '../../src/infrastructure/mail/mockMailer';

jest.mock('../../src/infrastructure/db/dynamodb/solicitudRepo');
jest.mock('../../src/infrastructure/db/dynamodb/otpRepo');
jest.mock('../../src/infrastructure/mail/mockMailer');

describe('createSolicitud', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería lanzar error si faltan campos', async () => {
    const dto: Partial<CreateSolicitudDTO> = {
      titulo: 'Compra',
      descripcion: 'Algo',
    };
    await expect(createSolicitud(dto as CreateSolicitudDTO)).rejects.toThrow('Datos incompletos o inválidos');
  });

  it('debería retornar un id y 3 links si la solicitud es válida', async () => {
    const dto: CreateSolicitudDTO = {
      titulo: 'Compra',
      descripcion: 'Prueba',
      monto: 5000,
      solicitante: 'carlos@example.com',
      aprobadores: [
        { nombre: 'Juan', correo: 'juan@example.com' },
        { nombre: 'Ana', correo: 'ana@example.com' },
        { nombre: 'Luis', correo: 'luis@example.com' },
      ],
    };

    const result = await createSolicitud(dto);

    expect(result.solicitudId).toBeDefined();
    expect(result.links).toHaveLength(3);

    expect(guardarSolicitud).toHaveBeenCalledTimes(1);
    expect(guardarOTP).toHaveBeenCalledTimes(3);
    expect(enviarCorreoSimulado).toHaveBeenCalledTimes(3);

    result.links.forEach((link) => {
      expect(link).toContain('https://');
      expect(link).toContain('solicitud_id=');
      expect(link).toContain('approver_token=');
    });
  });
});
