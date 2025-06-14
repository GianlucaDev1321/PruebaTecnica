
import { CreateSolicitudDTO } from '../dtos/solicitud.dto';
import { Solicitud } from '../../domain/entities/Solicitud';
import { Aprobador } from '../../domain/entities/Aprobador';
import { guardarSolicitud } from '../../infrastructure/db/dynamodb/solicitudRepo';
import { enviarCorreoSimulado } from '../../infrastructure/mail/mockMailer';
import { guardarOTP } from '../../infrastructure/db/dynamodb/otpRepo';
import { v4 as uuidv4 } from 'uuid';
import { guardarAprobador } from '../../infrastructure/db/dynamodb/aprobadorRepo';

export const createSolicitud = async (data: CreateSolicitudDTO) => {
  if (!data.titulo || !data.descripcion || !data.monto || !data.solicitante || data.aprobadores.length !== 3) {
    throw new Error('Datos incompletos o inválidos');
  }

  const solicitudId = uuidv4();

  const aprobadores: Aprobador[] = data.aprobadores.map(ap => {
    const token = uuidv4(); // Un solo token sincronizado
    return {
      id: uuidv4(),
      nombre: ap.nombre,
      correo: ap.correo,
      estado: 'Pendiente',
      token,
      solicitudId, // ✅ Solución al error
    };
  });

  const solicitud: Solicitud = {
    id: solicitudId,
    titulo: data.titulo,
    descripcion: data.descripcion,
    monto: data.monto,
    solicitante: data.solicitante,
    estado: 'Pendiente',

    fechaCreacion: new Date().toISOString(),
  };

  await guardarSolicitud(solicitud);

  const links: string[] = [];

  for (const aprobador of aprobadores) {

    // const otpToken = uuidv4();
    const expiration = Date.now() + 3 * 60 * 1000; // 3 minutos en milisegundos
    await guardarAprobador(aprobador, solicitudId);
    // Guardamos el OTP en su tabla
    await guardarOTP({
      aprobadorId: aprobador.id,
      token: aprobador.token,
      expiresAt: expiration,
    });

    const link = `https://d1c7drnfc9stg6.cloudfront.net/approve?solicitud_id=${solicitudId}&approver_token=${aprobador.token}`;
    // const link = `http://localhost:3000/approve?solicitud_id=${solicitudId}&approver_token=${aprobador.token}`;

    await enviarCorreoSimulado(aprobador.correo, link);
    links.push(link);
  }

  return {
    solicitudId,
    mensaje: 'Solicitud creada correctamente',
    links,
  };
};