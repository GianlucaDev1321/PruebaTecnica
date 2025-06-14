import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient,   UpdateCommand,  GetCommand, } from '@aws-sdk/lib-dynamodb';
import { Solicitud } from '../../../domain/entities/Solicitud';
import { config } from '../../../config/config';
import { Aprobador } from '../../..//domain/entities/Aprobador';

const client = new DynamoDBClient({ region: config.awsRegion });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const guardarSolicitud = async (solicitud: Solicitud): Promise<void> => {
  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: config.solicitudesTable,
        Item: solicitud
      })
    );
  } catch (error) {
    console.error('Error guardando la solicitud en DynamoDB:', error);
    throw new Error('No se pudo guardar la solicitud');
  }
};

export const obtenerSolicitudPorId = async (id: string): Promise<Solicitud | null> => {
  const res = await client.send(
    new GetCommand({
      TableName: config.solicitudesTable,
      Key: { id },
    })
  );
  return res.Item as Solicitud | null;
};

export const actualizarEstadoSolicitud = async (
  id: string,
  estado: string
): Promise<void> => {
  console.log(`✅ Actualizando solicitud ${id} a estado: ${estado}`);
  await client.send(
    new UpdateCommand({
      TableName: config.solicitudesTable,
      Key: { id },
      UpdateExpression: 'set estado = :e',
      ExpressionAttributeValues: {
        ':e': estado,
      },
    })
  );
};


export const obtenerTodasLasSolicitudes = async (): Promise<Solicitud[]> => {
  try {
    const result = await ddbDocClient.send(
      new ScanCommand({
        TableName: config.solicitudesTable,
      })
    );

    return (result.Items ?? []).map((item: any) => ({
      id: item.id,
      titulo: item.titulo,
      descripcion: item.descripcion,
      monto: item.monto,
      solicitante: item.solicitante,
      estado: item.estado,
      fechaCreacion: item.fechaCreacion,
    }));
  } catch (error) {
    console.error('Error al obtener todas las solicitudes:', error);
    throw new Error('No se pudieron obtener las solicitudes');
  }
};

