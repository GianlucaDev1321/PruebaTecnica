import { APIGatewayProxyHandler } from 'aws-lambda';
import { obtenerTodasLasSolicitudes } from '../../infrastructure/db/dynamodb/solicitudRepo';

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const solicitudes = await obtenerTodasLasSolicitudes();
    return {
      statusCode: 200,
      headers: {
      'Access-Control-Allow-Origin': '*', // <-- CORS clave
      'Access-Control-Allow-Headers': 'Content-Type',
    },
      body: JSON.stringify(solicitudes),
    };
   

  } catch (err: any) {
    console.error('❌ Error en listarSolicitudes.handler:', err);
    return {
      statusCode: 500,
      headers: {
      'Access-Control-Allow-Origin': '*', // <-- CORS clave
      'Access-Control-Allow-Headers': 'Content-Type',
    },
      body: JSON.stringify({ error: 'No se pudieron obtener las solicitudes' }),
    };
  }
};
