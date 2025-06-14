import { obtenerAprobadorPorId } from '../../infrastructure/db/dynamodb/aprobadorRepo';
import { obtenerSolicitudPorId } from '../../infrastructure/db/dynamodb/solicitudRepo';
import { obtenerAprobadorIdPorToken } from '../../infrastructure/db/dynamodb/otpRepo';

export const validarAcceso = async (token: string) => {
  try {
    const aprobadorId = await obtenerAprobadorIdPorToken(token);

    if (!aprobadorId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Token inválido o expirado' }),
      };
    }

    const aprobador = await obtenerAprobadorPorId(aprobadorId);

    if (!aprobador) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Aprobador no encontrado' }),
      };
    }

    const solicitud = await obtenerSolicitudPorId(aprobador.solicitudId);

    if (!solicitud) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Solicitud no encontrada' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        aprobador,
        solicitud,
      }),
    };
  } catch (error) {
    console.error('❌ Error en validarAcceso:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno en la validación' }),
    };
  }
};

