

// import { APIGatewayProxyHandler } from 'aws-lambda';
// import { firmarSolicitud } from '../../application/usecases/firmarSolicitud.usecase';
// import { obtenerAprobadorIdPorToken } from '../../infrastructure/db/dynamodb/otpRepo';
// import {
//    actualizarEstadoAprobador,
//   obtenerFirmadosPorSolicitud,
//   obtenerAprobadorPorId,
//   obtenerAprobadoresPorSolicitud,
// } from '../../infrastructure/db/dynamodb/aprobadorRepo';
// import {
//   obtenerSolicitudPorId,
//   actualizarEstadoSolicitud,
// } from '../../infrastructure/db/dynamodb/solicitudRepo';
// import { generarPdfEvidencia } from '../../infrastructure/s3/pdfGenerator';


// export const handler: APIGatewayProxyHandler = async (event) => {
//   try {
//     const body = event.isBase64Encoded
//       ? JSON.parse(Buffer.from(event.body || '', 'base64').toString('utf8'))
//       : JSON.parse(event.body || '{}');

//     const { solicitudId, token, accion } = body;

//     if (!solicitudId || !token || !accion) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Datos incompletos' }),
//       };
//     }

//     const aprobadorId = await obtenerAprobadorIdPorToken(token);
//     if (!aprobadorId) {
//       return {
//         statusCode: 401,
//         body: JSON.stringify({ message: 'Token inválido o expirado' }),
//       };
//     }

//     const result = await firmarSolicitud(
//       { solicitudId, aprobadorId, accion },
//       {
//         obtenerSolicitudPorId,
//         actualizarEstadoSolicitud,
//         actualizarEstadoAprobador,
//         obtenerFirmadosPorSolicitud,
//         obtenerAprobadorPorId,
//         obtenerAprobadoresPorSolicitud,
//         generarPdfEvidencia,
//       }
//     );

//     return {
//       statusCode: result.statusCode,
//       body: result.body,
//     };
//   } catch (error) {
//     console.error('❌ Error en firmarSolicitud.handler:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Error interno del servidor' }),
//     };
//   }
// };



import { APIGatewayProxyHandler } from 'aws-lambda';
import { firmarSolicitud } from '../../application/usecases/firmarSolicitud.usecase';
import { obtenerSolicitudPorId, actualizarEstadoSolicitud } from '../../infrastructure/db/dynamodb/solicitudRepo';
import {
  actualizarEstadoAprobador,
  obtenerAprobadoresPorSolicitud,
  obtenerAprobadorPorId,
  obtenerFirmadosPorSolicitud
} from '../../infrastructure/db/dynamodb/aprobadorRepo';
import { generarPdfEvidencia } from '../../infrastructure/s3/pdfGenerator';
import { obtenerAprobadorIdPorToken } from '../../infrastructure/db/dynamodb/otpRepo';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const isBase64 = event.isBase64Encoded;
    const bodyString = isBase64
      ? Buffer.from(event.body || '', 'base64').toString('utf-8')
      : event.body || '{}';

    const body = JSON.parse(bodyString);
    const { solicitudId, token, accion } = body;

    if (!solicitudId || !token || !accion) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'solicitudId, token y accion son requeridos' }),
      };
    }

    const aprobadorId = await obtenerAprobadorIdPorToken(token);

    if (!aprobadorId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Token inválido o expirado' }),
      };
    }

    const resultado = await firmarSolicitud(
      { solicitudId, aprobadorId, accion },
      {
        obtenerSolicitudPorId,
        actualizarEstadoSolicitud,
        actualizarEstadoAprobador,
        obtenerFirmadosPorSolicitud,
        obtenerAprobadorPorId,
        obtenerAprobadoresPorSolicitud,
        generarPdfEvidencia,
      }
    );
    return {
      statusCode: resultado.statusCode || 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: resultado.body || JSON.stringify({ message: 'Operación completada' }),
    };
  } catch (error) {
    console.error('❌ Error firmando solicitud:', error);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'solicitudId, token y accion son requeridos' }),
    };

  }
};
