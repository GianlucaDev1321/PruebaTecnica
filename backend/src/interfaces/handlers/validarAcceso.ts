

// import { APIGatewayProxyHandler } from 'aws-lambda';
// import { validarAcceso } from '../../application/usecases/validarAcceso.usecase';

// export const handler: APIGatewayProxyHandler = async (event) => {
//   const token = event.queryStringParameters?.token;

//   if (!token) {
//     return {
//       statusCode: 400,
//        headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Headers': 'Content-Type',
//       },
//       body: JSON.stringify({ message: 'Token es requerido' }),
//     };
//   }

//   const result = await validarAcceso(token);

//    return {
//     statusCode: 201,
//     headers: {
//       'Access-Control-Allow-Origin': '*', // <-- CORS clave
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//     body: JSON.stringify(result),
//    }
// };


import { APIGatewayProxyHandler } from 'aws-lambda';
import { validarAcceso } from '../../application/usecases/validarAcceso.usecase';

export const handler: APIGatewayProxyHandler = async (event) => {
  const token = event.queryStringParameters?.token;

  if (!token) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Token es requerido' }),
    };
  }

  try {
    const result = await validarAcceso(token);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('❌ Error al validar token:', error);

    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Token inválido o expirado' }),
    };
  }
};