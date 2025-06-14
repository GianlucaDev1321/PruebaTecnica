import { obtenerTodasLasSolicitudes } from '../../infrastructure/db/dynamodb/solicitudRepo';

export const listarSolicitudes = async () => {
  try {
    const solicitudes = await obtenerTodasLasSolicitudes();

    return {
      statusCode: 200,
      body: JSON.stringify(solicitudes),
    };
  } catch (error) {
    console.error('❌ Error en listarSolicitudes:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno al listar las solicitudes' }),
    };
  }
};
