


import { APIGatewayProxyHandler } from 'aws-lambda';
import { generarUrlFirmada } from '../../infrastructure/s3/pdfGenerator';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const solicitudId = event.pathParameters?.id;
    if (!solicitudId) {
      return {
        statusCode: 400,
        headers: {
      'Access-Control-Allow-Origin': '*', // <-- CORS clave
      'Access-Control-Allow-Headers': 'Content-Type',
    },
        body: JSON.stringify({ message: 'ID de solicitud requerido' }),
      };
    }

    console.log('📄 Generando URL para solicitud ID:', solicitudId);

    const key = `evidencias/${solicitudId}.pdf`;
    const url = await generarUrlFirmada(key);

    return {
      statusCode: 200,
      headers: {
      'Access-Control-Allow-Origin': '*', // <-- CORS clave
      'Access-Control-Allow-Headers': 'Content-Type',
    },
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    console.error('❌ Error generando la URL del PDF:', error);
    return {
      statusCode: 500,
      headers: {
      'Access-Control-Allow-Origin': '*', // <-- CORS clave
      'Access-Control-Allow-Headers': 'Content-Type',
    },
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
