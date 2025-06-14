import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
  QueryCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { config } from '../../../config/config';
import { Aprobador } from '../../../domain/entities/Aprobador';

// const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: config.awsRegion }));
import { client } from './dynamoClient';


export const obtenerAprobadorPorToken = async (token: string): Promise<Aprobador | null> => {
  const command = new QueryCommand({
    TableName: config.aprobadoresTable,
    IndexName: 'TokenIndex',
    KeyConditionExpression: 'token = :t',
    ExpressionAttributeValues: { ':t': token },
    Limit: 1,
  });
  const res = await client.send(command);
  return res.Items?.[0] as Aprobador | null;
};

export const actualizarEstadoAprobador = async (
  id: string,
  estado: string,
  fechaFirma: string
): Promise<void> => {
  await client.send(
    new UpdateCommand({
      TableName: config.aprobadoresTable,
      Key: { id },
      UpdateExpression: 'set estado = :e, fechaFirma = :f',
      ExpressionAttributeValues: {
        ':e': estado,
        ':f': fechaFirma,
      },
    })
  );
};



export const obtenerFirmadosPorSolicitud = async (
  solicitudId: string
): Promise<Aprobador[]> => {
  const command = new QueryCommand({
    TableName: config.aprobadoresTable,
    IndexName: 'SolicitudIndex',
    KeyConditionExpression: 'solicitudId = :id',
    FilterExpression: '#estado = :estado',
    ExpressionAttributeNames: {
      '#estado': 'estado', // estado no es reservado, pero es buena práctica
    },
    ExpressionAttributeValues: {
      ':id': solicitudId,
      ':estado': 'Firmado',
    },
  });

  const res = await client.send(command);
  console.log('🔎 Aprobadores firmados:', res.Items); // Agrega este log si no lo tienes
  return (res.Items || []) as Aprobador[];
};

export const obtenerAprobadorPorId = async (id: string): Promise<Aprobador | null> => {
  const command = new GetCommand({
    TableName: config.aprobadoresTable,
    Key: { id },
  });

  const result = await client.send(command);
  return result.Item as Aprobador | null;
};


export const guardarAprobador = async (aprobador: Aprobador, solicitudId: string): Promise<void> => {
  await client.send(
    new PutCommand({
      TableName: config.aprobadoresTable,
      Item: {
        ...aprobador,
        solicitudId,
      },
    })
  );
};

export const obtenerAprobadoresPorSolicitud = async (
  solicitudId: string
): Promise<Aprobador[]> => {
  const command = new QueryCommand({
    TableName: config.aprobadoresTable,
    IndexName: 'SolicitudIndex',
    KeyConditionExpression: 'solicitudId = :id',
    ExpressionAttributeValues: {
      ':id': solicitudId,
    },
  });

  const res = await client.send(command);
  return (res.Items || []) as Aprobador[];
};

