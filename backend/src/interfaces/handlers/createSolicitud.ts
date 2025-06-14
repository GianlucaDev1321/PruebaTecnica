import { APIGatewayProxyHandler } from 'aws-lambda';
import { createSolicitud } from '../../application/usecases/createSolicitud.usecase';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    let body;
    if (event.isBase64Encoded) {
      body = JSON.parse(Buffer.from(event.body || '', 'base64').toString('utf8'));
    } else {
      body = JSON.parse(event.body || '{}');
    }
    const result = await createSolicitud(body);
    // return {
    //   statusCode: 201,
    //   body: JSON.stringify(result),
    // };
    return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*', // <-- CORS clave
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(result),
  };

  } catch (err: any) {
    return {
      statusCode: 400,
       headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
